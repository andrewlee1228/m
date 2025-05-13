
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CurrentAppContext, AuthenticatedUser, Reservation, StayGuestData } from '@/types';
import { useRouter } from 'next/navigation';
import { useCurrentLocale } from '@/lib/i18n/client'; 
import { Loader2 } from 'lucide-react'; 

// Mock data
const MOCK_USER_LIVE: AuthenticatedUser = {
  id: 'user-live-1',
  name: 'Alice Wonderland',
  email: 'alice@example.com',
  phone: '555-1234',
  activeReservations: [
    { id: 'res-live-1', branchName: 'Downtown Central', type: 'Live', startDate: '2023-01-01', endDate: '2024-12-31', unit: 'Apt 101' },
  ],
};

const MOCK_USER_MULTI: AuthenticatedUser = {
  id: 'user-multi-1',
  name: 'Bob The Builder',
  email: 'bob@example.com',
  phone: '555-5678',
  activeReservations: [
    { id: 'res-multi-live-1', branchName: '숭인', type: 'Live', startDate: '2022-06-01', endDate: '2025-05-31', unit: 'Unit 5B' },
    { id: 'res-multi-live-2', branchName: '신설', type: 'Live', startDate: '2022-06-01', endDate: '2025-05-31', unit: 'Unit 203B' },
    { id: 'res-multi-stay-1', branchName: '신설', type: 'Stay', reservationNumber: 'STAY001', startDate: '2024-07-10', endDate: '2024-07-15', unit: 'Room 202' },
    { id: 'res-multi-longstay-1', branchName: '동대문', type: 'LongStay', reservationNumber: 'LONG987', startDate: '2024-08-01', endDate: '2024-10-31', unit: 'Suite 300' },
  ],
};

const MOCK_STAY_GUEST_RESERVATION: Reservation = {
  id: 'res-guest-stay-1',
  branchName: 'Airport Inn',
  type: 'Stay',
  reservationNumber: 'GUEST007',
  startDate: '2024-07-20',
  endDate: '2024-07-22',
  unit: 'Room 101',
};


interface AppContextType {
  appContext: CurrentAppContext;
  loginAsUser: (userType: 'live' | 'multi') => void;
  loginAsStayGuest: (reservationNumber: string, phone: string) => boolean;
  selectReservation: (reservationId: string) => void;
  logout: () => void;
  switchReservation: (reservationId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const [appContext, setAppContext] = useState<CurrentAppContext>({ status: 'loading' });
  const router = useRouter();
  const currentLocale = useCurrentLocale(); 

  useEffect(() => {
    // Only proceed if currentLocale is defined.
    // This effect now depends on currentLocale.
    if (typeof currentLocale === 'undefined') {
      // Set to loading if locale is not yet available, to ensure AppContext reflects this.
      // This might be redundant if the initial state is already 'loading', but ensures consistency.
      if (appContext.status !== 'loading') {
        setAppContext({ status: 'loading' });
      }
      return;
    }

    const storedContext = localStorage.getItem('appContext');
    let loadedState: CurrentAppContext = { status: 'unauthenticated' }; 

    if (storedContext) {
      try {
        const parsedContext = JSON.parse(storedContext);
        if (parsedContext.status === 'authenticated' && parsedContext.user && parsedContext.user.activeReservations) {
          const activeRes = parsedContext.user.activeReservations.find((r: Reservation) => r.id === parsedContext.activeReservation?.id);
          loadedState = { ...parsedContext, activeReservation: activeRes || null };
        } else if (parsedContext.status === 'guest' && parsedContext.guestData && parsedContext.activeReservation) {
          if(parsedContext.activeReservation.id === parsedContext.guestData.reservation.id) {
            loadedState = parsedContext;
          }
        }
      } catch (error) {
        console.error("Failed to parse stored context:", error);
        localStorage.removeItem('appContext'); 
      }
    }
    // Only update if the loaded state is different or if current status is loading (initial load after locale defined)
    if (JSON.stringify(appContext) !== JSON.stringify(loadedState) || appContext.status === 'loading') {
       setAppContext(loadedState);
    }
  }, [currentLocale, appContext.status]); // Added currentLocale and appContext.status as dependencies. appContext.status ensures re-evaluation if status changes externally.

  // Loader displayed if locale is not yet available from I18nProviderClient
  // or if AppContext itself is in a 'loading' state (e.g., during initial localStorage read).
  if (typeof currentLocale === 'undefined' || appContext.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Initializing application...</p>
      </div>
    );
  }

  const updateAndStoreContext = (newContext: CurrentAppContext) => {
    setAppContext(newContext);
    if (newContext.status === 'authenticated' || newContext.status === 'guest') {
      localStorage.setItem('appContext', JSON.stringify(newContext));
    } else {
      localStorage.removeItem('appContext');
    }
  };

  const loginAsUser = useCallback((userType: 'live' | 'multi') => {
    const user = userType === 'live' ? MOCK_USER_LIVE : MOCK_USER_MULTI;
    const localeStr = String(currentLocale); // currentLocale is guaranteed to be defined here
    const localePathPrefix = `/${localeStr}`;

    if (user.activeReservations.length === 0) {
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: null });
        router.push(`${localePathPrefix}/dashboard`); 
    } else if (user.activeReservations.length === 1) {
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: user.activeReservations[0] });
        router.push(`${localePathPrefix}/dashboard`);
    } else {
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: null }); // activeReservation is null initially
        router.push(`${localePathPrefix}/select-reservation`); 
    }
  }, [router, currentLocale]);

  const loginAsStayGuest = useCallback((reservationNumber: string, phone: string): boolean => {
    const localeStr = String(currentLocale); // currentLocale is guaranteed to be defined here
    const localePathPrefix = `/${localeStr}`;
    if (reservationNumber === MOCK_STAY_GUEST_RESERVATION.reservationNumber && phone === '111-2222') {
      const guestData: StayGuestData = {
        reservationNumber,
        phone,
        reservation: MOCK_STAY_GUEST_RESERVATION,
      };
      updateAndStoreContext({ status: 'guest', guestData, activeReservation: MOCK_STAY_GUEST_RESERVATION });
      router.push(`${localePathPrefix}/dashboard`);
      return true;
    }
    return false; 
  }, [router, currentLocale]);

  const selectReservation = useCallback((reservationId: string) => {
    const localeStr = String(currentLocale); // currentLocale is guaranteed to be defined here
    const localePathPrefix = `/${localeStr}`;
    if (appContext.status === 'authenticated') {
      const newActiveReservation = appContext.user.activeReservations.find(r => r.id === reservationId);
      if (newActiveReservation) {
        updateAndStoreContext({ ...appContext, activeReservation: newActiveReservation });
        router.push(`${localePathPrefix}/dashboard`); 
      } else {
        console.error("Selected reservation ID not found in user's list.");
      }
    } else {
        console.error("selectReservation called when not authenticated.");
    }
  }, [appContext, router, currentLocale]);

  const switchReservation = useCallback((reservationId: string) => {
    const localeStr = String(currentLocale); // currentLocale is guaranteed to be defined here
    if (appContext.status === 'authenticated') {
      const newActiveReservation = appContext.user.activeReservations.find(r => r.id === reservationId);
      if (newActiveReservation && newActiveReservation.id !== appContext.activeReservation?.id) {
        updateAndStoreContext({ ...appContext, activeReservation: newActiveReservation });
        router.push(`/${localeStr}/dashboard`); 
      }
    }
  }, [appContext, router, currentLocale]);

  const logout = useCallback(() => {
    const localeStr = String(currentLocale); // currentLocale is guaranteed to be defined here
    updateAndStoreContext({ status: 'unauthenticated' });
    router.push(`/${localeStr}/login`);
  }, [router, currentLocale]);

  return (
    <AppContext.Provider value={{ appContext, loginAsUser, loginAsStayGuest, selectReservation, logout, switchReservation }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppWrapper');
  }
  return context;
};

