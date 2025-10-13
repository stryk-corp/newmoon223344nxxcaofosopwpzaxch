'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously, signOut } from 'firebase/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StrykLogo } from './logo';
import { Wallet, LogOut } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

async function handleSignIn(auth: any) {
    try {
        await signInAnonymously(auth);
    } catch (error) {
        console.error("Anonymous sign-in failed", error);
    }
}

async function handleSignOut(auth: any) {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Sign-out failed", error);
    }
}

export function UserNav() {
  const { user, loading } = useUser();
  const auth = useAuth();

  if (loading) {
    return <Skeleton className="h-10 w-28" />;
  }

  if (!user) {
    return (
      <Button onClick={() => handleSignIn(auth)}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  const truncatedId = `${user.uid.substring(0, 6)}...${user.uid.substring(user.uid.length - 4)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="relative h-10 w-auto px-4 py-2">
            <div className="flex items-center gap-2">
                <p>
                    <span className="hidden sm:inline">Wallet: </span>
                    <span className="font-mono">{truncatedId}</span>
                </p>
                <Avatar className="h-8 w-8">
                    <AvatarFallback>
                        <StrykLogo className="w-5 h-5 text-accent" />
                    </AvatarFallback>
                </Avatar>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">My Account</p>
            <p className="text-xs leading-none text-muted-foreground font-mono">
              {user.uid}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSignOut(auth)}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
