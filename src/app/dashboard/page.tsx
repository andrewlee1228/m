"use client";

import { useAppContext } from '@/context/AppContext';
import LiveHome from '@/components/home/LiveHome';
import StayHome from '@/components/home/StayHome';
import LongStayHome from '@/components/home/LongStayHome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function DashboardHomePage() {
  const { appContext } = useAppContext();

  if (appContext.status === 'loading') {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  if (appContext.status === 'unauthenticated') {
    // This should ideally be handled by layout, but as a fallback:
    return (
      <div className="text-center py-10">
        <p>Please log in to view your dashboard.</p>
        <Button asChild className="mt-4"><Link href="/login">Go to Login</Link></Button>
      </div>
    );
  }
  
  const { activeReservation } = appContext;

  if (!activeReservation) {
    // This case handles users who are authenticated but have NO active reservations,
    // or if they cleared their selection (though UI should prevent this).
     if (appContext.status === 'authenticated' && appContext.user.activeReservations.length > 0) {
        return (
             <Card className="max-w-lg mx-auto my-10 text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center text-xl">
                        <AlertTriangle className="h-6 w-6 mr-2 text-destructive" /> No Active Service Selected
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Please select an active service to manage from your available reservations.
                    </p>
                    <Button asChild>
                        <Link href="/select-reservation">Select a Service</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }
    return (
       <Card className="max-w-lg mx-auto my-10 text-center">
        <CardHeader>
            <CardTitle className="text-xl">Welcome to Axxel!</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">
                It looks like you don't have any active reservations with us at the moment.
            </p>
            <div className="space-x-4">
                <Button asChild variant="outline">
                    <Link href="/explore-properties">Explore Properties</Link>
                </Button>
                <Button asChild>
                    <Link href="/new-booking">Make a Reservation</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    );
  }
  
  const userDetails = appContext.status === 'authenticated' ? appContext.user : { name: `Guest (${activeReservation.reservationNumber})`};

  switch (activeReservation.type) {
    case 'Live':
      return <LiveHome user={userDetails} reservation={activeReservation} />;
    case 'Stay':
      return <StayHome user={userDetails} reservation={activeReservation} />;
    case 'LongStay':
      return <LongStayHome user={userDetails} reservation={activeReservation} />;
    default:
      return <div className="text-center py-10">Unknown reservation type. Please contact support.</div>;
  }
}
