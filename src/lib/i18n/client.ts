// src/lib/i18n/client.ts
'use client';

import { createI18nClient } from 'next-international/client';
import type { Locale } from './config';

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient<Locale>({
  en: () => import('@/locales/en'),
  ko: () => import('@/locales/ko'),
  zh: () => import('@/locales/zh'),
});
