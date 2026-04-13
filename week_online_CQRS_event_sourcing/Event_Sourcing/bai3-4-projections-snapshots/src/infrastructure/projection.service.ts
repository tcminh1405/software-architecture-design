// src/infrastructure/projection.service.ts
import { AccountEvent } from '../domain/types';

/**
 * Exercise 3: Projection (Read Model)
 * Tách Write và Read model
 */
export interface AccountSummary {
    owner: string;
    balance: number;
    totalDeposits: number;
    transactionCount: number;
    lastUpdated: Date;
}

class ProjectionService {
    // Read Model (tốc độ truy vấn cao, không cần replay mỗi lần)
    private readModel: Map<string, AccountSummary> = new Map();

    /**
     * Update Projection (Projector)
     * Thường chạy bất đồng bộ trong thực tế
     */
    async handleEvent(streamId: string, event: AccountEvent) {
        let summary = this.readModel.get(streamId) || {
            owner: '',
            balance: 0,
            totalDeposits: 0,
            transactionCount: 0,
            lastUpdated: new Date()
        };

        switch (event.type) {
            case 'AccountCreated':
                summary.owner = event.payload.owner;
                summary.balance = event.payload.initialBalance;
                summary.totalDeposits += event.payload.initialBalance;
                break;
            case 'MoneyDeposited':
                summary.balance += event.payload.amount;
                summary.totalDeposits += event.payload.amount;
                break;
            case 'MoneyWithdrawn':
                summary.balance -= event.payload.amount;
                break;
        }

        summary.transactionCount++;
        summary.lastUpdated = event.occurredAt;
        this.readModel.set(streamId, summary);
        
        console.log(`[Projection] Updated summary for ${streamId}. Balance: ${summary.balance}`);
    }

    getSummary(streamId: string): AccountSummary | null {
        return this.readModel.get(streamId) || null;
    }
}

export const projectionService = new ProjectionService();
