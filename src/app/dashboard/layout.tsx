"use client";
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Loader2 } from 'lucide-react';
import { useScopedI18n } from '@/lib/i18n/client'; // Import i18n hook

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { appContext } = useAppContext();
  const router = useRouter();
  const t = useScopedI18n('common'); // Use common scope for loading message

  useEffect(() => {
    // Redirect if unauthenticated AFTER context has loaded
    if (appContext.status === 'unauthenticated') {
      router.replace('/login'); // Use replace to avoid adding dashboard to history
    }
    // The select-reservation page handles redirection if multiple reservations exist and none is selected.
    // If user somehow lands here in that state (e.g. direct navigation), they might see a flicker before redirecting from select-reservation page.
    // This layout assumes the user should be here if authenticated or guest.
  }, [appContext.status, router]);

  // Show loading indicator while context is loading or if redirection is pending
  if (appContext.status === 'loading' || appContext.status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  // If authenticated (with any number of reservations, 0 included) or guest, render the dashboard layout.
  // Specific pages within the dashboard will handle the case of 0 reservations if needed.
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6"> {/* padding-bottom for BottomNav */}
        {children}
      </main>
      {/* Render BottomNav only if there's an active reservation or specific rules allow */}
      {appContext.activeReservation && <BottomNav />}
      {/* Or, if BottomNav should always show for authenticated users, remove the condition */}
      {/* <BottomNav /> */}
    </div>
  );
}
