// src/lib/i18n/config.ts
export const locales = ['en', 'ko', 'zh'] as const;
export const defaultLocale = 'en';

export type Locale = typeof locales[number];
