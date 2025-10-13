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
import { signOut, signInWithCustomToken } from 'firebase/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StrykLogo } from './logo';
import { LogOut } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';

async function handleSignOut(auth: any) {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Sign-out failed", error);
    }
}

// This would typically be a server-side action for security
async function getCustomToken(walletAddress: string) {
    // In a real app, you'd send the walletAddress to your backend,
    // verify ownership (e.g. by having the user sign a message),
    // and then use the Firebase Admin SDK to create a custom token.
    // For this demo, we'll just log a message.
    console.log("In a real app, a custom token would be generated for:", walletAddress);
    // As we can't generate a real custom token on the client,
    // we'll fall back to anonymous sign-in for demonstration.
    // This allows Firestore rules based on UID to still work.
    const auth = getAuth();
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid; // This is not a custom token, but works for the demo
}


export function UserNav() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    if (connected && publicKey && !user) {
      const walletAddress = publicKey.toBase58();
      
      // Since we cannot securely generate a custom token on the client,
      // we'll use anonymous sign-in as a stand-in to get a Firebase UID.
      // In a real app, you would replace this with a call to your backend
      // which verifies wallet ownership and returns a real custom token.
      const auth = getAuth();
      signInAnonymously(auth)
        .then(() => {
          console.log('Signed in anonymously as a stand-in for custom auth.');
        })
        .catch((error) => {
          console.error('Anonymous sign-in for custom auth demo failed', error);
        });

    } else if (!connected && user) {
        if (auth) {
            signOut(auth);
        }
    }
  }, [connected, publicKey, user, auth]);


  if (loading) {
    return <Skeleton className="h-10 w-28" />;
  }

  if (!connected || !user || !publicKey) {
    return (
        <WalletMultiButton />
    );
  }

  const truncatedId = `${publicKey.toBase58().substring(0, 6)}...${publicKey.toBase58().substring(publicKey.toBase58().length - 4)}`;

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
            <DropdownMenuItem onClick={() => handleSignOut(auth)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out & Disconnect</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
