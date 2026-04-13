// src/infrastructure/order.projection.ts
import { OrderEvent } from '../domain/events';

export interface OrderView {
    orderId: string;
    customerName: string;
    items: { productId: string; name: string; price: number; quantity: number }[];
    totalPrice: number;
    status: string;
    lastEvent: string;
    updatedAt: Date;
}

class OrderProjection {
    private viewModels: Map<string, OrderView> = new Map();

    /**
     * Projector: Xây dựng Read Model từ Event
     */
    project(event: OrderEvent) {
        let view = this.viewModels.get(event.orderId);

        switch (event.type) {
            case 'OrderCreated':
                view = {
                    orderId: event.orderId,
                    customerName: event.payload.customerName,
                    items: [],
                    totalPrice: 0,
                    status: 'created',
                    lastEvent: event.type,
                    updatedAt: event.occurredAt
                };
                break;

            case 'ItemAdded':
                if (view) {
                    view.items.push(event.payload);
                    view.totalPrice += event.payload.price * event.payload.quantity;
                }
                break;

            case 'ItemRemoved':
                if (view) {
                    const idx = view.items.findIndex(i => i.productId === event.payload.productId);
                    if (idx !== -1) {
                        const removed = view.items.splice(idx, 1)[0];
                        view.totalPrice -= removed.price * removed.quantity;
                    }
                }
                break;

            case 'OrderConfirmed':
                if (view) view.status = 'confirmed';
                break;
        }

        if (view) {
            view.lastEvent = event.type;
            view.updatedAt = event.occurredAt;
            this.viewModels.set(event.orderId, view);
        }
    }

    getViewById(id: string): OrderView | undefined {
        return this.viewModels.get(id);
    }

    getAllViews(): OrderView[] {
        return Array.from(this.viewModels.values());
    }
}

export const orderProjection = new OrderProjection();
