"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CurrentAppContext, AuthenticatedUser, Reservation, StayGuestData } from '@/types';
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
  switchReservation: (reservationId: string) => void; // Kept for explicit switching from header
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const [appContext, setAppContext] = useState<CurrentAppContext>({ status: 'loading' });
  const router = useRouter();

  // Effect to load context from localStorage on initial mount
  useEffect(() => {
    const storedContext = localStorage.getItem('appContext');
    let loadedState: CurrentAppContext = { status: 'unauthenticated' }; // Default if nothing found or invalid

    if (storedContext) {
      try {
        const parsedContext = JSON.parse(storedContext);
        // Validate the loaded context structure
        if (parsedContext.status === 'authenticated' && parsedContext.user && parsedContext.user.activeReservations) {
          // Ensure activeReservation is valid or null
          const activeRes = parsedContext.user.activeReservations.find((r: Reservation) => r.id === parsedContext.activeReservation?.id);
          loadedState = { ...parsedContext, activeReservation: activeRes || null };
        } else if (parsedContext.status === 'guest' && parsedContext.guestData && parsedContext.activeReservation) {
          // Ensure guest reservation matches
          if(parsedContext.activeReservation.id === parsedContext.guestData.reservation.id) {
            loadedState = parsedContext;
          }
        }
      } catch (error) {
        console.error("Failed to parse stored context:", error);
        // Keep default 'unauthenticated' state
        localStorage.removeItem('appContext'); // Clear invalid storage
      }
    }
    setAppContext(loadedState);
  }, []);

  // Helper function to update state and localStorage
  const updateAndStoreContext = (newContext: CurrentAppContext) => {
    setAppContext(newContext);
    // Only store if not loading or unauthenticated
    if (newContext.status === 'authenticated' || newContext.status === 'guest') {
      localStorage.setItem('appContext', JSON.stringify(newContext));
    } else {
      localStorage.removeItem('appContext');
    }
  };

  const loginAsUser = useCallback((userType: 'live' | 'multi') => {
    const user = userType === 'live' ? MOCK_USER_LIVE : MOCK_USER_MULTI;
    if (user.activeReservations.length === 0) {
        // Authenticated, but no reservations
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: null });
        router.push('/dashboard'); // Dashboard home should handle this state
    } else if (user.activeReservations.length === 1) {
        // Single reservation, set it as active
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: user.activeReservations[0] });
        router.push('/dashboard');
    } else {
        // Multiple reservations, force selection
        // Store user data, but initially no active reservation selected
        updateAndStoreContext({ status: 'authenticated', user, activeReservation: null });
        router.push('/select-reservation'); // Redirect to selection page
    }
  }, [router]);

  const loginAsStayGuest = useCallback((reservationNumber: string, phone: string): boolean => {
    // Mock validation
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
    return false; // Indicate login failure
  }, [router]);

  // Called from SelectReservationPage AFTER user makes a choice
  const selectReservation = useCallback((reservationId: string) => {
    if (appContext.status === 'authenticated') {
      const newActiveReservation = appContext.user.activeReservations.find(r => r.id === reservationId);
      if (newActiveReservation) {
        updateAndStoreContext({ ...appContext, activeReservation: newActiveReservation });
        router.push('/dashboard'); // Navigate to dashboard after selection
      } else {
        console.error("Selected reservation ID not found in user's list.");
        // Potentially logout or show error
      }
    } else {
        console.error("selectReservation called when not authenticated.");
        // Should not happen if routing is correct
    }
  }, [appContext, router]);

  // Called from Header dropdown to switch between already known reservations
  const switchReservation = useCallback((reservationId: string) => {
    if (appContext.status === 'authenticated') {
      const newActiveReservation = appContext.user.activeReservations.find(r => r.id === reservationId);
      if (newActiveReservation && newActiveReservation.id !== appContext.activeReservation?.id) {
        updateAndStoreContext({ ...appContext, activeReservation: newActiveReservation });
        // No navigation needed here generally, as the header/layout updates.
        // Force refresh if necessary for specific page data: router.refresh();
      }
    }
  }, [appContext]);

  const logout = useCallback(() => {
    updateAndStoreContext({ status: 'unauthenticated' });
    // localStorage is cleared by updateAndStoreContext
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
