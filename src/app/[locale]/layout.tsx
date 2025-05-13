
// src/app/[locale]/layout.tsx
'use client'; // Keep 'use client' if I18nProviderClient requires it or for any client-side logic here

import type { ReactNode } from 'react';
// No useEffect needed for lang if parent sets it server-side.
import { I18nProviderClient } from '@/lib/i18n/client';
import { locales } from '@/lib/i18n/config';
// Inter font import and globals.css import are removed as they are in app/layout.tsx

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children, // children here is the actual page content (e.g., app/[locale]/dashboard/page.tsx) or nested layouts
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    // No <html> or <body> tags here, as they are in the parent app/layout.tsx
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  );
}
