// In-memory account store.
export interface Accounts {
  balance(id: string): number | undefined;
  exists(id: string): boolean;
  move(from: string, to: string, amount: number): void;
}

export function createAccounts(initial: Record<string, number> = {}): Accounts {
  const balances = new Map(Object.entries(initial));

  return {
    balance: (id) => balances.get(id),
    exists: (id) => balances.has(id),
    move(from, to, amount) {
      balances.set(from, balances.get(from)! - amount);
      balances.set(to, balances.get(to)! + amount);
    },
  };
}
