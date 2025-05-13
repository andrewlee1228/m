import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppWrapper } from '@/context/AppContext'; // Import AppWrapper

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Axxel Living',
  description: 'Your integrated living and stay management app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AppWrapper> {/* Wrap children with AppWrapper */}
          <main className="flex-grow flex flex-col">{children}</main>
          <Toaster />
        </AppWrapper>
      </body>
    </html>
  );
}
