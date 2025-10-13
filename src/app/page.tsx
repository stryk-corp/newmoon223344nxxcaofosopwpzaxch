'use client';

import { MiningSection } from '@/components/mining-section';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Gift, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import type { User } from '@/lib/types';


export default function Home() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { publicKey, connected } = useWallet();

  const userDocRef = useMemo(() => (connected && publicKey ? doc(firestore, 'users', publicKey.toBase58()) : null), [firestore, connected, publicKey]);
  const { data: userProfile, loading: profileLoading } = useDoc<User>(userDocRef);

  const loading = userLoading || profileLoading;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <MiningSection user={user} />

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Mining Rate
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">+{userProfile?.miningRate ?? 0.001}/s</div>
            <p className="text-xs text-muted-foreground">
              Base rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Airdrop Tasks</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">3 Available</div>
            <p className="text-xs text-muted-foreground">
              Complete tasks to earn more
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1 bg-primary/20 border-accent/50 flex flex-col justify-center items-center sm:items-start">
            <CardHeader>
                <CardTitle>View All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <Button asChild variant="ghost" className="text-accent hover:bg-accent/20">
                    <Link href="/tasks">
                        Go to Tasks <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
