'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { tiers } from '@/lib/tiers';

export function MiningSection() {
  const [balance, setBalance] = useState(0);
  const [progress, setProgress] = useState(0);
  const miningRate = 0.001; // tokens per second

  const currentTier = tiers.find(tier => balance < tier.maxBalance) || tiers[tiers.length - 1];
  const nextTier = tiers.find(tier => balance < tier.maxBalance);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prev) => prev + miningRate);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (nextTier) {
      const tierProgress = (balance / nextTier.maxBalance) * 100;
      setProgress(Math.min(tierProgress, 100));
    } else {
      setProgress(100);
    }
  }, [balance, nextTier]);

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
