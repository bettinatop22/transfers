import { Events, type Bus } from '../events.ts';

export function registerLogger(bus: Bus): void {
  bus.on(Events.TRANSFER_REQUESTED, (t) =>
    console.log(`[requested] ${t.from} -> ${t.to}: ${t.amount}`));
  bus.on(Events.TRANSFER_COMPLETED, (t) =>
    console.log(`[completed] ${t.id}`));
  bus.on(Events.TRANSFER_FAILED, (t) =>
    console.log(`[failed]    ${t.id}: ${t.reason}`));
}
