// src/domain/events.ts
export interface BaseEvent {
    id: string;
    type: string;
    occurredAt: Date;
}

export interface AccountCreatedEvent extends BaseEvent {
    type: 'AccountCreated';
    payload: { owner: string; initialBalance: number };
}

export interface MoneyDepositedEvent extends BaseEvent {
    type: 'MoneyDeposited';
    payload: { amount: number };
}

export interface MoneyWithdrawnEvent extends BaseEvent {
    type: 'MoneyWithdrawn';
    payload: { amount: number };
}

export type AccountEvent = AccountCreatedEvent | MoneyDepositedEvent | MoneyWithdrawnEvent;
