// src/app/[locale]/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import AppLogo from '@/components/AppLogo';
import { Loader2 } from 'lucide-react';
import { useCurrentLocale } from '@/lib/i18n/client';

export default function SplashPage() {
  const router = useRouter();
  const { appContext } = useAppContext();
  const currentLocale = useCurrentLocale();

  useEffect(() => {
    // Guard: Do nothing if appContext is still loading or currentLocale is not yet defined
    if (appContext.status === 'loading' || typeof currentLocale === 'undefined') {
      return;
    }

    const timer = setTimeout(() => {
      let targetPath = '/login'; // Default redirect

      switch (appContext.status) {
        case 'authenticated':
          // If authenticated and has multiple reservations BUT no active one selected yet
          if (appContext.user.activeReservations.length > 1 && !appContext.activeReservation) {
            targetPath = '/select-reservation';
          } else {
            // Handles single reservation, multi-reservation with one selected, or zero reservations
            targetPath = '/dashboard';
          }
          break;
        case 'guest':
          // Guest always goes to dashboard
          targetPath = '/dashboard';
          break;
        case 'unauthenticated':
        default:
          // Unauthenticated users go to login
          targetPath = '/login';
          break;
      }
      // currentLocale is guaranteed to be defined here due to the guard above
      router.push(`/${currentLocale}${targetPath}`);

    }, 1000); // Splash screen duration

    // Cleanup the timer if the component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [appContext.status, appContext.user, appContext.activeReservation, router, currentLocale]); // Explicit dependencies

  // This loader shows if currentLocale is undefined OR appContext is loading
  // This condition ensures we show a loader until both locale and app context are ready
  if (typeof currentLocale === 'undefined' || appContext.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
        <div className="text-center space-y-6">
          <AppLogo className="w-48 h-auto mx-auto" />
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          {/* This text might not be translated if i18n is not ready, keep it simple or remove */}
          <p className="text-muted-foreground">Loading M...</p>
        </div>
      </div>
    );
  }

  // Fallback rendering if redirection hasn't happened yet but conditions are met
  // (e.g., during the 1-second timeout). It's identical to the loader above.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="text-center space-y-6">
        <AppLogo className="w-48 h-auto mx-auto" />
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Preparing your experience...</p>
      </div>
    </div>
  );
}

