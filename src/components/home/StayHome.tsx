"use client";

import type { Reservation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Info, LogOut, CalendarClock, ConciergeBell, Utensils, ShoppingBag } from 'lucide-react'; // Removed Bell
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';


interface StayHomeProps {
  user: { name?: string }; 
  reservation: Reservation;
}

export default function StayHome({ user, reservation }: StayHomeProps) {
  const t = useScopedI18n('stayHomePage');
  const currentLocale = useCurrentLocale();

  const guestName = user.name || `Guest in ${reservation.unit || 'Room'}`;
  const [countdown, setCountdown] = useState('');
  const [progressValue, setProgressValue] = useState(0); // Renamed to avoid conflict with Progress component

  useEffect(() => {
    const calculateCountdown = () => {
      const checkoutDate = new Date(reservation.endDate).getTime();
      const checkinDate = new Date(reservation.startDate).getTime();
      const now = new Date().getTime();

      if (now < checkinDate) {
        setCountdown(t('checkInSoon'));
        setProgressValue(0);
        return;
      }
      if (now > checkoutDate) {
        setCountdown(t('checkedOut'));
        setProgressValue(100);
        return;
      }
      
      const totalDuration = checkoutDate - checkinDate;
      const elapsedDuration = now - checkinDate;
      const calculatedProgress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
      setProgressValue(calculatedProgress);

      const timeLeft = checkoutDate - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      let countdownValue = "";
      if (days > 0) {
        countdownValue = `${days}d ${hours}h`;
      } else if (hours > 0) {
        countdownValue = `${hours}h ${minutes}m`;
      } else {
        countdownValue = `${minutes}m`;
      }
      setCountdown(t('countdownLeft', { value: countdownValue }));
    };

    calculateCountdown();
    const intervalId = setInterval(calculateCountdown, 60000); 
    return () => clearInterval(intervalId);
  }, [reservation.endDate, reservation.startDate, currentLocale, t]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

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
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('enjoyYourStay', { name: guestName.split(' ')[0] })}</h1>
                <p className="text-lg text-primary-foreground/90">{t('yourLocation', { branchName: reservation.branchName, unit: reservation.unit || 'your room' })}</p>
            </div>
        </div>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('checkoutInformation')}</span>
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
          </CardTitle>
          <CardDescription>{t('stayEndsOn', { date: formatDate(reservation.endDate) })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-accent">{countdown}</p>
            <Progress value={progressValue} className="w-full h-2" />
            <p className="text-xs text-muted-foreground">{t('standardCheckoutTime')}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard/check-in-out"><LogOut className="mr-2 h-4 w-4" /> {t('proceedToCheckout')}</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('localGuideAndServices')}</span>
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </CardTitle>
          <CardDescription>{t('exploreArea', { branchName: reservation.branchName })}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto py-3 flex-col space-y-1" asChild>
            <Link href="/dashboard/stay/concierge">
              <ConciergeBell className="h-7 w-7 mb-1 text-primary" />
              <span>{t('aiConcierge')}</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex-col space-y-1" asChild>
            <Link href="/dashboard/stay/services?type=food">
              <Utensils className="h-7 w-7 mb-1 text-primary" />
              <span>{t('orderFood')}</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex-col space-y-1" asChild>
            <Link href="/dashboard/stay/services?type=towels">
              <ShoppingBag className="h-7 w-7 mb-1 text-primary" />
              <span>{t('requestAmenities')}</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex-col space-y-1" asChild>
            <Link href="/dashboard/stay/local-guide">
              <Info className="h-7 w-7 mb-1 text-primary" />
              <span>{t('areaInfo')}</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
