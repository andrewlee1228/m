"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CurrentAppContext, AuthenticatedUser, Reservation, StayGuestData, UserType } from '@/types';
import { useRouter } from 'next/navigation';

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
    { id: 'res-multi-live-1', branchName: 'Riverside Complex', type: 'Live', startDate: '2022-06-01', endDate: '2025-05-31', unit: 'Unit 5B' },
    { id: 'res-multi-stay-1', branchName: 'City Center Hotel', type: 'Stay', reservationNumber: 'STAY001', startDate: '2024-07-10', endDate: '2024-07-15', unit: 'Room 202' },
    { id: 'res-multi-longstay-1', branchName: 'Executive Suites', type: 'LongStay', reservationNumber: 'LONG987', startDate: '2024-08-01', endDate: '2024-10-31', unit: 'Suite 300' },
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

  useEffect(() => {
    // Simulate loading stored session
    const storedContext = localStorage.getItem('appContext');
    if (storedContext) {
      try {
        const parsedContext = JSON.parse(storedContext);
        // Basic validation
        if (parsedContext.status === 'authenticated' && parsedContext.user && parsedContext.activeReservation) {
          setAppContext(parsedContext);
        } else if (parsedContext.status === 'guest' && parsedContext.guestData && parsedContext.activeReservation) {
          setAppContext(parsedContext);
        } else {
          setAppContext({ status: 'unauthenticated' });
        }
      } catch (error) {
        console.error("Failed to parse stored context:", error);
        setAppContext({ status: 'unauthenticated' });
      }
    } else {
      setAppContext({ status: 'unauthenticated' });
    }
  }, []);
  
  const updateAndStoreContext = (newContext: CurrentAppContext) => {
    setAppContext(newContext);
    localStorage.setItem('appContext', JSON.stringify(newContext));
  };


  const loginAsUser = useCallback((userType: 'live' | 'multi') => {
    const user = userType === 'live' ? MOCK_USER_LIVE : MOCK_USER_MULTI;
    if (user.activeReservations.length === 1) {
      updateAndStoreContext({ status: 'authenticated', user, activeReservation: user.activeReservations[0] });
      router.push('/dashboard');
    } else if (user.activeReservations.length > 1) {
      // Store user data but not active reservation, redirect to selection
      updateAndStoreContext({ status: 'authenticated', user, activeReservation: user.activeReservations[0] }); // Temp set first, then select
      router.push('/select-reservation');
    } else {
      // No active reservations, handle appropriately (e.g., show a message or different dashboard)
      // For now, treat as logged in with no specific context, or default to first (if any)
      updateAndStoreContext({ status: 'authenticated', user, activeReservation: user.activeReservations[0] || null as any });
      router.push('/dashboard'); // Or a page indicating no active reservations
    }
  }, [router]);

  const loginAsStayGuest = useCallback((reservationNumber: string, phone: string): boolean => {
    if (reservationNumber === MOCK_STAY_GUEST_RESERVATION.reservationNumber && phone === '111-2222') {
      const guestData: StayGuestData = {
        reservationNumber,
        phone,
        reservation: MOCK_STAY_GUEST_RESERVATION,
      };
      updateAndStoreContext({ status: 'guest', guestData, activeReservation: MOCK_STAY_GUEST_RESERVATION });
      router.push('/dashboard');
      return true;
    }
    return false;
  }, [router]);
  
  const selectReservation = useCallback((reservationId: string) => {
    if (appContext.status === 'authenticated') {
      const newActiveReservation = appContext.user.activeReservations.find(r => r.id === reservationId);
      if (newActiveReservation) {
        updateAndStoreContext({ ...appContext, activeReservation: newActiveReservation });
        router.push('/dashboard');
      }
    }
    // Guest users typically have only one reservation, so selection might not be applicable
    // unless linking accounts or similar advanced scenarios.
  }, [appContext, router]);

  const switchReservation = useCallback((reservationId: string) => {
    if (appContext.status === 'authenticated') {
      const newActiveReservation = appContext.user.activeReservations.find(r => r.id === reservationId);
      if (newActiveReservation) {
        updateAndStoreContext({ ...appContext, activeReservation: newActiveReservation });
        // Potentially force a re-render or redirect to refresh dashboard content
        router.push('/dashboard'); // Or use router.refresh() if appropriate
      }
    }
  }, [appContext, router]);

  const logout = useCallback(() => {
    updateAndStoreContext({ status: 'unauthenticated' });
    localStorage.removeItem('appContext');
    router.push('/login');
  }, [router]);

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
