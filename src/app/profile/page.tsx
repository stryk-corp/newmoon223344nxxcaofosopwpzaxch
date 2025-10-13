'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { tiers } from '@/lib/tiers';
import type { TierName } from '@/lib/types';
import { StrykLogo } from '@/components/logo';

// This will be replaced with Firestore access
const user = {
    id: 'usr_4',
    name: 'AdminUser',
    avatarUrl: 'https://picsum.photos/seed/avatar4/100/100',
    balance: 540321,
    tier: 'Silver',
    ipAddress: '10.0.0.1',
    status: 'active',
    miningActivity: [],
    referralCode: 'REF-ADMIN',
  };

export default function ProfilePage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralLink = `https://mine.drstryk.com/join?ref=${user.referralCode}`;

  const userTier: TierName = useMemo(() => {
    return tiers.find(tier => user.balance < tier.maxBalance)?.name || 'Diamond';
  }, [user.balance]);

  const handleConnectWallet = () => {
    // For a normal user, this would be their actual wallet address.
    // For admin, we can use a placeholder.
    if (user.name === 'AdminUser') {
        setWallet('admin.wallet.connected');
    } else {
        const fullWallet = `4qaFa3W3Nq2JpLwG7h7fG...`; // example full address
        setWallet(fullWallet);
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="w-24 h-24 mb-4">
                {/* The user wants to use the Stryk logo instead of a user-specific avatar */}
                <div className="w-full h-full flex items-center justify-center bg-card rounded-full">
                  <StrykLogo className="w-16 h-16 text-accent" />
                </div>
              </Avatar>
              <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
              <CardDescription>{userTier} Tier</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="font-headline text-3xl font-bold">
                {user.balance.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Connection</CardTitle>
              <CardDescription>Connect your Solana wallet to participate in withdrawals.</CardDescription>
            </CardHeader>
            <CardContent>
              {wallet ? (
                <div className="p-4 rounded-md bg-secondary">
                  <p className="text-sm text-muted-foreground">Connected Wallet:</p>
                  <p className="font-mono text-lg break-all">{wallet}</p>
                </div>
              ) : (
                <Button onClick={handleConnectWallet}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Solana Wallet
                </Button>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>Share your referral link to earn bonuses when your friends join.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input readOnly value={referralLink} />
                <Button onClick={handleCopyReferral} size="icon" variant="outline" className="w-full sm:w-auto">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
