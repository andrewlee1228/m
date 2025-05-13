// src/app/[locale]/layout.tsx
import type { ReactNode } from 'react';
import { locales, type Locale } from '@/lib/i18n/config';
import LocaleLayoutClient from './locale-layout-client'; // Import the client part

// Export generateStaticParams from the server component layout
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// This remains a Server Component
export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  // Render the client component wrapper, passing locale and children
  return (
    <LocaleLayoutClient locale={locale}>
      {children}
    </LocaleLayoutClient>
  );
}
