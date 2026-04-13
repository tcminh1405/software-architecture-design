// src/domain/types.ts
export interface AccountEvent {
    id: string;
    type: 'AccountCreated' | 'MoneyDeposited' | 'MoneyWithdrawn';
    payload: any;
    occurredAt: Date;
    version: number;
}

export interface AccountSnapshot {
    balance: number;
    owner: string;
    version: number;
    timestamp: Date;
}
