// src/domain/events.ts
export interface OrderEvent {
    id: string;
    orderId: string;
    type: 'OrderCreated' | 'ItemAdded' | 'ItemRemoved' | 'OrderConfirmed';
    payload: any;
    occurredAt: Date;
    version: number;
}
