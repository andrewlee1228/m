"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CalendarDays, MapPin, PlusCircle, CheckSquare, XSquare, AlertTriangle } from 'lucide-react';
import type { CommunityEvent } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

const mockCommunityEvents: CommunityEvent[] = [
  { id: 'evt1', title: 'Summer BBQ Bash', description: 'Join us for a community BBQ by the pool! Food, music, and fun for all residents.', date: '2024-07-20T17:00:00Z', location: 'Pool Area, Downtown Central', branchName: 'Downtown Central', rsvp: true },
  { id: 'evt2', title: 'Outdoor Movie Night: Classic Hits', description: 'Grab a blanket and enjoy an outdoor screening of a beloved classic movie under the stars.', date: '2024-07-27T20:00:00Z', location: 'Community Lawn, Downtown Central', branchName: 'Downtown Central', rsvp: false },
  { id: 'evt3', title: 'Resident Networking Mixer', description: 'Meet fellow long-stay residents and expand your network. Light refreshments provided.', date: '2024-07-25T18:00:00Z', location: 'Lounge Area, Executive Suites', branchName: 'Executive Suites', rsvp: true },
  { id: 'evt4', title: 'Yoga in the Park', description: 'Start your weekend with a refreshing outdoor yoga session. All levels welcome.', date: '2024-08-03T09:00:00Z', location: 'Central Park (adjacent to Riverside Complex)', branchName: 'Riverside Complex', rsvp: false },
];


export default function CommunityEventsPage() {
  const { appContext } = useAppContext();

  if (appContext.status !== 'authenticated' || (appContext.activeReservation?.type !== 'Live' && appContext.activeReservation?.type !== 'LongStay')) {
    return (
       <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>Community Access Restricted</CardTitle>
          <CardDescription className="mt-2">Community features are available for Live and LongStay residents.</CardDescription>
        </Card>
      </div>
    );
  }
  
  const { activeReservation } = appContext;
  // Filter events for the current branch (or show all if no specific branch context for events)
  const branchEvents = mockCommunityEvents.filter(event => event.branchName === activeReservation.branchName);
  const upcomingEvents = branchEvents.filter(event => new Date(event.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = branchEvents.filter(event => new Date(event.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  const EventCard = ({ event }: { event: CommunityEvent }) => (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-40 w-full">
        <Image 
            src={`https://picsum.photos/seed/${event.id}/400/200`} 
            alt={event.title} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="community event"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <div className="text-xs text-muted-foreground space-x-2">
            <span><CalendarDays className="inline h-3 w-3 mr-1" />{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span><MapPin className="inline h-3 w-3 mr-1" />{event.location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {event.rsvp && new Date(event.date) >= new Date() && (
          <>
            <Button variant="outline" size="sm"><CheckSquare className="mr-1 h-4 w-4 text-green-600"/> RSVP Yes</Button>
            <Button variant="outline" size="sm"><XSquare className="mr-1 h-4 w-4 text-red-600"/> RSVP No</Button>
          </>
        )}
         {new Date(event.date) < new Date() && <Badge variant="outline">Event Ended</Badge>}
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <div className="flex justify-between items-center">
            <CardTitle className="text-3xl flex items-center">
                <Users className="mr-3 h-8 w-8 text-primary" />
                Community Hub
            </CardTitle>
            {/* Placeholder for "Suggest Event" or "Create Event" for admins */}
            {/* <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Suggest Event</Button> */}
        </div>
        <CardDescription>
            Connect with your community at {activeReservation.branchName}. Discover events, activities, and more.
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">No upcoming events scheduled at {activeReservation.branchName} currently. Check back soon!</p>
          )}
        </TabsContent>
        <TabsContent value="past">
           {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">No past events found for {activeReservation.branchName}.</p>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Placeholder for community forums or chat */}
      {/* <Card>
        <CardHeader>
            <CardTitle>Community Forum</CardTitle>
            <CardDescription>Engage in discussions with other residents.</CardHeader>
        </CardContent>
        <CardContent>
            <p className="text-muted-foreground">Forum features coming soon!</p>
        </CardContent>
      </Card> */}

    </div>
  );
}
