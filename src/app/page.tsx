// src/app/page.tsx
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
    // Wait until the context status is determined
    if (appContext.status === 'loading') {
      return;
    }

    // Add a small delay for the splash screen effect
    const timer = setTimeout(() => {
      switch (appContext.status) {
        case 'authenticated':
          // If authenticated and has multiple reservations BUT no active one selected yet
          // (This case might occur if context loaded weirdly, but login/select handles primary flow)
          if (appContext.user.activeReservations.length > 1 && !appContext.activeReservation) {
             router.push('/select-reservation');
          } else {
             // Handles single reservation, multi-reservation with one selected, or zero reservations
            router.push('/dashboard');
          }
          break;
        case 'guest':
          // Guest always goes to dashboard (as they only have one reservation context)
          router.push('/dashboard');
          break;
        case 'unauthenticated':
        default:
          // Unauthenticated users go to login
          router.push('/login');
          break;
      }
    }, 1000); // Reduced splash screen duration slightly

    // Cleanup the timer if the component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [appContext.status, appContext.activeReservation, appContext.user, router]); // Dependency array includes all relevant context parts

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
