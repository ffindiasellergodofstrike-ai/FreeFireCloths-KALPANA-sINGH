import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../firebase-applet-config.json';
import { CodEmailError, codOrderMessage, recipientKey, type CodEmailStore, type EmailJob } from './cod-email';

function database() {
  const name = 'order-email-server';
  let app = getApps().find(app => app.name === name);
  if (!app) {
    const value = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const account = value ? JSON.parse(value) : undefined;
    if (account && account.project_id !== config.projectId) throw new Error('Firebase project mismatch');
    app = initializeApp({ projectId: config.projectId, credential: account ? cert(account) : applicationDefault() }, name);
  }
  return getFirestore(app, config.firestoreDatabaseId);
}

// This collection is covered by the existing default-deny rule. Clients cannot create email jobs.
export function codEmailStore(): CodEmailStore { return createCodEmailStore(database()); }

export function createCodEmailStore(db: ReturnType<typeof database>): CodEmailStore {
  const jobRef = (id: string) => db.collection('_order_email_delivery').doc(`cod-${id}`);
  return {
    reserve: (id, now) => db.runTransaction(async transaction => {
      const ref = jobRef(id);
      const existing = await transaction.get(ref);
      if (existing.exists) {
        const job = existing.data() as EmailJob;
        if (job.sent) return job;
        if (job.expires <= now) throw new CodEmailError(410, 'Confirmation retry period has ended');
        if (job.leaseUntil > now) throw new CodEmailError(409, 'Confirmation is already being sent');
        transaction.update(ref, { leaseUntil: now + 45000 });
        return job;
      }
      const snapshot = await transaction.get(db.collection('orders').doc(id));
      if (!snapshot.exists) throw new CodEmailError(404, 'Order not found');
      const order = codOrderMessage(snapshot.data(), now);
      const limitRef = db.collection('_order_email_delivery').doc(`recipient-${recipientKey(order.email)}`);
      const limit = (await transaction.get(limitRef)).data();
      const active = limit && limit.expires > now;
      const count = active ? Number(limit.count) : 0;
      if (count >= 5) throw new CodEmailError(429, 'Confirmation limit reached; contact the store');
      const job: EmailJob = { order, sent: false, expires: now + 23 * 3600000, leaseUntil: now + 45000 };
      transaction.create(ref, job);
      transaction.set(limitRef, { count: count + 1, expires: active ? limit.expires : now + 24 * 3600000 });
      return job;
    }),
    complete: async id => { await jobRef(id).update({ sent: true, leaseUntil: 0 }); },
    release: async id => { await jobRef(id).update({ leaseUntil: 0 }); },
  };
}
