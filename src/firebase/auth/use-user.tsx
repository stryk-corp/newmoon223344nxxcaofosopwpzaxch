'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useAuth, useFirestore } from '../provider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { useWallet } from '@solana/wallet-adapter-react';

// Function to create a new user document in Firestore
async function createUserDocument(firestore: any, walletPublicKey: string) {
  if (!walletPublicKey) return;
  const userRef = doc(firestore, 'users', walletPublicKey);
  
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: Omit<User, 'id'> = {
        name: walletPublicKey,
        avatarUrl: '',
        balance: 0,
        miningRate: 0.001,
        tier: 'Bronze',
        ipAddress: '0.0.0.0', // Placeholder, should be set server-side in a real app
        status: 'active',
        miningActivity: [],
        referralCode: walletPublicKey,
        completedTasks: [],
      };

      await setDoc(userRef, newUser).catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: newUser,
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Error setting user document:", error);
      });
    }
  } catch (error: any) {
      const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);
      console.error("Error checking user document:", error);
  }
}


export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (!authUser) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  useEffect(() => {
    // This effect runs when the wallet connection status changes.
    if (connected && publicKey && firestore) {
      createUserDocument(firestore, publicKey.toBase58()).then(() => {
        setLoading(false);
      });
    } else if (!connected) {
        // If wallet disconnects, we aren't loading anymore.
        setLoading(false);
    }
  }, [connected, publicKey, firestore]);


  // Return the Firebase user for auth context, but the app should rely on the public key for data.
  return { user, loading };
}
