'use client';

import { useEffect, useState, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { tiers } from '@/lib/tiers';
import type { User } from '@/lib/types';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useDoc, useFirestore } from '@/firebase';

export function MiningSection({ user }: { user: any }) {
  const firestore = useFirestore();
  const userDocRef = useMemo(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, loading } = useDoc(userDocRef);

  const [balance, setBalance] = useState(userProfile?.balance || 0);
  const [progress, setProgress] = useState(0);
  const miningRate = 0.001; // tokens per second

  // Set initial balance from profile
  useEffect(() => {
    if (userProfile) {
      setBalance(userProfile.balance);
    }
  }, [userProfile]);

  const currentTier = tiers.find(tier => balance < tier.maxBalance) || tiers[tiers.length - 1];
  const nextTier = tiers.find(tier => balance < tier.maxBalance);

  // Update balance via mining rate and update firestore document
  useEffect(() => {
    if (!user) return;
    const firestoreUpdateInterval = 5000; // ms
    let accumulatedBalance = 0;

    const interval = setInterval(() => {
      const newBalance = balance + miningRate;
      accumulatedBalance += miningRate;
      setBalance(newBalance);

    }, 1000);

    const firestoreUpdate = setInterval(() => {
      if (userDocRef && accumulatedBalance > 0) {
        updateDoc(userDocRef, { balance: increment(accumulatedBalance) });
        accumulatedBalance = 0;
      }
    }, firestoreUpdateInterval);

    return () => {
      clearInterval(interval);
      clearInterval(firestoreUpdate);
       if (userDocRef && accumulatedBalance > 0) {
        updateDoc(userDocRef, { balance: increment(accumulatedBalance) });
      }
    };
  }, [balance, userDocRef, user]);
  
  useEffect(() => {
    if (nextTier) {
      const tierProgress = (balance / nextTier.maxBalance) * 100;
      setProgress(Math.min(tierProgress, 100));
    } else {
      setProgress(100);
    }
  }, [balance, nextTier]);

  if (loading && !userProfile) {
    return <div>Loading mining data...</div>
  }

  if (!user) {
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
