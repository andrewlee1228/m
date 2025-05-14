
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { getCurrentLocaleFromServer } from '@/lib/i18n/server'; 
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'M',
  description: 'M - Your integrated living and stay management app.',
};

// This is a Server Component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let localeToSet: Locale = defaultLocale;

  try {
    // This runs on the server
    const serverLocale = await getCurrentLocaleFromServer();
    if (locales.includes(serverLocale as Locale)) {
      localeToSet = serverLocale as Locale;
    } else {
      console.warn(
        `getCurrentLocaleFromServer returned an unexpected value: "${serverLocale}". Falling back to defaultLocale "${defaultLocale}".`
      );
    }
  } catch (error) {
    console.error("Error in getCurrentLocaleFromServer:", error);
    console.warn(`Fell back to defaultLocale "${defaultLocale}" due to error.`);
  }

  return (
    <html lang={localeToSet} className={inter.variable}>
      {/* Ensure no direct text nodes or whitespace literals are children of <html> before <body> */}
      <body>
        {/* children will be <LocaleLayoutClient> which is 'use client' */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
