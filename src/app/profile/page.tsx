'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { tiers } from '@/lib/tiers';
import type { TierName } from '@/lib/types';

export default function ProfilePage() {
  const user = users[3]; // Using 'AdminUser' as the example logged-in user
  const [wallet, setWallet] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralLink = `https://mine.drstryk.com/join?ref=${user.referralCode}`;

  const userTier: TierName = useMemo(() => {
    return tiers.find(tier => user.balance < tier.maxBalance)?.name || 'Diamond';
  }, [user.balance]);

  const handleConnectWallet = () => {
    setWallet('So1ana.Wallet.123abc.Connected.xyz789');
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
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
          </card>
        </div>
      </div>
    </div>
  );
}
