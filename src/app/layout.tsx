import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppWrapper } from '@/context/AppContext';
// We cannot use getCurrentLocaleFromServer here directly in a way that affects generateStaticParams for [locale]
// The lang attribute will be set by src/app/[locale]/layout.tsx

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Axxel Living', // This could also be localized if needed via generateMetadata
  description: 'Your integrated living and stay management app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The <html> and <body> tags are now primarily managed by src/app/[locale]/layout.tsx
    // to set the lang attribute dynamically. This RootLayout provides the core structure.
    // If src/app/[locale]/layout.tsx doesn't render <html> and <body>, they should be here.
    // Based on the new structure, [locale]/layout.tsx creates html/body.
    // So this RootLayout becomes the direct child of that body.
      <AppWrapper>
        {/* Children here are the page content, wrapped by I18nProvider in [locale]/layout.tsx */}
        <main className="flex-grow flex flex-col">{children}</main>
        <Toaster />
      </AppWrapper>
  );
}
