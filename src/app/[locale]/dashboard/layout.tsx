"use client";
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Loader2 } from 'lucide-react';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client'; 

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { appContext } = useAppContext();
  const router = useRouter();
  const t = useScopedI18n('common'); 
  const currentLocale = useCurrentLocale();

  useEffect(() => {
    if (appContext.status === 'unauthenticated') {
      router.replace(`/${currentLocale}/login`); 
    }
  }, [appContext.status, router, currentLocale]);

  if (appContext.status === 'loading' || appContext.status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6">
        {children}
      </main>
      {appContext.activeReservation && <BottomNav />}
    </div>
  );
}
