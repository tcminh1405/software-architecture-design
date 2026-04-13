import { DomainEvent } from '../domain/events/base.event';

type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void;

class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private events: DomainEvent[] = []; // Lưu lịch sử events cho UI

  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventType)) this.handlers.set(eventType, []);
    this.handlers.get(eventType)!.push(handler as EventHandler);
  }

  publish<T extends DomainEvent>(event: T): void {
    this.events.unshift(event); // Thêm vào đầu mảng
    if (this.events.length > 50) this.events.pop(); // Giới hạn 50 events

    const handlers = this.handlers.get(event.eventType) ?? [];
    handlers.forEach((h) => h(event));
  }

  getEvents(): DomainEvent[] {
    return this.events;
  }
}

export const eventBus = new EventBus();
