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
async function createUserDocument(firestore: any, user: FirebaseUser, walletPublicKey?: string | null) {
  const userRef = doc(firestore, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: Omit<User, 'id'> = {
        name: walletPublicKey ? `${walletPublicKey.substring(0, 6)}...${walletPublicKey.substring(walletPublicKey.length - 4)}` : 'Anonymous User',
        avatarUrl: '',
        balance: 0,
        tier: 'Bronze',
        ipAddress: '0.0.0.0', // Placeholder, should be set server-side in a real app
        status: 'active',
        miningActivity: [],
        referralCode: user.uid.substring(0, 8),
        completedTasks: [],
      };

      await setDoc(userRef, newUser);
    }
  } catch (error: any) {
      // Check if it's a permission error, otherwise just log it.
      // We are creating the user, so we expect to have permission.
      // If we don't, it's a developer error in the security rules.
      if (error.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: 'SECURITY_RULE_VIOLATION',
        });
        errorEmitter.emit('permission-error', permissionError);
      } else {
        console.error("Error creating user document:", error);
      }
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
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Pass the wallet public key when creating the document
        createUserDocument(firestore, authUser, publicKey?.toBase58()).then(() => {
            setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore, publicKey]);

  return { user, loading };
}
