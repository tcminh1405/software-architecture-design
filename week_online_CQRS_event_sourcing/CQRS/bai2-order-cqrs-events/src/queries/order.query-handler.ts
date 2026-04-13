import { orderReadStore, OrderReadModel } from '../infrastructure/order.read-store';

export class OrderQueryHandler {
  handleGetAll(): OrderReadModel[] { return orderReadStore.findAll(); }
  handleGetById(orderId: string): OrderReadModel | null { return orderReadStore.findById(orderId) ?? null; }
}

export const orderQueryHandler = new OrderQueryHandler();
