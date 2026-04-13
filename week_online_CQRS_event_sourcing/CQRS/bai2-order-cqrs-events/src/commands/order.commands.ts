import { OrderItem } from '../domain/order.entity';

export interface CreateOrderCommand {
  customerId: string;
  customerName: string;
  items: OrderItem[];
}

export interface CancelOrderCommand {
  orderId: string;
  reason: string;
}
