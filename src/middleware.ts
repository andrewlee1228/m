// src/middleware.ts
import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './lib/i18n/config';

const i18nMiddlewareHandler = createI18nMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  urlMappingStrategy: 'redirect', // Changed from 'rewrite' to 'redirect'
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Prevent middleware from running on Genkit's dev server path
  if (pathname.startsWith('/__genkit')) {
    return NextResponse.next();
  }

  // Let next-international handle all locale-based routing, including the root path.
  // With 'rewrite' strategy, it will redirect '/' to '/{defaultLocale}/'
  // and then rewrite locale-prefixed paths to the corresponding app router pages.
  return i18nMiddlewareHandler(request);
}

export const config = {
  // Match all paths except for internal Next.js paths, API routes, and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|__genkit).*)'],
};
