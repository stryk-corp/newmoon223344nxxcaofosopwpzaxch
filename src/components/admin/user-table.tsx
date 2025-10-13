'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { checkFraudAction, updateUserStatusAction } from '@/app/admin/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertCircle, Ban, Gavel, MoreHorizontal, ShieldAlert, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const statusConfig = {
  active: {
    label: 'Active',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: <UserCheck className="w-3 h-3" />,
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  banned: {
    label: 'Banned',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: <Ban className="w-3 h-3" />,
  },
};

export function UserTable({ users }: { users: User[] }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleFraudCheck = async (userId: string) => {
    setLoading((prev) => ({ ...prev, [`fraud-${userId}`]: true }));
    const response = await checkFraudAction(userId);
    setLoading((prev) => ({ ...prev, [`fraud-${userId}`]: false }));

    if (response.success && response.result) {
      toast({
        title: 'Fraud Check Complete',
        description: response.result.isSuspicious
          ? `Suspicious: ${response.result.reason}`
          : 'No suspicious activity detected.',
        variant: response.result.isSuspicious ? 'destructive' : 'default',
      });
    } else {
      toast({
        title: 'Error',
        description: response.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    setLoading((prev) => ({ ...prev, [`status-${userId}`]: true }));
    const response = await updateUserStatusAction(userId, status);
    setLoading((prev) => ({ ...prev, [`status-${userId}`]: false }));
    toast({
        title: response.success ? 'Success' : 'Error',
        description: response.message,
        variant: response.success ? 'default' : 'destructive'
    });
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">IP Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Balance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-muted-foreground text-sm md:hidden">{user.ipAddress}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{user.ipAddress}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`gap-1 ${statusConfig[user.status].color}`}>
                  {statusConfig[user.status].icon}
                  <span>{statusConfig[user.status].label}</span>
                  {user.status === 'suspended' && user.suspensionEndDate && (
                      <span className="text-xs ml-1 hidden lg:inline">
                          (ends in {formatDistanceToNow(new Date(user.suspensionEndDate))})
                      </span>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="font-headline font-semibold hidden md:table-cell">
                {user.balance.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFraudCheck(user.id)}
                    disabled={loading[`fraud-${user.id}`]}
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{loading[`fraud-${user.id}`] ? 'Checking...' : 'Check Fraud'}</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={loading[`status-${user.id}`]}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'active')}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'suspended')}>
                        <Gavel className="mr-2 h-4 w-4" />
                        Suspend (5 days)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleUpdateStatus(user.id, 'banned')}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Ban
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
