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
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  );
}
