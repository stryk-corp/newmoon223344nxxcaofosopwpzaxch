'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { users } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, Gift } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ReferralsPage() {
  const user = users[3]; // Using 'AdminUser' as the example logged-in user
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralLink = `https://mine.drstryk.com/join?ref=${user.referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Referrals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <div className="text-2xl font-bold">0 Referrals</div>
            <p className="text-sm text-muted-foreground">Total bonus earned: 0 Tokens</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
