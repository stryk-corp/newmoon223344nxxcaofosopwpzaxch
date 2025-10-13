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
async function createUserDocument(firestore: any, user: FirebaseUser, walletPublicKey: string) {
  const userRef = doc(firestore, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: Omit<User, 'id'> = {
        name: walletPublicKey,
        avatarUrl: '',
        balance: 0,
        tier: 'Bronze',
        ipAddress: '0.0.0.0', // Placeholder, should be set server-side in a real app
        status: 'active',
        miningActivity: [],
        referralCode: walletPublicKey,
        completedTasks: [],
      };

      await setDoc(userRef, newUser).catch((error) => {
        // This is a critical error if it happens on user creation.
        // It's likely a security rule issue.
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
      // This would typically be a network or permissions error on getDoc
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
  const { publicKey } = useWallet();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser); // Set Firebase user immediately for auth state
      if (!authUser) {
        setLoading(false);
      }
      // The rest of the logic (document creation) will be handled by the next effect
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  useEffect(() => {
    // This effect runs when either the firebase user or public key changes.
    // We only proceed to create the document if we have BOTH.
    if (user && publicKey && firestore) {
      createUserDocument(firestore, user, publicKey.toBase58()).then(() => {
        setLoading(false);
      });
    } else if (!user) {
      // If there's no firebase user, we're not loading anymore.
      setLoading(false);
    }
  }, [user, publicKey, firestore]);


  return { user, loading };
}
