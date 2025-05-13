// src/app/[locale]/layout.tsx
import type { ReactNode } from 'react';
import { locales, type Locale } from '@/lib/i18n/config';
import ClientLocaleLayout from '@/components/i18n/ClientLocaleLayout'; // Import the new wrapper
import { AppWrapper } from '@/context/AppContext'; // Import AppWrapper

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
    <ClientLocaleLayout locale={locale}>
      <AppWrapper>
        {children}
      </AppWrapper>
    </ClientLocaleLayout>
  );
}

