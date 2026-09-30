# transfers

A minimal event-driven TypeScript app (no runtime dependencies) that simulates money transfers using `EventEmitter`.

## Flow

```
requestTransfer() ──emit──> transfer.requested
                               │
                     transferService validates
                        │                 │
         transfer.completed        transfer.failed
          │          │                    │
       logger     notifier              logger
```

## Run

```bash
npm start   # run the demo
npm test    # run tests (node:test)
npm run typecheck  # type-check with tsc
```

Requires Node 22.18+ (runs `.ts` files directly, no build step). Run `npm install` once for type checking.
