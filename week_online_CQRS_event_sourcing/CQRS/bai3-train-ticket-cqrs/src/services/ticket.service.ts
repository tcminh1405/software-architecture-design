// src/services/ticket.service.ts (Command Side)
import { v4 as uuidv4 } from 'uuid';
import { db } from '../infrastructure/mock-db';
import { Ticket } from '../domain/models';

export class TicketService {
    /**
     * Book Ticket (Command)
     * - Validate seat availability
     * - Logic: Atomic decrease of availableSeats
     */
    bookTicket(tripId: string, passengerName: string): Ticket {
        const trip = db.trips.get(tripId);
        if (!trip) throw new Error('Chuyến tàu không tồn tại.');
        
        if (trip.availableSeats <= 0) {
            throw new Error('Hết ghế trống!');
        }

        // 1. Logic chuẩn: Giảm số ghế trống
        trip.availableSeats -= 1;

        // 2. Ghi DB (Command Side Write)
        const ticket: Ticket = {
            id: uuidv4(),
            tripId: tripId,
            passengerName: passengerName,
            seatNumber: trip.totalSeats - trip.availableSeats, // Giả định số ghế
            bookedAt: new Date(),
            status: 'booked'
        };
        db.tickets.set(ticket.id, ticket);

        console.log(`[Command] Booked ticket ${ticket.id} for ${passengerName}`);
        return ticket;
    }

    /**
     * Cancel Ticket (Command)
     */
    cancelTicket(ticketId: string): void {
        const ticket = db.tickets.get(ticketId);
        if (!ticket) throw new Error('Vé không tồn tại.');
        if (ticket.status === 'cancelled') throw new Error('Vé đã hủy rồi.');

        const trip = db.trips.get(ticket.tripId);
        if (trip) {
            trip.availableSeats += 1; // Hoàn lại ghế
        }

        ticket.status = 'cancelled';
        console.log(`[Command] Cancelled ticket ${ticketId}`);
    }
}

export const ticketService = new TicketService();
