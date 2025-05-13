"use client";

import type { Reservation, Payment, MaintenanceRequest, CommunityEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List, DollarSign, Wrench, CalendarDays } from 'lucide-react'; // Removed ArrowRight
import Link from 'next/link';
import Image from 'next/image';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

interface LiveHomeProps {
  user: { name: string };
  reservation: Reservation;
}

// Mock Data - Titles and descriptions ideally come from a translatable source
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
  const t = useScopedI18n('liveHomePage');
  const commonT = useScopedI18n('common');
  const currentLocale = useCurrentLocale();

  const upcomingPayment = mockPayments.find(p => p.status === 'Pending') || mockPayments.find(p => new Date(p.date) >= new Date() && p.status !== 'Paid');
  const recentRequest = mockMaintenanceRequests[0];
  const upcomingEvent = mockCommunityEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

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
                src="https://picsum.photos/seed/livehome/1200/400" 
                alt="Apartment building exterior" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="apartment building"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('welcomeHome', {name: user.name.split(' ')[0]})}</h1>
                <p className="text-lg text-primary-foreground/90">{t('managingYourUnit', {unit: reservation.unit, branchName: reservation.branchName})}</p>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">{t('rentAndPayments')}</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingPayment ? (
              <>
                <div className="text-2xl font-bold">{upcomingPayment.currency} {upcomingPayment.amount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dueForDate', { date: formatDate(upcomingPayment.date), description: upcomingPayment.description})}
                </p>
              </>
            ) : (
              <p className="text-green-600 font-semibold">{t('allPaymentsUpToDate')}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/payment"><List className="mr-2 h-4 w-4" /> {commonT('viewPayments')}</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">{t('maintenance')}</CardTitle>
            <Wrench className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recentRequest ? (
              <>
                <div className="text-lg font-semibold truncate">{recentRequest.description}</div>
                <p className="text-xs text-muted-foreground">{t('status', { status: recentRequest.status })}</p>
              </>
            ) : (
              <p className="text-muted-foreground">{t('noActiveRequests')}</p>
            )}
          </CardContent>
           <CardFooter className="flex space-x-2">
            <Button asChild className="flex-1" variant="outline">
              <Link href="/dashboard/maintenance/new">{commonT('newRequest')}</Link>
            </Button>
             <Button asChild className="flex-1" variant="outline">
              <Link href="/dashboard/maintenance"><List className="mr-2 h-4 w-4" />{commonT('allRequests')}</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">{t('communityEvents')}</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingEvent ? (
              <>
                <div className="text-lg font-semibold">{upcomingEvent.title}</div>
                <p className="text-xs text-muted-foreground">
                  {t('eventAtTime', { date: formatDate(upcomingEvent.date), time: formatTime(upcomingEvent.date)})}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">{t('noUpcomingEvents')}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/community"><List className="mr-2 h-4 w-4" /> {commonT('viewEvents')}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" className="flex-col h-auto py-4" asChild>
                <Link href="/dashboard/payment">
                    <DollarSign className="h-8 w-8 mb-1 text-primary"/>
                    {t('payRent')}
                </Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-col h-auto py-4" asChild>
                <Link href="/dashboard/maintenance/new">
                    <Wrench className="h-8 w-8 mb-1 text-primary"/>
                    {t('requestService')}
                </Link>
            </Button>
             <Button variant="outline" size="lg" className="flex-col h-auto py-4" asChild>
                <Link href="/dashboard/community">
                    <CalendarDays className="h-8 w-8 mb-1 text-primary"/>
                    {t('communityHub')}
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
