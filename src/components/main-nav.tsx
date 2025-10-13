'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export function MainNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

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
        {navLinks.map((link) => (
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
