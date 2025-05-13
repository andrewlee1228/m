"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CalendarPlus, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import UserTypeBadge from '@/components/UserTypeBadge';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

export default function BookingManagementPage() {
  const { appContext } = useAppContext();
  const t = useScopedI18n('bookingManagementPage');
  const commonT = useScopedI18n('common');
  const currentLocale = useCurrentLocale();

  if (appContext.status !== 'authenticated' || (appContext.activeReservation?.type !== 'LongStay' && appContext.activeReservation?.type !== 'Stay')) {
     return (
       <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>{t('bookingManagementNotApplicable')}</CardTitle>
          <CardDescription className="mt-2">{t('featureForLongStayOrStay')}</CardDescription>
        </Card>
      </div>
    );
  }
  
  const { activeReservation } = appContext;
  const userType = activeReservation.type;
  const userTypeDisplay = userType.toLowerCase(); // This might need translation if "longstay", "stay" are keys

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl flex items-center">
            <CalendarCheck className="mr-3 h-8 w-8 text-primary" />
            {t('manageYourBooking')}
        </CardTitle>
        <CardDescription>
            {t('manageYourStayAt', { userType: userTypeDisplay, branchName: activeReservation.branchName})}
        </CardDescription>
      </CardHeader>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl">{t('currentReservationDetails')}</CardTitle>
                <CardDescription>{t('accommodationDetails', { branchName: activeReservation.branchName, unit: activeReservation.unit || 'Your Accommodation' })}</CardDescription>
            </div>
            <UserTypeBadge type={userType} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
            <p><strong>{t('reservationNumber')}</strong> {activeReservation.reservationNumber || 'N/A'}</p>
            <p><strong>{t('checkInDate')}</strong> {formatDate(activeReservation.startDate)}</p>
            <p><strong>{t('checkOutDate')}</strong> {formatDate(activeReservation.endDate)}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" asChild>
                <Link href={`/dashboard/booking/details/${activeReservation.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> {commonT('viewDetails')}
                </Link>
            </Button>
            {userType === 'LongStay' && (
                <Button asChild>
                    <Link href={`/dashboard/booking/extend/${activeReservation.id}`}>
                        <CalendarPlus className="mr-2 h-4 w-4" /> {commonT('extendStay')}
                    </Link>
                </Button>
            )}
             {userType === 'Stay' && (
                <Button asChild>
                    <Link href={`/dashboard/booking/modify/${activeReservation.id}`}>
                        <CalendarPlus className="mr-2 h-4 w-4" /> {commonT('modifyBooking')}
                    </Link>
                </Button>
            )}
        </CardFooter>
      </Card>

      {userType === 'LongStay' && (
        <Card>
            <CardHeader>
                <CardTitle>{t('longStayOptions')}</CardTitle>
                <CardDescription>{t('exploreLongStayBenefits')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>{t('weeklyHousekeeping')}</li>
                    <li>{t('discountedRates')}</li>
                    <li>{t('exclusiveResidentEvents')}</li>
                </ul>
                 <Button variant="link" className="mt-3 px-0">{t('learnMoreLongStayPerks')}</Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
