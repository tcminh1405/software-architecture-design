import { v4 as uuidv4 } from 'uuid';
import { Order } from '../domain/order.entity';
import { orderWriteStore } from '../infrastructure/order.write-store';
import { eventBus } from '../infrastructure/event-bus';
import { createOrderCreatedEvent } from '../domain/events/order-created.event';
import { createOrderCancelledEvent } from '../domain/events/order-cancelled.event';
import { CreateOrderCommand, CancelOrderCommand } from './order.commands';

export class OrderCommandHandler {
  handleCreate(cmd: CreateOrderCommand): Order {
    const totalAmount = cmd.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const order: Order = {
      id: uuidv4(),
      customerId: cmd.customerId,
      customerName: cmd.customerName,
      items: cmd.items,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    orderWriteStore.save(order);
    eventBus.publish(createOrderCreatedEvent(order.id, order));
    return order;
  }

  handleCancel(cmd: CancelOrderCommand): Order {
    const existing = orderWriteStore.findById(cmd.orderId);
    if (!existing) throw new Error('Order not found');
    const cancelled: Order = { ...existing, status: 'cancelled', updatedAt: new Date() };
    orderWriteStore.save(cancelled);
    eventBus.publish(createOrderCancelledEvent(cmd.orderId, cmd.reason));
    return cancelled;
  }
}

export const orderCommandHandler = new OrderCommandHandler();
