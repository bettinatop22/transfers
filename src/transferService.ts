// Listens for transfer requests, validates them, and emits the outcome.
import { randomUUID } from 'node:crypto';
import { Events, type Bus, type TransferRequest } from './events.ts';
import type { Accounts } from './accounts.ts';

export function registerTransferService(bus: Bus, accounts: Accounts): void {
  bus.on(Events.TRANSFER_REQUESTED, (transfer) => {
    const error = validate(transfer, accounts);
    if (error) {
      bus.emit(Events.TRANSFER_FAILED, { ...transfer, reason: error });
      return;
    }
    accounts.move(transfer.from, transfer.to, transfer.amount);
    bus.emit(Events.TRANSFER_COMPLETED, { ...transfer, completedAt: new Date() });
  });
}

export function requestTransfer(bus: Bus, { from, to, amount }: TransferRequest): string {
  const transfer = { id: randomUUID(), from, to, amount };
  bus.emit(Events.TRANSFER_REQUESTED, transfer);
  return transfer.id;
}

function validate({ from, to, amount }: TransferRequest, accounts: Accounts): string | null {
  if (!accounts.exists(from)) return `unknown account ${from}`;
  if (!accounts.exists(to)) return `unknown account ${to}`;
  if (from === to) return 'cannot transfer to the same account';
  if (!Number.isFinite(amount) || amount <= 0) return 'amount must be positive';
  if (accounts.balance(from)! < amount) return 'insufficient funds';
  return null;
}
