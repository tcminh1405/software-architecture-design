// src/infrastructure/mock-db.ts
import { Trip, Ticket } from '../domain/models';

class MockTrainDB {
    public trips: Map<string, Trip> = new Map();
    public tickets: Map<string, Ticket> = new Map();

    constructor() {
        // Seed some data
        const trip1: Trip = {
            id: 'trip-101',
            trainNumber: 'SE1',
            from: 'Hanoi',
            to: 'Saigon',
            departureTime: new Date('2026-05-01T08:00:00Z'),
            totalSeats: 100,
            availableSeats: 100
        };
        const trip2: Trip = {
            id: 'trip-102',
            trainNumber: 'SE3',
            from: 'Danang',
            to: 'Hanoi',
            departureTime: new Date('2026-05-02T20:00:00Z'),
            totalSeats: 50,
            availableSeats: 5
        };
        this.trips.set(trip1.id, trip1);
        this.trips.set(trip2.id, trip2);
    }
}

export const db = new MockTrainDB();
