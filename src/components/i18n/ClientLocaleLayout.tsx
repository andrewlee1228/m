'use client';

import type { ReactNode } from 'react';
import { I18nProviderClient } from '@/lib/i18n/client';
import type { Locale } from '@/lib/i18n/config';

export default function ClientLocaleLayout({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    // By adding key={locale}, we ensure that when the locale changes,
    // React treats this as a new instance of I18nProviderClient,
    // forcing a full re-initialization with the new locale.
    <I18nProviderClient locale={locale} key={locale}>
      {children}
    </I18nProviderClient>
  );
}
