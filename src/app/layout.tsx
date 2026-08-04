import React from 'react';
import './globals.css';
import { ClientAppWrapper } from '@/components/layout/ClientAppWrapper';

export const metadata = {
  title: 'Companion Connect | Enterprise Verified Companion Marketplace',
  description: 'Secure enterprise marketplace connecting verified adults for safe social companionship, assistance, event attendance, travel guidance, elderly support, and study partnership.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <ClientAppWrapper>
          {children}
        </ClientAppWrapper>
      </body>
    </html>
  );
}
