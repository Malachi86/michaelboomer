import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Suzuki Auto Sales | Official Portfolio',
  description: 'Authorized Suzuki Auto Sales Consultant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AnalyticsTracker>
            {children}
          </AnalyticsTracker>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}