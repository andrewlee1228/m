import type { Metadata } from 'next';
// Inter font import is removed as it's handled by [locale]/layout.tsx
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppWrapper } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Axxel Living', // This can be overridden by locale-specific metadata in [locale]/layout.tsx
  description: 'Your integrated living and stay management app.',
};

export default function RootLayout({
  children, // children here is the actual page component (e.g., app/[locale]/some-page/page.tsx)
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html> and <body> are rendered by app/[locale]/layout.tsx.
    // I18nProviderClient from app/[locale]/layout.tsx wraps this RootLayout's content.
    <AppWrapper>
      {children} {/* Let sub-layouts (like DashboardLayout) or pages define their own <main> tag */}
      <Toaster />
    </AppWrapper>
  );
}
