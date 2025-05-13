
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Ensure globals.css is imported here
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

export default async function RootLayout({ // Make it async
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let localeToSet: Locale | string = defaultLocale; // Fallback to defaultLocale string

  try {
    const serverLocale = await getCurrentLocaleFromServer();
    // Validate if the returned locale is one of the configured locales
    if (locales.includes(serverLocale as Locale)) {
      localeToSet = serverLocale;
    } else {
      console.warn(
        `getCurrentLocaleFromServer returned an unexpected value: "${serverLocale}". Falling back to defaultLocale "${defaultLocale}".`
      );
      // localeToSet remains defaultLocale
    }
  } catch (error) {
    console.error("Error in getCurrentLocaleFromServer:", error);
    // localeToSet remains defaultLocale, a warning will be logged.
    console.warn(`Fell back to defaultLocale "${defaultLocale}" due to error.`);
  }

  return (
    <html lang={String(localeToSet)} className={inter.variable}>
      <body>
        {/* AppWrapper moved to [locale]/layout.tsx to be within I18nProviderClient context */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
