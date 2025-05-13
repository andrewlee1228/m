"use client";

import type { Reservation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Bell, Info, LogOut, CalendarClock, ConciergeBell, Utensils, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";


interface StayHomeProps {
  user: { name?: string }; // Name might be from reservation
  reservation: Reservation;
}

export default function StayHome({ user, reservation }: StayHomeProps) {
  const guestName = user.name || `Guest in ${reservation.unit || 'Room'}`;
  const [countdown, setCountdown] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateCountdown = () => {
      const checkoutDate = new Date(reservation.endDate).getTime();
      const checkinDate = new Date(reservation.startDate).getTime();
      const now = new Date().getTime();

      if (now < checkinDate) {
        setCountdown("Check-in soon");
        setProgress(0);
        return;
      }
      if (now > checkoutDate) {
        setCountdown("Checked Out");
        setProgress(100);
        return;
      }
      
      const totalDuration = checkoutDate - checkinDate;
      const elapsedDuration = now - checkinDate;
      const calculatedProgress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
      setProgress(calculatedProgress);

      const timeLeft = checkoutDate - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m left`);
      } else {
        setCountdown(`${minutes}m left`);
      }
    };

    calculateCountdown();
    const intervalId = setInterval(calculateCountdown, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, [reservation.endDate, reservation.startDate]);

  return (
    <div className="space-y-6">
       <Card className="shadow-lg overflow-hidden">
        <div className="relative h-48 sm:h-64 w-full">
            <Image 
                src={`https://picsum.photos/seed/${reservation.branchName.replace(/\s+/g, '')}/1200/400`}
                alt={`${reservation.branchName} hotel view`}
                layout="fill"
                objectFit="cover"
                data-ai-hint="hotel city"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Enjoy your stay, {guestName.split(' ')[0]}!</h1>
                <p className="text-lg text-primary-foreground/90">You're at {reservation.branchName} in {reservation.unit || 'your room'}.</p>
            </div>
        </div>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Checkout Information</span>
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
          </CardTitle>
          <CardDescription>Your stay ends on {new Date(reservation.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-accent">{countdown}</p>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground">Standard checkout time is 11:00 AM.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard/check-in-out"><LogOut className="mr-2 h-4 w-4" /> Proceed to Check-out</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Local Guide & Services</span>
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </CardTitle>
          <CardDescription>Explore {reservation.branchName} and its surroundings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto py-3 flex-col space-y-1" asChild>
            <Link href="/dashboard/concierge">
              <ConciergeBell className="h-7 w-7 mb-1 text-primary" />
              <span>AI Concierge</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex-col space-y-1" asChild>
            <Link href="/dashboard/stay/services?type=food">
              <Utensils className="h-7 w-7 mb-1 text-primary" />
              <span>Order Food</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex-col space-y-1" asChild>
            <Link href="/dashboard/stay/services?type=towels">
              <ShoppingBag className="h-7 w-7 mb-1 text-primary" />
              <span>Request Amenities</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex-col space-y-1" asChild>
            <Link href="/dashboard/stay/local-guide">
              <Info className="h-7 w-7 mb-1 text-primary" />
              <span>Area Info</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
