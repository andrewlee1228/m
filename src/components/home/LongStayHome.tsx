"use client";

import type { Reservation, CommunityEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, Building2, Users, PlusCircle, Wrench, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface LongStayHomeProps {
  user: { name: string };
  reservation: Reservation;
}

// Mock Data
const mockLongStayEvents: CommunityEvent[] = [
  { id: 'ls-evt1', title: 'Resident Networking Mixer', description: 'Meet fellow long-stay residents.', date: '2024-07-25T18:00:00Z', location: 'Lounge Area', branchName: 'Executive Suites' },
  { id: 'ls-evt2', title: 'Wellness Workshop', description: 'Tips for healthy long-term stays.', date: '2024-08-10T10:00:00Z', location: 'Conference Room A', branchName: 'Executive Suites' },
];

export default function LongStayHome({ user, reservation }: LongStayHomeProps) {
  const upcomingEvent = mockLongStayEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="relative h-48 sm:h-64 w-full">
            <Image 
                src={`https://picsum.photos/seed/longstay_${reservation.branchName.replace(/\s+/g, '')}/1200/400`}
                alt={`${reservation.branchName} apartment complex`}
                layout="fill"
                objectFit="cover"
                data-ai-hint="modern apartment"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Welcome, {user.name.split(' ')[0]}!</h1>
                <p className="text-lg text-primary-foreground/90">Your extended stay at {reservation.branchName}, {reservation.unit || 'Suite'}.</p>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stay Extension Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Stay Duration</CardTitle>
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Ends: {new Date(reservation.endDate).toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground">
              Need more time? Check extension options.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/booking/extend"><PlusCircle className="mr-2 h-4 w-4" /> Extend Your Stay</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Facilities Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Amenity Access</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Book Facilities</div>
            <p className="text-xs text-muted-foreground">
              Access gym, pool, meeting rooms, etc.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/facilities"><Info className="mr-2 h-4 w-4" /> View & Book Facilities</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Community & Services Card */}
      <Card>
        <CardHeader>
            <CardTitle>Community & Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/> Community Events</h3>
                {upcomingEvent ? (
                <div className="mt-1 text-sm">
                    <p className="font-medium">{upcomingEvent.title}</p>
                    <p className="text-xs text-muted-foreground">
                    {new Date(upcomingEvent.date).toLocaleDateString()} at {new Date(upcomingEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {upcomingEvent.location}
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                        <Link href="/dashboard/community">View All Events</Link>
                    </Button>
                </div>
                ) : (
                <p className="text-sm text-muted-foreground">No upcoming community events.</p>
                )}
            </div>
            <div>
                <h3 className="font-semibold flex items-center"><Wrench className="mr-2 h-5 w-5 text-primary"/> Long-Stay Services</h3>
                <p className="text-sm text-muted-foreground mt-1">Request laundry, grocery delivery, or specialized cleaning.</p>
                 <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                    <Link href="/dashboard/maintenance?type=longstay">Request Services</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
