import { DomainEvent } from './base.event';

export interface OrderCancelledEvent extends DomainEvent {
  eventType: 'OrderCancelled';
  payload: { reason: string; cancelledAt: Date };
}

export function createOrderCancelledEvent(orderId: string, reason: string): OrderCancelledEvent {
  return { eventType: 'OrderCancelled', aggregateId: orderId, occurredAt: new Date(), payload: { reason, cancelledAt: new Date() } };
}
