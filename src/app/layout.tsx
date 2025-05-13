
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let localeToSet: Locale = defaultLocale; // Initialize with Locale type

  try {
    const serverLocale = await getCurrentLocaleFromServer();
    // Validate if the returned locale is one of the configured locales
    if (locales.includes(serverLocale as Locale)) { // serverLocale from hook is Locale
      localeToSet = serverLocale as Locale; // Ensure localeToSet is Locale
    } else {
      console.warn(
        `getCurrentLocaleFromServer returned an unexpected value: "${serverLocale}". Falling back to defaultLocale "${defaultLocale}".`
      );
      // localeToSet remains defaultLocale (which is Locale)
    }
  } catch (error) {
    console.error("Error in getCurrentLocaleFromServer:", error);
    console.warn(`Fell back to defaultLocale "${defaultLocale}" due to error.`);
    // localeToSet remains defaultLocale (which is Locale)
  }

  return (
    <html lang={localeToSet} className={inter.variable}> {/* Use localeToSet directly as it's Locale */}
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

