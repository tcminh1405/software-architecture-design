// src/services/ticket-view.service.ts (Query Side)
import { db } from '../infrastructure/mock-db';
import { Trip, Ticket } from '../domain/models';

export class TicketViewService {
    /**
     * Search Trips (Query)
     * Tối ưu hóa cho việc tìm kiếm chuyến tàu
     */
    searchTrips(from?: string, to?: string): Trip[] {
        let trips = Array.from(db.trips.values());
        
        if (from) {
            trips = trips.filter(t => t.from.toLowerCase() === from.toLowerCase());
        }
        if (to) {
            trips = trips.filter(t => t.to.toLowerCase() === to.toLowerCase());
        }

        return trips;
    }

    /**
     * Get Tickets (Query)
     */
    getTickets(): Ticket[] {
        return Array.from(db.tickets.values());
    }

    getTicketById(id: string): Ticket | undefined {
        return db.tickets.get(id);
    }
}

export const ticketViewService = new TicketViewService();
