// src/index.ts
import express from 'express';
import { ticketService } from './services/ticket.service';
import { ticketViewService } from './services/ticket-view.service';

import path from 'path';

const app = express();
const PORT = 3003;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// --- Query Routes (Read Side) ---

/** GET /trips - Tìm chuyến tàu */
app.get('/trips', (req, res) => {
    const { from, to } = req.query as { from?: string, to?: string };
    const trips = ticketViewService.searchTrips(from, to);
    res.json({ success: true, count: trips.length, data: trips });
});

/** GET /tickets - Xem danh sách vé */
app.get('/tickets', (req, res) => {
    const tickets = ticketViewService.getTickets();
    res.json({ success: true, count: tickets.length, data: tickets });
});

/** GET /tickets/:id - Chi tiết vé */
app.get('/tickets/:id', (req, res) => {
    const ticket = ticketViewService.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
    res.json({ success: true, data: ticket });
});

// --- Command Routes (Write Side) ---

/** POST /tickets - Đặt vé */
app.post('/tickets', (req, res) => {
    try {
        const { tripId, passengerName } = req.body;
        const ticket = ticketService.bookTicket(tripId, passengerName);
        res.status(201).json({ success: true, message: 'Đặt vé thành công', data: ticket });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
});

/** DELETE /tickets/:id - Hủy vé */
app.delete('/tickets/:id', (req, res) => {
    try {
        ticketService.cancelTicket(req.params.id);
        res.json({ success: true, message: 'Hủy vé thành công' });
    } catch (err: any) {
        res.status(404).json({ success: false, message: err.message });
    }
});

app.get('/', (req, res) => {
    res.json({
        app: 'Bài 3: Train Ticket System CQRS',
        endpoints: {
            command: ['POST /tickets', 'DELETE /tickets/:id'],
            query: ['GET /trips', 'GET /tickets', 'GET /tickets/:id']
        }
    });
});

app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`🚀 BÀI 3: TRAIN TICKET SYSTEM chạy tại:`);
    console.log(`   http://localhost:${PORT}`);
    console.log('==============================================');
    console.log('📝 ENDPOINTS:');
    console.log(`👉 [GET]    http://localhost:${PORT}/trips (Tìm chuyến)`);
    console.log(`👉 [POST]   http://localhost:${PORT}/tickets (Đặt vé)`);
    console.log(`👉 [DELETE] http://localhost:${PORT}/tickets/{id} (Hủy vé)`);
    console.log('==============================================');
});
