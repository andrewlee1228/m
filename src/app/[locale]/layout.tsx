// src/app/[locale]/layout.tsx
// 'use client' directive removed

import type { ReactNode } from 'react';
import { locales, type Locale } from '@/lib/i18n/config';
import ClientLocaleLayout from '@/components/i18n/ClientLocaleLayout'; // Import the new wrapper

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: Locale }; // Ensure locale is typed correctly
}) {
  return (
    // No <html> or <body> tags here, as they are in the parent app/layout.tsx
    <ClientLocaleLayout locale={locale}>
      {children}
    </ClientLocaleLayout>
  );
}
