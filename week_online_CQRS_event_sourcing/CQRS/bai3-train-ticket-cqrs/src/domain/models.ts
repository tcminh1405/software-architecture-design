// src/domain/models.ts

export interface Trip {
    id: string;
    trainNumber: string;
    from: string;
    to: string;
    departureTime: Date;
    totalSeats: number;
    availableSeats: number;
}

export interface Ticket {
    id: string;
    tripId: string;
    passengerName: string;
    seatNumber: number;
    bookedAt: Date;
    status: 'booked' | 'cancelled';
}
