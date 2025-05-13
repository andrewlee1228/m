// src/middleware.ts
import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n/config';

const I18nMiddleware = createI18nMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  urlMappingStrategy: 'rewrite', // Keeps URLs clean, e.g. /dashboard instead of /en/dashboard
});

export function middleware(request: NextRequest) {
  // Prevent middleware from running on Genkit's dev server path
  if (request.nextUrl.pathname.startsWith('/__genkit')) {
    return;
  }
  return I18nMiddleware(request);
}

export const config = {
  // Match all paths except for internal Next.js paths, API routes, and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|__genkit).*)'],
};
