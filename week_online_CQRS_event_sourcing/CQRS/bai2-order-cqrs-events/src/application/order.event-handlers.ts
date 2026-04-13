import { eventBus } from '../infrastructure/event-bus';
import { orderWriteStore } from '../infrastructure/order.write-store';
import { orderReadStore } from '../infrastructure/order.read-store';
import { OrderCreatedEvent } from '../domain/events/order-created.event';
import { OrderCancelledEvent } from '../domain/events/order-cancelled.event';

eventBus.subscribe<OrderCreatedEvent>('OrderCreated', (event) => {
  const order = orderWriteStore.findById(event.aggregateId);
  if (order) orderReadStore.sync(order);
});

eventBus.subscribe<OrderCancelledEvent>('OrderCancelled', (event) => {
  const order = orderWriteStore.findById(event.aggregateId);
  if (order) orderReadStore.sync(order);
});
