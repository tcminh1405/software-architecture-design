// src/infrastructure/event-store.ts
import { OrderEvent } from '../domain/events';

class EventStore {
    private logs: OrderEvent[] = []; // Biến lưu log toàn bộ hệ thống

    append(event: OrderEvent) {
        this.logs.push(event);
        console.log(`[EventStore] Appended ${event.type} for Order ${event.orderId}`);
    }

    getEventsForOrder(orderId: string): OrderEvent[] {
        return this.logs.filter(e => e.orderId === orderId);
    }

    getAllEvents(): OrderEvent[] {
        return [...this.logs];
    }
}

export const eventStore = new EventStore();
