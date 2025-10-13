'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export interface FirebaseProviderProps {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseProviderProps | undefined>(
  undefined
);

export function FirebaseProvider({
  children,
  ...props
}: { children: ReactNode } & FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={props}>
        {children}
        <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export function useFirebaseApp(): FirebaseApp {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
}

export function useAuth(): Auth {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export function useFirestore(): Firestore {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirestore must be used within a FirebaseProvider');
    }
    return context.firestore;
}

export { useUser } from './auth/use-user';
