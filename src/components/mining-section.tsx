'use client';

import { useEffect, useState, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { tiers } from '@/lib/tiers';
import type { User } from '@/lib/types';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function MiningSection({ user: authUser }: { user: any }) {
  const firestore = useFirestore();
  const userDocRef = useMemo(() => (authUser ? doc(firestore, 'users', authUser.uid) : null), [firestore, authUser]);
  const { data: userProfile, loading } = useDoc<User>(userDocRef);

  const [balance, setBalance] = useState(0);
  const [progress, setProgress] = useState(0);
  const miningRate = 0.001; // tokens per second

  // Set initial balance from profile
  useEffect(() => {
    if (userProfile) {
      setBalance(userProfile.balance);
    } else {
      setBalance(0);
    }
  }, [userProfile]);

  const currentTier = tiers.find(tier => balance < tier.maxBalance) || tiers[tiers.length - 1];
  const nextTier = tiers.find(tier => balance < tier.maxBalance);

  // Update balance via mining rate and update firestore document
  useEffect(() => {
    if (!authUser || !userProfile) return; // Don't run if user or profile is not loaded

    const firestoreUpdateInterval = 5000; // ms
    let accumulatedBalance = 0;

    const visualUpdateInterval = setInterval(() => {
      setBalance((prevBalance) => prevBalance + miningRate);
      accumulatedBalance += miningRate;
    }, 1000);

    const firestoreUpdate = setInterval(() => {
      if (userDocRef && accumulatedBalance > 0) {
        const amountToUpdate = accumulatedBalance;
        accumulatedBalance = 0; // Reset before async operation
        updateDoc(userDocRef, { balance: increment(amountToUpdate) })
            .catch(err => {
                console.error("Failed to update balance:", err);
                const permissionError = new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'update',
                  requestResourceData: { balance: `increment(${amountToUpdate})` }
                });
                errorEmitter.emit('permission-error', permissionError);
            });
      }
    }, firestoreUpdateInterval);

    return () => {
      clearInterval(visualUpdateInterval);
      clearInterval(firestoreUpdate);
       if (userDocRef && accumulatedBalance > 0) {
        const amountToUpdate = accumulatedBalance;
        updateDoc(userDocRef, { balance: increment(amountToUpdate) }).catch(err => {
            console.error("Failed to update balance on cleanup:", err);
        });
      }
    };
  }, [authUser, userProfile, userDocRef, miningRate]);
  
  useEffect(() => {
    if (nextTier && balance > 0) {
      const tierProgress = (balance / nextTier.maxBalance) * 100;
      setProgress(Math.min(tierProgress, 100));
    } else if (!nextTier) {
      setProgress(100);
    } else {
      setProgress(0);
    }
  }, [balance, nextTier]);

  if (loading && !userProfile) {
    return <div>Loading mining data...</div>
  }

  if (!authUser) {
    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 py-12">
            <div className="text-center space-y-4">
                <h1 className="font-headline text-5xl font-bold tracking-tighter">
                    Please log in
                </h1>
                <p className="text-muted-foreground">Connect your wallet to start mining.</p>
            </div>
        </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 py-12">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 bg-primary/20 rounded-full animate-pulse delay-200"></div>
        <div className="relative z-10 w-48 h-48 bg-card rounded-full flex items-center justify-center shadow-2xl">
          <Zap className="w-20 h-20 text-accent" />
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Your Balance</p>
        <h1 className="font-headline text-5xl font-bold tracking-tighter transition-all duration-300">
          {balance.toFixed(3)}
        </h1>
      </div>

      <div className="w-full space-y-2 text-center">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tier: {currentTier.name}</span>
          {nextTier ? <span>Next: {nextTier.maxBalance.toLocaleString()}</span> : <span>Max Tier Reached</span>}
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
