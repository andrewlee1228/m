// src/lib/i18n/server.ts
import { createI18nServer } from 'next-international/server';
import type { Locale } from './config';

export const { getI18n, getScopedI18n, getCurrentLocale: getCurrentLocaleFromServer } =
  createI18nServer<Locale>({
    en: () => import('@/locales/en'),
    ko: () => import('@/locales/ko'),
    zh: () => import('@/locales/zh'),
  });
