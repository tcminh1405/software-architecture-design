// src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { eventStore } from './infrastructure/event-store';
import { AccountAggregate } from './domain/account.aggregate';
import { AccountEvent } from './domain/events';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

/** 
 * LƯU Ý: Đây là hệ thống Event Sourcing thuần.
 * Mọi thao tác đều sinh ra Event và lưu vào Event Store.
 */

// --- Commands ---

app.post('/account/commands', (req, res) => {
    const { type, payload } = req.body;
    const streamId = 'main-account'; // Giả định dùng 1 tài khoản duy nhất để demo

    const event: AccountEvent = {
        id: uuidv4(),
        type,
        occurredAt: new Date(),
        payload
    } as any;

    eventStore.save(streamId, event);
    res.json({ success: true, event });
});

app.post('/account/undo', (req, res) => {
    eventStore.removeLastEvent('main-account');
    res.json({ success: true });
});

// --- Queries ---

app.get('/account/state', (req, res) => {
    const streamId = 'main-account';
    const index = req.query.index ? parseInt(req.query.index as string) : undefined;
    
    let events = eventStore.getEvents(streamId);
    if (index !== undefined) {
        events = eventStore.getEventsUntil(streamId, index);
    }

    const aggregate = new AccountAggregate();
    aggregate.replay(events);
    
    res.json({ 
        success: true, 
        state: aggregate.getState(), 
        eventCount: events.length,
        totalEvents: eventStore.getEvents(streamId).length
    });
});

app.get('/account/events', (req, res) => {
    res.json({ success: true, data: eventStore.getEvents('main-account') });
});

app.listen(PORT, () => {
    console.log(`🚀 ES BÀI 1-2 Bank Account running at http://localhost:${PORT}`);
});
