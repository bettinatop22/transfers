import { Events, type Bus } from '../events.ts';

// Stand-in for sending emails/push notifications.
export function registerNotifier(bus: Bus): void {
  bus.on(Events.TRANSFER_COMPLETED, (t) =>
    console.log(`[notify]    ${t.to}: you received ${t.amount} from ${t.from}`));
}
