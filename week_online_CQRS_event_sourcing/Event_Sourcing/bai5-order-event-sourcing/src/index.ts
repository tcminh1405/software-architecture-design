// src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { eventStore } from './infrastructure/event-store';
import { orderProjection } from './infrastructure/order.projection';
import { OrderEvent } from './domain/events';

const app = express();
const PORT = 5003;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// --- Write Service (Command) ---

app.post('/commands', (req, res) => {
    const { type, orderId, payload } = req.body;
    
    // 1. Generate new event
    const event: OrderEvent = {
        id: uuidv4(),
        orderId: orderId || uuidv4(),
        type,
        payload,
        occurredAt: new Date(),
        version: eventStore.getEventsForOrder(orderId).length + 1
    };

    // 2. Persist to Event Store
    eventStore.append(event);

    // 3. Trigger Projection Update (Async simulation)
    // Trong thực tế sẽ gửi qua Message Bus
    setTimeout(() => {
        orderProjection.project(event);
    }, 100);

    res.json({ success: true, orderId: event.orderId, event });
});

// --- Read Service (Query) ---

app.get('/orders', (req, res) => {
    res.json({ success: true, data: orderProjection.getAllViews() });
});

app.get('/orders/:id/events', (req, res) => {
    res.json({ success: true, data: eventStore.getEventsForOrder(req.params.id) });
});

app.listen(PORT, () => {
    console.log(`🚀 ES BÀI 5: Order System ES+CQRS running at http://localhost:${PORT}`);
});
