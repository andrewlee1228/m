
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Ensure globals.css is imported here
import { Toaster } from "@/components/ui/toaster";
// AppWrapper removed from here
import { getCurrentLocaleFromServer } from '@/lib/i18n/server'; // For server-side lang attribute

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Axxel Living',
  description: 'Your integrated living and stay management app.',
};

export default async function RootLayout({ // Make it async
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getCurrentLocaleFromServer(); // Get current locale for lang attribute

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        {/* AppWrapper moved to [locale]/layout.tsx to be within I18nProviderClient context */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}

