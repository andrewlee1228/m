"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CalendarPlus, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import UserTypeBadge from '@/components/UserTypeBadge';

export default function BookingManagementPage() {
  const { appContext } = useAppContext();

  if (appContext.status !== 'authenticated' || (appContext.activeReservation?.type !== 'LongStay' && appContext.activeReservation?.type !== 'Stay')) {
     return (
       <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>Booking Management Not Applicable</CardTitle>
          <CardDescription className="mt-2">This feature is primarily for LongStay or Stay guests to manage their current booking.</CardDescription>
        </Card>
      </div>
    );
  }
  
  const { activeReservation } = appContext;
  const userType = activeReservation.type;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl flex items-center">
            <CalendarCheck className="mr-3 h-8 w-8 text-primary" />
            Manage Your Booking
        </CardTitle>
        <CardDescription>
            View details, make changes, or extend your {userType.toLowerCase()} at {activeReservation.branchName}.
        </CardDescription>
      </CardHeader>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl">Current Reservation Details</CardTitle>
                <CardDescription>{activeReservation.branchName} - {activeReservation.unit || 'Your Accommodation'}</CardDescription>
            </div>
            <UserTypeBadge type={userType} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
            <p><strong>Reservation Number:</strong> {activeReservation.reservationNumber || 'N/A'}</p>
            <p><strong>Check-in Date:</strong> {new Date(activeReservation.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Check-out Date:</strong> {new Date(activeReservation.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            {/* Add more details as needed: guest count, room type, etc. */}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" asChild>
                <Link href={`/dashboard/booking/details/${activeReservation.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> View Full Details
                </Link>
            </Button>
            {userType === 'LongStay' && (
                <Button asChild>
                    <Link href={`/dashboard/booking/extend/${activeReservation.id}`}>
                        <CalendarPlus className="mr-2 h-4 w-4" /> Extend Stay
                    </Link>
                </Button>
            )}
             {userType === 'Stay' && (
                <Button asChild>
                    <Link href={`/dashboard/booking/modify/${activeReservation.id}`}>
                        <CalendarPlus className="mr-2 h-4 w-4" /> Modify Booking
                    </Link>
                </Button>
            )}
        </CardFooter>
      </Card>

      {userType === 'LongStay' && (
        <Card>
            <CardHeader>
                <CardTitle>Long-Stay Options</CardTitle>
                <CardDescription>Explore benefits and services for your extended stay.</CardHeader>
            </CardContent>
            <CardContent>
                {/* Placeholder for long-stay specific options like service packages, etc. */}
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Weekly housekeeping schedules.</li>
                    <li>Discounted rates for extended periods.</li>
                    <li>Access to exclusive resident events.</li>
                </ul>
                 <Button variant="link" className="mt-3 px-0">Learn More About Long-Stay Perks</Button>
            </CardContent>
        </Card>
      )}

       {/* Placeholder for past/upcoming bookings if applicable */}
        {/* <Card>
            <CardHeader>
                <CardTitle>Other Bookings</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">View your past or upcoming reservations.</p>
            </CardContent>
        </Card> */}

    </div>
  );
}
