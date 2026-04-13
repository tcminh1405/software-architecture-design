// src/infrastructure/event-store.ts
import { AccountEvent } from '../domain/events';

class EventStore {
    private streams: Map<string, AccountEvent[]> = new Map();

    save(streamId: string, event: AccountEvent): void {
        if (!this.streams.has(streamId)) {
            this.streams.set(streamId, []);
        }
        this.streams.get(streamId)!.push(event);
    }

    getEvents(streamId: string): AccountEvent[] {
        return this.streams.get(streamId) || [];
    }

    // Lấy state tại thời điểm index cụ thể (Exercise 2)
    getEventsUntil(streamId: string, index: number): AccountEvent[] {
        const fullStream = this.getEvents(streamId);
        return fullStream.slice(0, index + 1);
    }

    // Undo: Xóa event cuối cùng (Exercise 2)
    removeLastEvent(streamId: string): void {
        const stream = this.streams.get(streamId);
        if (stream && stream.length > 0) {
            stream.pop();
        }
    }
}

export const eventStore = new EventStore();
