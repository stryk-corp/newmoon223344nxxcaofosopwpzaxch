'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, Gift } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ReferralList } from '@/components/referrals/referral-list';
import { useUser, useDoc, useFirestore, useCollection } from '@/firebase';
import { collection, doc, query, where, getDocs } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { useWallet } from '@solana/wallet-adapter-react';

export default function ReferralsPage() {
  const { user, loading: userLoading } = useUser();
  const { publicKey, connected } = useWallet();
  const firestore = useFirestore();
  
  const userDocRef = useMemo(() => (connected && publicKey ? doc(firestore, 'users', publicKey.toBase58()) : null), [firestore, connected, publicKey]);
  const { data: userProfile, loading: profileLoading } = useDoc<User>(userDocRef);
  
  const { data: allUsers, loading: allUsersLoading } = useCollection<User>(firestore ? collection(firestore, 'users') : null);

  const [referredUsers, setReferredUsers] = useState<User[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);

  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralLink = userProfile ? `https://mine.drstryk.com/join?ref=${userProfile.referralCode}` : '';

  useEffect(() => {
    async function fetchReferredUsers() {
      if (!firestore || !userProfile?.referrals || userProfile.referrals.length === 0) {
        setLoadingReferrals(false);
        setReferredUsers([]);
        return;
      }
      
      try {
        setLoadingReferrals(true);
        const usersRef = collection(firestore, 'users');
        // Firestore 'in' query is limited to 30 items. For more, you'd need multiple queries.
        const q = query(usersRef, where('__name__', 'in', userProfile.referrals.slice(0, 30)));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setReferredUsers(users);
      } catch (error) {
        console.error("Error fetching referred users: ", error);
        setReferredUsers([]);
      } finally {
        setLoadingReferrals(false);
      }
    }

    fetchReferredUsers();
  }, [firestore, userProfile?.referrals]);


  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const loading = userLoading || profileLoading || allUsersLoading || loadingReferrals;

  if (loading) {
    return <div>Loading...</div>
  }
  
  const referralBonus = (userProfile?.referralCount || 0) * 0; // Placeholder for bonus calculation

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Referrals</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>Share your referral link to earn bonuses when your friends join.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input readOnly value={referralLink} />
                  <Button onClick={handleCopyReferral} size="icon" variant="outline" className="w-full sm:w-auto flex-shrink-0">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Gift className="w-8 h-8 text-accent" />
              <div>
                <CardTitle>Referral Bonus</CardTitle>
                <CardDescription>You get 5% of your friends' mining earnings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile?.referralCount || 0} Referrals</div>
            <p className="text-sm text-muted-foreground">Total bonus earned: {referralBonus} Tokens</p>
          </CardContent>
        </Card>
      </div>

      <ReferralList referrals={referredUsers} allUsers={allUsers || []}/>

    </div>
  );
}
