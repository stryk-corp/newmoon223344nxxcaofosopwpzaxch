'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useAuth, useFirestore } from '../provider';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

// Function to create a new user document in Firestore
async function createUserDocument(firestore: any, user: FirebaseUser) {
  const userRef = doc(firestore, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUser: Omit<User, 'id'> = {
      name: `${user.uid.substring(0, 6)}...${user.uid.substring(user.uid.length - 4)}`,
      avatarUrl: '',
      balance: 0,
      tier: 'Bronze',
      ipAddress: '0.0.0.0', // Placeholder, should be set server-side in a real app
      status: 'active',
      miningActivity: [],
      referralCode: user.uid.substring(0, 8),
      completedTasks: [],
    };

    try {
      await setDoc(userRef, newUser);
    } catch (error) {
      console.error("Error creating user document:", error);
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'create',
        requestResourceData: newUser,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  }
}


export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
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
        createUserDocument(firestore, authUser).then(() => {
            setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, loading };
}
