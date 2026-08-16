import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    const sa = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8')
    );
    admin.initializeApp({ credential: admin.cert(sa) });
  } else {
    // Fallback to application default credentials or just initialize without cert if testing locally
    admin.initializeApp();
  }
}
const db = admin.firestore();

export { admin, db };
