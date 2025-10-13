import type { Metadata } from 'next';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/main-nav';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserNav } from '@/components/user-nav';
import { SolanaProvider } from '@/components/solana-provider';

export const metadata: Metadata = {
  title: 'Stryk Mining Platform',
  description: 'Stryk Mining Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <SolanaProvider>
            <SidebarProvider>
              <Sidebar variant="inset" collapsible="icon">
                <MainNav />
              </Sidebar>
              <SidebarInset>
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                  <div className="ml-auto">
                    <UserNav />
                  </div>
                </header>
                <div className="min-h-screen">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </SolanaProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
