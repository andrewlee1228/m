"use client";

import type { Reservation, CommunityEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, Building2, Users, PlusCircle, Wrench, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

interface LongStayHomeProps {
  user: { name: string };
  reservation: Reservation;
}

const mockLongStayEvents: CommunityEvent[] = [
  { id: 'ls-evt1', title: 'Resident Networking Mixer', description: 'Meet fellow long-stay residents.', date: '2024-07-25T18:00:00Z', location: 'Lounge Area', branchName: 'Executive Suites' },
  { id: 'ls-evt2', title: 'Wellness Workshop', description: 'Tips for healthy long-term stays.', date: '2024-08-10T10:00:00Z', location: 'Conference Room A', branchName: 'Executive Suites' },
];

export default function LongStayHome({ user, reservation }: LongStayHomeProps) {
  const t = useScopedI18n('longStayHomePage');
  const currentLocale = useCurrentLocale(); // Get current locale

  const upcomingEvent = mockLongStayEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
    return new Date(dateString).toLocaleDateString(currentLocale, options);
  };
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(currentLocale, { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="relative h-48 sm:h-64 w-full">
            <Image 
                src={`https://picsum.photos/seed/longstay_${reservation.branchName.replace(/\s+/g, '')}/1200/400`}
                alt={`${reservation.branchName} apartment complex`}
                fill // Use fill instead of layout="fill"
                className="object-cover" // Use objectFit directly as a class
                data-ai-hint="modern apartment"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('welcome', { name: user.name.split(' ')[0] })}</h1>
                <p className="text-lg text-primary-foreground/90">{t('yourExtendedStay', { branchName: reservation.branchName, unit: reservation.unit || 'Suite' })}</p>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">{t('stayDuration')}</CardTitle>
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{t('endsOn', { date: formatDate(reservation.endDate) })}</div>
            <p className="text-xs text-muted-foreground">
              {t('needMoreTime')}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/${currentLocale}/dashboard/booking/extend`}><PlusCircle className="mr-2 h-4 w-4" /> {t('extendYourStay')}</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">{t('amenityAccess')}</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{t('bookFacilities')}</div>
            <p className="text-xs text-muted-foreground">
              {t('accessAmenities')}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/${currentLocale}/dashboard/facilities`}><Info className="mr-2 h-4 w-4" /> {t('viewAndBookFacilities')}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>{t('communityAndServices')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/> {t('communityEvents')}</h3>
                {upcomingEvent ? (
                <div className="mt-1 text-sm">
                    <p className="font-medium">{upcomingEvent.title}</p>
                    <p className="text-xs text-muted-foreground">
                    {t('eventDetails', { date: formatDate(upcomingEvent.date), time: formatTime(upcomingEvent.date), location: upcomingEvent.location })}
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                        <Link href={`/${currentLocale}/dashboard/community`}>{t('viewAllEvents')}</Link>
                    </Button>
                </div>
                ) : (
                <p className="text-sm text-muted-foreground">{t('noUpcomingCommunityEvents')}</p>
                )}
            </div>
            <div>
                <h3 className="font-semibold flex items-center"><Wrench className="mr-2 h-5 w-5 text-primary"/> {t('longStayServices')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('specializedServicesDescription')}</p>
                 <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                    <Link href={`/${currentLocale}/dashboard/maintenance?type=longstay`}>{t('requestServices')}</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
