import { CodEmailError, codOrderMessage, type CodEmailStore } from './cod-email.js';
import { readPublicOrder } from './firebase-public.js';

export function createCodEmailStore(readOrder: (id: string) => Promise<unknown>): CodEmailStore {
  return {
    reserve: async (id, now) => {
      const order = await readOrder(id);
      if (!order) throw new CodEmailError(404, 'Order not found');
      return {
        order: codOrderMessage(order, now),
        sent: false,
        expires: now + 23 * 3600000,
        leaseUntil: 0,
      };
    },
    complete: async () => {},
    release: async () => {},
  };
}

export function codEmailStore(): CodEmailStore {
  return createCodEmailStore(readPublicOrder);
}
