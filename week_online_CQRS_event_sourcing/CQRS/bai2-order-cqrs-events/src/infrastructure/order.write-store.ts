import { Order } from '../domain/order.entity';

class OrderWriteStore {
  private orders: Map<string, Order> = new Map();
  save(order: Order): void { this.orders.set(order.id, { ...order }); }
  findById(id: string): Order | undefined { return this.orders.get(id); }
}

export const orderWriteStore = new OrderWriteStore();
