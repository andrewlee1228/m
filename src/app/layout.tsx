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
    // This runs on the server - 빌드 과정에서 예외가 발생해도 조용히 defaultLocale로 폴백합니다.
    const serverLocale = await getCurrentLocaleFromServer();
    if (locales.includes(serverLocale as Locale)) {
      localeToSet = serverLocale as Locale;
    }
    // 경고 메시지 제거: 빌드 과정에서 불필요한 로그를 줄입니다.
  } catch (error) {
    // 빌드 과정에서 발생하는 일반적인 오류인 경우 로그 출력하지 않음
    if (!(error instanceof Error) || !error.message.includes('Could not find locale while pre-rendering page')) {
      console.error("Error in getCurrentLocaleFromServer:", error);
    }
    // defaultLocale로 폴백하지만 로그 메시지는 출력하지 않습니다.
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
