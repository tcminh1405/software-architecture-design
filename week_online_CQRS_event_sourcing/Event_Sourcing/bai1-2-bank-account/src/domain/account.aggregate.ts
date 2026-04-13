// src/domain/account.aggregate.ts
import { AccountEvent } from './events';

export interface AccountState {
    owner: string;
    balance: number;
    version: number;
}

export class AccountAggregate {
    private state: AccountState = { owner: '', balance: 0, version: 0 };

    /**
     * apply(event): Cập nhật state từ 1 event
     */
    apply(event: AccountEvent): void {
        switch (event.type) {
            case 'AccountCreated':
                this.state.owner = event.payload.owner;
                this.state.balance = event.payload.initialBalance;
                break;
            case 'MoneyDeposited':
                this.state.balance += event.payload.amount;
                break;
            case 'MoneyWithdrawn':
                this.state.balance -= event.payload.amount;
                break;
        }
        this.state.version++;
    }

    /**
     * replay(events): Dựng lại state từ một mảng events
     */
    replay(events: AccountEvent[]): void {
        // Reset state trước khi replay
        this.state = { owner: '', balance: 0, version: 0 };
        events.forEach(e => this.apply(e));
    }

    getState(): AccountState {
        return { ...this.state };
    }
}
