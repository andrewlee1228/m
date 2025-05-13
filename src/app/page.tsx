"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import AppLogo from '@/components/AppLogo';
import { Loader2 } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const { appContext } = useAppContext();

  useEffect(() => {
    if (appContext.status === 'loading') {
      // Still loading, wait for context to resolve
      return;
    }

    const timer = setTimeout(() => {
      if (appContext.status === 'authenticated' || appContext.status === 'guest') {
        if (appContext.status === 'authenticated' && appContext.user.activeReservations.length > 1 && !appContext.activeReservation ) {
             // This case should be handled by selectReservation if activeReservation is not set after login for multi-reservation user
            router.push('/select-reservation');
        } else {
            router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    }, 1500); // Splash screen duration

    return () => clearTimeout(timer);
  }, [appContext, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="text-center space-y-6">
        <AppLogo className="w-48 h-auto mx-auto" />
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Loading Axxel...</p>
      </div>
    </div>
  );
}
