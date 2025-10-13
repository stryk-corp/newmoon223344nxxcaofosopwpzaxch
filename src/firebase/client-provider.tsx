'use client';

import * as React from 'react';
import { initializeFirebase } from './';
import { FirebaseProvider, type FirebaseProviderProps } from './provider';

let app: FirebaseProviderProps | undefined;

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  if (!app) {
    app = initializeFirebase();
  }
  return <FirebaseProvider {...app}>{children}</FirebaseProvider>;
}
