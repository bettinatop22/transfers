// Central event bus and event names shared across the app.
import { EventEmitter } from 'node:events';

export interface TransferRequest {
  from: string;
  to: string;
  amount: number;
}

export interface Transfer extends TransferRequest {
  id: string;
}

export interface CompletedTransfer extends Transfer {
  completedAt: Date;
}

export interface FailedTransfer extends Transfer {
  reason: string;
}

export const Events = {
  TRANSFER_REQUESTED: 'transfer.requested',
  TRANSFER_COMPLETED: 'transfer.completed',
  TRANSFER_FAILED: 'transfer.failed',
} as const;

// Maps each event name to its listener arguments, so emit/on are type-checked.
export type EventMap = {
  [Events.TRANSFER_REQUESTED]: [Transfer];
  [Events.TRANSFER_COMPLETED]: [CompletedTransfer];
  [Events.TRANSFER_FAILED]: [FailedTransfer];
};

export type Bus = EventEmitter<EventMap>;

export const createBus = (): Bus => new EventEmitter<EventMap>();

export const bus = createBus();
