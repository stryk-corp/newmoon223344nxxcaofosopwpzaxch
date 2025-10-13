'use client';

import { useState, useMemo } from 'react';
import type { User, TierName } from '@/lib/types';
import { tiers } from '@/lib/tiers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

const tierBadgeColors: Record<TierName, string> = {
  Diamond: 'border-cyan-400/50 text-cyan-400',
  Platinum: 'border-slate-400/50 text-slate-400',
  Gold: 'border-yellow-400/50 text-yellow-400',
  Silver: 'border-gray-400/50 text-gray-400',
  Bronze: 'border-orange-400/50 text-orange-400',
};

const getUserTier = (balance: number): TierName => {
  return tiers.find(t => balance < t.maxBalance)?.name || 'Diamond';
}

export function Leaderboard({ allUsers }: { allUsers: User[] }) {
  const [tierFilter, setTierFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All-time');

  const usersWithTiers = useMemo(() => allUsers.map(user => ({
    ...user,
    tier: getUserTier(user.balance)
  })), [allUsers])

  const filteredUsers = usersWithTiers
    .filter((user) => tierFilter === 'All' || user.tier === tierFilter)
    .sort((a, b) => b.balance - a.balance);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-orange-400" />;
    return <span className="text-muted-foreground font-medium">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Tiers</SelectItem>
            <SelectItem value="Diamond">Diamond</SelectItem>
            <SelectItem value="Platinum">Platinum</SelectItem>
            <SelectItem value="Gold">Gold</SelectItem>
            <SelectItem value="Silver">Silver</SelectItem>
            <SelectItem value="Bronze">Bronze</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All-time">All-time</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-center">
                  <div className="flex justify-center items-center">
                    {getRankIcon(index + 1)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={tierBadgeColors[user.tier]}>
                    {user.tier}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-headline font-semibold">
                  {user.balance.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
