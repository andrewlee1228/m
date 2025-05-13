// src/app/[locale]/layout.tsx
import type { ReactNode } from 'react';
import { I18nProviderClient } from '@/lib/i18n/client';
import { locales } from '@/lib/i18n/config'; // Import locales from config
import { Inter } from 'next/font/google';
import '../globals.css'; // Adjusted path

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <I18nProviderClient locale={locale}>
      {/* This 'children' will typically be the RootLayout defined in src/app/layout.tsx */}
      {children}
    </I18nProviderClient>
  );
}
