import { getApps, initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import config from '../firebase-applet-config.json' with { type: 'json' };

const appName = 'email-public-read';
const app = getApps().find(candidate => candidate.name === appName)
  ?? initializeApp(config, appName);
const db = getFirestore(app, config.firestoreDatabaseId);

async function readDocument(collection: string, id: string): Promise<Record<string, unknown> | undefined> {
  const snapshot = await getDoc(doc(db, collection, id));
  return snapshot.exists() ? snapshot.data() : undefined;
}

export const readPublicOrder = (id: string) => readDocument('orders', id);
export const readPublicUser = (email: string) => readDocument('users', email);
