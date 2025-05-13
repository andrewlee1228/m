// src/components/i18n/ClientLocaleLayout.tsx
'use client';

import type { ReactNode } from 'react';
import { I18nProviderClient } from '@/lib/i18n/client';
import { type Locale, locales, defaultLocale } from '@/lib/i18n/config';

export default function ClientLocaleLayout({
  children,
  locale: receivedLocale,
}: {
  children: ReactNode;
  locale: Locale; // Prop type ensures it should be Locale
}) {
  let finalLocale: Locale = defaultLocale; // Default to a known Locale

  // Validate if the receivedLocale is actually one of the defined locales.
  // This is a safeguard, as `params.locale` from Next.js, even when typed,
  // might in some edge cases or build steps not be as strictly typed as expected by the library.
  if (locales.includes(receivedLocale)) {
    finalLocale = receivedLocale;
  } else {
    // This case should ideally not be reached if routing and generateStaticParams are correct.
    console.warn(
      `Invalid locale prop received in ClientLocaleLayout: "${receivedLocale}". Falling back to default locale "${defaultLocale}". This might indicate an issue with how 'params.locale' is being passed or typed upstream.`
    );
    // finalLocale remains defaultLocale
  }
  
  return (
    // Use finalLocale which is guaranteed to be of type Locale.
    // The key is also updated to use the validated finalLocale.
    <I18nProviderClient locale={finalLocale} key={String(finalLocale)}>
      {children}
    </I18nProviderClient>
  );
}

