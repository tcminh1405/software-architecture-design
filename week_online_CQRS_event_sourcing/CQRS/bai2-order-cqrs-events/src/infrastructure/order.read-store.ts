import { Order } from '../domain/order.entity';

export interface OrderReadModel {
  id: string;
  customerId: string;
  customerName: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

class OrderReadStore {
  private readModels: Map<string, OrderReadModel> = new Map();

  sync(order: Order): void {
    this.readModels.set(order.id, {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  }

  findById(id: string): OrderReadModel | undefined { return this.readModels.get(id); }
  findAll(): OrderReadModel[] { return Array.from(this.readModels.values()); }
}

export const orderReadStore = new OrderReadStore();
