// src/app/[locale]/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import AppLogo from '@/components/AppLogo';
import { Loader2 } from 'lucide-react';
import { useCurrentLocale } from '@/lib/i18n/client';
// import { defaultLocale } from '@/lib/i18n/config'; // Potentially needed for a hard fallback

export default function SplashPage() {
  const router = useRouter();
  const { appContext } = useAppContext();
  const currentLocale = useCurrentLocale();

  useEffect(() => {
    // Wait until the app context status is determined AND currentLocale is available
    if (appContext.status === 'loading' || !currentLocale) {
      return; // Do nothing if still loading or locale is not yet defined
    }

    // Add a small delay for the splash screen effect
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
      // currentLocale should be defined here due to the check above
      router.push(`/${currentLocale}${targetPath}`);

    }, 1000); // Splash screen duration

    // Cleanup the timer if the component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [appContext.status, appContext.activeReservation, appContext.user, router, currentLocale]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="text-center space-y-6">
        <AppLogo className="w-48 h-auto mx-auto" />
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        {/* It's good practice to translate user-facing text, even on splash screens */}
        <p className="text-muted-foreground">Loading Axxel...</p>
      </div>
    </div>
  );
}
