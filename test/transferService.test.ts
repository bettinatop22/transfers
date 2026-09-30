import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Events, createBus, type CompletedTransfer, type FailedTransfer } from '../src/events.ts';
import { createAccounts } from '../src/accounts.ts';
import { registerTransferService, requestTransfer } from '../src/transferService.ts';

function setup() {
  const bus = createBus();
  const accounts = createAccounts({ alice: 100, bob: 0 });
  registerTransferService(bus, accounts);
  return { bus, accounts };
}

test('completes a valid transfer and moves funds', () => {
  const { bus, accounts } = setup();
  let completed: CompletedTransfer | undefined;
  bus.on(Events.TRANSFER_COMPLETED, (t) => (completed = t));

  const id = requestTransfer(bus, { from: 'alice', to: 'bob', amount: 40 });

  assert.equal(completed?.id, id);
  assert.equal(accounts.balance('alice'), 60);
  assert.equal(accounts.balance('bob'), 40);
});

test('fails on insufficient funds without moving money', () => {
  const { bus, accounts } = setup();
  let failed: FailedTransfer | undefined;
  bus.on(Events.TRANSFER_FAILED, (t) => (failed = t));

  requestTransfer(bus, { from: 'bob', to: 'alice', amount: 1 });

  assert.equal(failed?.reason, 'insufficient funds');
  assert.equal(accounts.balance('alice'), 100);
});

test('fails for unknown accounts', () => {
  const { bus } = setup();
  let failed: FailedTransfer | undefined;
  bus.on(Events.TRANSFER_FAILED, (t) => (failed = t));

  requestTransfer(bus, { from: 'alice', to: 'carol', amount: 1 });

  assert.match(failed?.reason ?? '', /unknown account carol/);
});
