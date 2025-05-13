// src/middleware.ts
import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'; // Import NextResponse
import { locales, defaultLocale } from './lib/i18n/config';

const i18nMiddlewareHandler = createI18nMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  urlMappingStrategy: 'rewrite', // Keeps URLs clean, e.g. /dashboard instead of /en/dashboard
});

export function middleware(request: NextRequest) {
  // Prevent middleware from running on Genkit's dev server path
  if (request.nextUrl.pathname.startsWith('/__genkit')) {
    return NextResponse.next(); // Explicitly continue for genkit paths
  }
  return i18nMiddlewareHandler(request); // Apply i18n middleware for other paths
}

export const config = {
  // Match all paths except for internal Next.js paths, API routes, and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|__genkit).*)'],
};
