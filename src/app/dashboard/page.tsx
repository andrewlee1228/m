"use client";

import { useAppContext } from '@/context/AppContext';
import LiveHome from '@/components/home/LiveHome';
import StayHome from '@/components/home/StayHome';
import LongStayHome from '@/components/home/LongStayHome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { useScopedI18n } from '@/lib/i18n/client';


export default function DashboardHomePage() {
  const { appContext } = useAppContext();
  const t = useScopedI18n('dashboardPage');
  const commonT = useScopedI18n('common');


  if (appContext.status === 'loading') {
    return <div className="text-center py-10">{t('loadingDashboard')}</div>;
  }

  if (appContext.status === 'unauthenticated') {
    return (
      <div className="text-center py-10">
        <p>{t('pleaseLogIn')}</p>
        <Button asChild className="mt-4"><Link href="/login">{t('goToLogin')}</Link></Button>
      </div>
    );
  }
  
  const { activeReservation } = appContext;

  if (!activeReservation) {
     if (appContext.status === 'authenticated' && appContext.user.activeReservations.length > 0) {
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
                        <Link href="/select-reservation">{t('selectAService')}</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }
    return (
       <Card className="max-w-lg mx-auto my-10 text-center">
        <CardHeader>
            <CardTitle className="text-xl">{t('welcomeToAxxel')}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">
                {t('noActiveReservations')}
            </p>
            <div className="space-x-4">
                <Button asChild variant="outline">
                    <Link href="/explore-properties">{t('exploreProperties')}</Link>
                </Button>
                <Button asChild>
                    <Link href="/new-booking">{t('makeAReservation')}</Link>
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
      return <div className="text-center py-10">{t('unknownReservationType')}</div>;
  }
}
