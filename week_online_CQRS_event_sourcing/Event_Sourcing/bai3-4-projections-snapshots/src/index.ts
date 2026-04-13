// src/index.ts
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { eventStore } from './infrastructure/event-store';
import { projectionService } from './infrastructure/projection.service';
import { AccountEvent, AccountSnapshot } from './domain/types';

const app = express();
const PORT = 5002;
const STREAM_ID = 'corporate-account';
const SNAPSHOT_THRESHOLD = 5; // Lưu snapshot sau mỗi 5 events

app.use(cors());
app.use(express.json());

// --- Write Side (Command) ---

app.post('/commands', async (req, res) => {
    const { type, payload } = req.body;
    const version = eventStore.getTotalEventCount(STREAM_ID) + 1;

    const event: AccountEvent = {
        id: uuidv4(),
        type,
        payload,
        occurredAt: new Date(),
        version
    };

    // 1. Lưu Event
    eventStore.save(STREAM_ID, event);

    // 2. Cập nhật Projection (ASync)
    projectionService.handleEvent(STREAM_ID, event);

    // 3. Kiểm tra Snapshot Optimization (Exercise 4)
    if (version % SNAPSHOT_THRESHOLD === 0) {
        // Dựng state hiện tại để làm snapshot
        const summary = projectionService.getSummary(STREAM_ID);
        if (summary) {
            const snapshot: AccountSnapshot = {
                owner: summary.owner,
                balance: summary.balance,
                version: version,
                timestamp: new Date()
            };
            eventStore.saveSnapshot(STREAM_ID, snapshot);
        }
    }

    res.json({ success: true, event });
});

// --- Read Side (Query) ---

/**
 * Lấy số dư sử dụng cơ chế OPTIMIZED REPLAY (Snapshot)
 */
app.get('/balance/optimized', (req, res) => {
    const startTime = performance.now();
    
    // 1. Tìm Snapshot gần nhất
    const latestSnapshot = eventStore.getLatestSnapshot(STREAM_ID);
    
    let currentBalance = 0;
    let startVersion = 0;
    let usedSnapshot = false;

    if (latestSnapshot) {
        currentBalance = latestSnapshot.balance;
        startVersion = latestSnapshot.version;
        usedSnapshot = true;
    }

    // 2. Chỉ replay các event mới sau snapshot
    const remainingEvents = eventStore.getEvents(STREAM_ID, startVersion);
    remainingEvents.forEach(e => {
        if (e.type === 'MoneyDeposited') currentBalance += e.payload.amount;
        if (e.type === 'MoneyWithdrawn') currentBalance -= e.payload.amount;
        if (e.type === 'AccountCreated') currentBalance = e.payload.initialBalance;
    });

    const endTime = performance.now();

    res.json({
        success: true,
        balance: currentBalance,
        stats: {
            usedSnapshot,
            snapshotVersion: startVersion,
            eventsReplayed: remainingEvents.length,
            totalEvents: eventStore.getTotalEventCount(STREAM_ID),
            executionTimeMs: (endTime - startTime).toFixed(4)
        }
    });
});

/**
 * Lấy Summary từ PROJECTION (Cực nhanh, O(1))
 */
app.get('/summary', (req, res) => {
    const summary = projectionService.getSummary(STREAM_ID);
    res.json({ success: true, data: summary });
});

app.listen(PORT, () => {
    console.log(`🚀 ES BÀI 3-4 (Projection & Snapshot) running at http://localhost:${PORT}`);
});
