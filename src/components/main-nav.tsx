'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

import { navLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Icon } from '@/components/icons';
import { StrykLogo } from '@/components/logo';

const ADMIN_WALLET_ADDRESS = 'CyXGxS6Yj94rF2Qu7KiJtvXMcap9CfJsoVcnPNGgeDpC';

export function MainNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { publicKey } = useWallet();

  const visibleNavLinks = useMemo(() => {
    const isAdmin = publicKey && publicKey.toBase58() === ADMIN_WALLET_ADDRESS;
    if (isAdmin) {
      return navLinks;
    }
    return navLinks.filter((link) => link.id !== 'admin');
  }, [publicKey]);

  return (
    <>
      <SidebarHeader>
        <div
          className={cn(
            'flex items-center gap-2',
            state === 'collapsed' && 'justify-center'
          )}
        >
          <StrykLogo className="text-accent"/>
          <h1
            className={cn(
              'font-headline text-xl font-semibold',
              state === 'collapsed' && 'hidden'
            )}
          >
            Stryk
          </h1>
        </div>
        <div className="flex items-center justify-end">
          <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>

      <SidebarMenu className="flex-1">
        {visibleNavLinks.map((link) => (
          <SidebarMenuItem key={link.id}>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.path}
              tooltip={{
                children: link.label,
                className: 'bg-primary text-primary-foreground',
              }}
            >
              <Link href={link.path} title={link.label}>
                <Icon name={link.icon} className="shrink-0" />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
