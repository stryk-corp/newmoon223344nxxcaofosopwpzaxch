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
import { signOut, signInAnonymously } from 'firebase/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StrykLogo } from './logo';
import { LogOut } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';

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
  const { publicKey, connected, disconnect } = useWallet();

  useEffect(() => {
    // This effect handles the Firebase anonymous authentication session based on wallet connection state.
    // This is to satisfy Firebase Security Rules that require an authenticated user.
    if (connected && publicKey && !user && auth) {
      signInAnonymously(auth).catch((error) => {
          console.error('Anonymous sign-in for custom auth demo failed', error);
      });
    } else if (!connected && user && auth) {
        signOut(auth);
    }
  }, [connected, publicKey, user, auth]);


  if (loading) {
    return <Skeleton className="h-10 w-28" />;
  }

  if (!connected || !publicKey) {
    return (
        <WalletMultiButton />
    );
  }

  const truncatedId = `${publicKey.toBase58().substring(0, 6)}...${publicKey.toBase58().substring(publicKey.toBase58().length - 4)}`;

  const handleFullSignOut = async () => {
    if (auth) {
        await handleSignOut(auth);
    }
    await disconnect();
  }

  return (
    <div className='flex items-center gap-4'>
        <WalletMultiButton />
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>
                        <StrykLogo className="w-6 h-6 text-accent" />
                    </AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Wallet</p>
                <p className="text-xs leading-none text-muted-foreground font-mono">
                {truncatedId}
                </p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleFullSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out & Disconnect</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
