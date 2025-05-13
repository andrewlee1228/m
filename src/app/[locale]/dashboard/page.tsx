"use client";

import { useAppContext } from '@/context/AppContext';
import LiveHome from '@/components/home/LiveHome';
import StayHome from '@/components/home/StayHome';
import LongStayHome from '@/components/home/LongStayHome';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';


export default function DashboardHomePage() {
  const { appContext } = useAppContext();
  const t = useScopedI18n('dashboardPage');
  const commonT = useScopedI18n('common');
  const currentLocale = useCurrentLocale();


  if (appContext.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{t('loadingDashboard')}</p>
      </div>
    );
  }

  if (appContext.status === 'unauthenticated') {
    return (
      <div className="text-center py-10">
        <p>{t('pleaseLogIn')}</p>
        <Button asChild className="mt-4"><Link href={`/${currentLocale}/login`}>{t('goToLogin')}</Link></Button>
      </div>
    );
  }

  if (appContext.status === 'authenticated') {
    const { user, activeReservation } = appContext;

    if (user.activeReservations.length === 0) {
      return (
         <Card className="max-w-lg mx-auto my-10 text-center">
          <CardHeader>
              <CardTitle className="text-xl">{t('welcomeToAxxelName', { name: user.name.split(' ')[0] })}</CardTitle>
              <CardDescription>{t('noActiveReservations')}</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-x-4">
                  <Button asChild variant="outline">
                      <Link href={`/${currentLocale}/explore-properties`}>{t('exploreProperties')}</Link>
                  </Button>
                  <Button asChild>
                      <Link href={`/${currentLocale}/new-booking`}>{t('makeAReservation')}</Link>
                  </Button>
              </div>
          </CardContent>
        </Card>
      );
    }

    if (user.activeReservations.length > 1 && !activeReservation) {
       return (
            <Card className="max-w-lg mx-auto my-10 text-center">
               <CardHeader>
                   <CardTitle className="flex items-center justify-center text-xl">
                       <AlertTriangle className="h-6 w-6 mr-2 text-destructive" /> {t('noActiveServiceSelected')}
                   </CardTitle>
               </CardHeader>
               <CardContent>
                   <p className="text-muted-foreground mb-4">
                       {t('selectActiveServicePrompt')}
                   </p>
                   <Button asChild>
                       <Link href={`/${currentLocale}/select-reservation`}>{t('selectAService')}</Link>
                   </Button>
               </CardContent>
           </Card>
       );
    }

    if (activeReservation) {
       const userDetails = { name: user.name }; 
        switch (activeReservation.type) {
            case 'Live':
                return <LiveHome user={userDetails} reservation={activeReservation} />;
            case 'Stay':
                return <StayHome user={userDetails} reservation={activeReservation} />;
            case 'LongStay':
                return <LongStayHome user={userDetails} reservation={activeReservation} />;
            default:
                return (
                    <div className="text-center py-10">
                        <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" />
                        {t('unknownReservationType')}
                    </div>
                );
        }
    }
  }

  if (appContext.status === 'guest' && appContext.activeReservation) {
     const guestName = `Guest (${appContext.activeReservation.reservationNumber})`;
     const userDetails = { name: guestName };
     return <StayHome user={userDetails} reservation={appContext.activeReservation} />;
  }

  return (
    <div className="text-center py-10">
        <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" />
        <p>{commonT('error')}: {t('unexpectedState')}</p>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">{t('reloadPage')}</Button>
    </div>
  );
}
