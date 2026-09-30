import { bus } from './events.ts';
import { createAccounts } from './accounts.ts';
import { registerTransferService, requestTransfer } from './transferService.ts';
import { registerLogger } from './listeners/logger.ts';
import { registerNotifier } from './listeners/notifier.ts';

const accounts = createAccounts({ alice: 100, bob: 50 });

registerLogger(bus);
registerTransferService(bus, accounts);
registerNotifier(bus);

requestTransfer(bus, { from: 'alice', to: 'bob', amount: 30 });
requestTransfer(bus, { from: 'bob', to: 'alice', amount: 500 });
requestTransfer(bus, { from: 'alice', to: 'carol', amount: 10 });

console.log('\nBalances:', { alice: accounts.balance('alice'), bob: accounts.balance('bob') });
