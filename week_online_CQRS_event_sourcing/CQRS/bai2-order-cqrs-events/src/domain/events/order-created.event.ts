import { DomainEvent } from './base.event';
import { OrderItem } from '../order.entity';

export interface OrderCreatedEvent extends DomainEvent {
  eventType: 'OrderCreated';
  payload: {
    customerId: string;
    customerName: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending';
  };
}

export function createOrderCreatedEvent(orderId: string, payload: any): OrderCreatedEvent {
  return { eventType: 'OrderCreated', aggregateId: orderId, occurredAt: new Date(), payload };
}
