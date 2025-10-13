import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  const isConfigured = getApps().length > 0;
  const firebaseApp = isConfigured
    ? getApps()[0]
    : initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, `http://${host}:9099`, {
        disableWarnings: true,
      });
    }
    if (!firestore.toJSON()['emulator']) {
      connectFirestoreEmulator(firestore, host, 8080);
    }
  }

  return { firebaseApp, auth, firestore };
}

export { FirebaseProvider } from './provider';
export { useFirebaseApp, useAuth, useFirestore, useUser } from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { FirebaseClientProvider } from './client-provider';
