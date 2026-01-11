'use client';

import React from 'react';
import { ThemeProvider } from './components/theme-provider';
import GoogleAdsProvider from '@/components/ads/GoogleAdsProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GoogleAdsProvider />
      {children}
    </ThemeProvider>
  );
}
