"use client";

import type { Reservation, Payment, MaintenanceRequest, CommunityEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List, DollarSign, Wrench, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface LiveHomeProps {
  user: { name: string };
  reservation: Reservation;
}

// Mock Data
const mockPayments: Payment[] = [
  { id: 'pay1', amount: 1200, currency: 'USD', date: '2024-07-01', status: 'Paid', description: 'July Rent' },
  { id: 'pay2', amount: 50, currency: 'USD', date: '2024-07-05', status: 'Pending', description: 'Amenity Fee' },
];
const mockMaintenanceRequests: MaintenanceRequest[] = [
  { id: 'req1', category: 'Plumbing', description: 'Leaky faucet in kitchen', status: 'In Progress', submittedAt: '2024-07-03', unit: 'Apt 101', branchName: 'Downtown Central' },
];
const mockCommunityEvents: CommunityEvent[] = [
  { id: 'evt1', title: 'Summer BBQ', description: 'Join us for a community BBQ by the pool!', date: '2024-07-20T17:00:00Z', location: 'Pool Area', branchName: 'Downtown Central' },
  { id: 'evt2', title: 'Movie Night', description: 'Outdoor screening of a classic movie.', date: '2024-07-27T20:00:00Z', location: 'Community Lawn', branchName: 'Downtown Central' },
];


export default function LiveHome({ user, reservation }: LiveHomeProps) {
  const upcomingPayment = mockPayments.find(p => p.status === 'Pending') || mockPayments.find(p => new Date(p.date) >= new Date() && p.status !== 'Paid');
  const recentRequest = mockMaintenanceRequests[0];
  const upcomingEvent = mockCommunityEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="relative h-48 sm:h-64 w-full">
            <Image 
                src="https://picsum.photos/seed/livehome/1200/400" 
                alt="Apartment building exterior" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="apartment building"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Welcome Home, {user.name.split(' ')[0]}!</h1>
                <p className="text-lg text-primary-foreground/90">Managing your {reservation.unit} at {reservation.branchName}.</p>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Rent Payment Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Rent & Payments</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingPayment ? (
              <>
                <div className="text-2xl font-bold">{upcomingPayment.currency} {upcomingPayment.amount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Due {new Date(upcomingPayment.date).toLocaleDateString()} for {upcomingPayment.description}
                </p>
              </>
            ) : (
              <p className="text-green-600 font-semibold">All payments up to date!</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/payment"><List className="mr-2 h-4 w-4" /> View Payments</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Maintenance Request Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Maintenance</CardTitle>
            <Wrench className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recentRequest ? (
              <>
                <div className="text-lg font-semibold truncate">{recentRequest.description}</div>
                <p className="text-xs text-muted-foreground">Status: <span className="font-medium text-primary">{recentRequest.status}</span></p>
              </>
            ) : (
              <p className="text-muted-foreground">No active requests.</p>
            )}
          </CardContent>
           <CardFooter className="flex space-x-2">
            <Button asChild className="flex-1" variant="outline">
              <Link href="/dashboard/maintenance/new">New Request</Link>
            </Button>
             <Button asChild className="flex-1" variant="outline">
              <Link href="/dashboard/maintenance"><List className="mr-2 h-4 w-4" />All Requests</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Community Events Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Community Events</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingEvent ? (
              <>
                <div className="text-lg font-semibold">{upcomingEvent.title}</div>
                <p className="text-xs text-muted-foreground">
                  {new Date(upcomingEvent.date).toLocaleDateString()} at {new Date(upcomingEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No upcoming events.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/community"><List className="mr-2 h-4 w-4" /> View Events</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" className="flex-col h-auto py-4" asChild>
                <Link href="/dashboard/payment">
                    <DollarSign className="h-8 w-8 mb-1 text-primary"/>
                    Pay Rent
                </Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-col h-auto py-4" asChild>
                <Link href="/dashboard/maintenance/new">
                    <Wrench className="h-8 w-8 mb-1 text-primary"/>
                    Request Service
                </Link>
            </Button>
             <Button variant="outline" size="lg" className="flex-col h-auto py-4" asChild>
                <Link href="/dashboard/community">
                    <CalendarDays className="h-8 w-8 mb-1 text-primary"/>
                    Community Hub
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
