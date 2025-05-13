// src/app/[locale]/locale-layout-client.tsx
'use client'; // This is the client component part

import type { ReactNode } from 'react';
import { AppWrapper } from '@/context/AppContext'; // Import AppWrapper
import ClientLocaleLayout from '@/components/i18n/ClientLocaleLayout'; // Import the i18n provider wrapper
import type { Locale } from '@/lib/i18n/config';

// This component receives locale as a prop from the server layout
export default function LocaleLayoutClient({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    // Wrap with the I18n provider first
    <ClientLocaleLayout locale={locale}>
      {/* Then wrap with the App context */}
      <AppWrapper>
        {children}
      </AppWrapper>
    </ClientLocaleLayout>
  );
}
