'use client';

import type { User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo } from 'react';
import { Badge } from '../ui/badge';
import { Zap } from 'lucide-react';

interface ReferralListProps {
  referrals: User[];
  allUsers: User[];
}

export function ReferralList({ referrals, allUsers }: ReferralListProps) {

  const sortedUsers = useMemo(() => {
    return [...allUsers].sort((a, b) => b.balance - a.balance);
  }, [allUsers]);

  const getRank = (userId: string) => {
    return sortedUsers.findIndex(u => u.id === userId) + 1;
  }
  
  const baseMiningRate = 0.001;

  if (referrals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't referred anyone yet. Share your link to start earning!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referrals ({referrals.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Mining Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => {
                const rank = getRank(referral.id);
                return (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium text-center">{rank > 0 ? `#${rank}` : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={referral.avatarUrl} alt={referral.name} />
                          <AvatarFallback>{referral.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{referral.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="gap-1 items-center bg-green-500/10 text-green-400 border-green-500/20">
                        <Zap className="w-3 h-3" />
                        <span>{baseMiningRate.toFixed(3)}/s</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
