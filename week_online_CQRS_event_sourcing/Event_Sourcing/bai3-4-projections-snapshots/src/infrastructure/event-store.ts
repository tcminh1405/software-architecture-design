// src/infrastructure/event-store.ts
import { AccountEvent, AccountSnapshot } from '../domain/types';

class EventStore {
    private streams: Map<string, AccountEvent[]> = new Map();
    private snapshots: Map<string, AccountSnapshot[]> = new Map();

    save(streamId: string, event: AccountEvent): void {
        if (!this.streams.has(streamId)) this.streams.set(streamId, []);
        this.streams.get(streamId)!.push(event);
    }

    getEvents(streamId: string, fromVersion: number = 0): AccountEvent[] {
        const stream = this.streams.get(streamId) || [];
        return stream.filter(e => e.version > fromVersion);
    }

    // --- Exercise 4: Snapshots ---

    saveSnapshot(streamId: string, snapshot: AccountSnapshot): void {
        if (!this.snapshots.has(streamId)) this.snapshots.set(streamId, []);
        this.snapshots.get(streamId)!.push(snapshot);
        console.log(`[Snapshot] Saved snapshot for ${streamId} at version ${snapshot.version}`);
    }

    getLatestSnapshot(streamId: string): AccountSnapshot | null {
        const snapshots = this.snapshots.get(streamId) || [];
        return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
    }

    getTotalEventCount(streamId: string): number {
        return (this.streams.get(streamId) || []).length;
    }
}

export const eventStore = new EventStore();
