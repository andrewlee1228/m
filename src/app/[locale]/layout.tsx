// src/app/[locale]/layout.tsx
import type { ReactNode } from 'react';
import { I18nProviderClient } from '@/lib/i18n/client';
import { locales } from '@/lib/i18n/config';
import { Inter } from 'next/font/google';
import '../globals.css'; // Path to src/app/globals.css

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Metadata can also be generated dynamically per locale here if needed:
// export async function generateMetadata({ params: { locale } }: { params: { locale: string }}) { ... }

export default function LocaleLayout({
  children, // children here is the <RootLayout> component from app/layout.tsx
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <I18nProviderClient locale={locale}>
          {children} {/* This will render the RootLayout and its content */}
        </I18nProviderClient>
      </body>
    </html>
  );
}
