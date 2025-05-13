
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

  const updateAndStoreContext = useCallback((newContext: CurrentAppContext) => {
    setAppContext(newContext);
    if (newContext.status === 'authenticated' || newContext.status === 'guest') {
      localStorage.setItem('appContext', JSON.stringify(newContext));
    } else {
      localStorage.removeItem('appContext');
    }
  }, []);

  const loginAsUser = useCallback((userType: 'live' | 'multi') => {
    const user = userType === 'live' ? MOCK_USER_LIVE : MOCK_USER_MULTI;
    const localeStr = String(currentLocale); 
    const localePathPrefix = `/${localeStr}`;

    if (user.activeReservations.length === 0) {
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: null });
        router.push(`${localePathPrefix}/dashboard`); 
    } else if (user.activeReservations.length === 1) {
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: user.activeReservations[0] });
        router.push(`${localePathPrefix}/dashboard`);
    } else {
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: null }); 
        router.push(`${localePathPrefix}/select-reservation`); 
    }
  }, [router, currentLocale, updateAndStoreContext]);

  const loginAsStayGuest = useCallback((reservationNumber: string, phone: string): boolean => {
    const localeStr = String(currentLocale); 
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
  }, [router, currentLocale, updateAndStoreContext]);

  const selectReservation = useCallback((reservationId: string) => {
    const localeStr = String(currentLocale); 
    const localePathPrefix = `/${localeStr}`;
    
    setAppContext(prevContext => {
      if (prevContext.status === 'authenticated') {
        const newActiveReservation = prevContext.user.activeReservations.find(r => r.id === reservationId);
        if (newActiveReservation) {
          const newContextState = { ...prevContext, activeReservation: newActiveReservation };
          localStorage.setItem('appContext', JSON.stringify(newContextState));
          router.push(`${localePathPrefix}/dashboard`);
          return newContextState;
        } else {
          console.error("Selected reservation ID not found in user's list.");
        }
      } else {
          console.error("selectReservation called when not authenticated.");
      }
      return prevContext;
    });
  }, [router, currentLocale]);

  const switchReservation = useCallback((reservationId: string) => {
    const localeStr = String(currentLocale);
     setAppContext(prevContext => {
        if (prevContext.status === 'authenticated') {
            const newActiveReservation = prevContext.user.activeReservations.find(r => r.id === reservationId);
            if (newActiveReservation && newActiveReservation.id !== prevContext.activeReservation?.id) {
                 const newContextState = { ...prevContext, activeReservation: newActiveReservation };
                 localStorage.setItem('appContext', JSON.stringify(newContextState));
                 router.push(`/${localeStr}/dashboard`); 
                 return newContextState;
            }
        }
        return prevContext;
     });
  }, [router, currentLocale]);

  const logout = useCallback(() => {
    const localeStr = String(currentLocale); 
    updateAndStoreContext({ status: 'unauthenticated' });
    router.push(`/${localeStr}/login`);
  }, [router, currentLocale, updateAndStoreContext]);

  useEffect(() => {
    if (typeof currentLocale === 'undefined') {
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
    
    if (JSON.stringify(appContext) !== JSON.stringify(loadedState) || appContext.status === 'loading') {
       setAppContext(loadedState);
    }
  }, [currentLocale, appContext.status]); // Removed appContext from dependencies to avoid re-running when appContext itself changes due to setAppContext.


  if (typeof currentLocale === 'undefined' || appContext.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Initializing application...</p>
      </div>
    );
  }


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

