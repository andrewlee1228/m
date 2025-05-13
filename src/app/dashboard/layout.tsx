"use client";
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { appContext } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (appContext.status === 'loading') return; // Wait for context to load

    if (appContext.status === 'unauthenticated') {
      router.push('/login');
    } else if (appContext.status === 'authenticated' && appContext.user.activeReservations.length > 1 && !appContext.activeReservation) {
      // This case should be redirected from login or splash if user has multiple reservations and none is selected
      // Or if user manually navigates here without selecting a reservation.
      router.push('/select-reservation');
    }
  }, [appContext, router]);

  if (appContext.status === 'loading' || appContext.status === 'unauthenticated' || (appContext.status === 'authenticated' && !appContext.activeReservation && appContext.user.activeReservations.length > 1)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }
  
  // This case is for users who are authenticated but have NO active reservations.
  // The PRD mentions "기본 홈 화면 (예약 독려 등)으로 이동."
  // For now, we let them into the dashboard, specific pages should handle lack of active reservation.
  // Or, we could redirect to a specific "no active reservations" page.
  if (appContext.status === 'authenticated' && appContext.user.activeReservations.length === 0) {
    // Allow access to dashboard, components inside should handle this state
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6"> {/* padding-bottom for BottomNav */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
