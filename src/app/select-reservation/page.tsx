"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import AppLogo from '@/components/AppLogo';
import UserTypeBadge from '@/components/UserTypeBadge';
import { CheckCircle } from 'lucide-react'; // Removed ArrowRight
import type { Reservation } from '@/types';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

export default function SelectReservationPage() {
  const router = useRouter();
  const { appContext, selectReservation, logout } = useAppContext();
  const [selectedReservationId, setSelectedReservationId] = useState<string | undefined>(undefined);
  const t = useScopedI18n('selectReservationPage');
  const commonT = useScopedI18n('common');
  const currentLocale = useCurrentLocale();

  useEffect(() => {
    if (appContext.status === 'unauthenticated' || appContext.status === 'guest') {
      router.push('/login');
    } else if (appContext.status === 'authenticated' && appContext.user.activeReservations.length <= 1) {
      router.push('/dashboard');
    }
  }, [appContext, router]);
  
  useEffect(() => {
    if (appContext.status === 'authenticated' && appContext.activeReservation) {
      setSelectedReservationId(appContext.activeReservation.id);
    }
  }, [appContext]);


  if (appContext.status === 'loading' || appContext.status === 'unauthenticated' || appContext.status === 'guest') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
          <AppLogo className="w-32 h-auto mx-auto mb-8" />
          <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{t('loading')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('pleaseWait')}</p>
            </CardContent>
          </Card>
      </div>
    );
  }

  const reservations = appContext.user.activeReservations;

  const handleSelectReservation = () => {
    if (selectedReservationId) {
      selectReservation(selectedReservationId);
    }
  };
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(currentLocale, { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4 sm:p-6">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <AppLogo className="w-32 h-auto mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">{t('selectActiveService')}</CardTitle>
          <CardDescription>{t('multipleActiveServicesPrompt')}</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.length > 0 ? (
            <RadioGroup value={selectedReservationId} onValueChange={setSelectedReservationId} className="space-y-3">
              {reservations.map((res: Reservation) => (
                <Label
                  key={res.id}
                  htmlFor={res.id}
                  className={`flex flex-col items-start space-x-3 space-y-0 rounded-md border p-4 transition-all hover:bg-accent/10
                    ${selectedReservationId === res.id ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={res.id} id={res.id} />
                      <div>
                        <span className="font-semibold text-lg">{res.branchName}</span>
                        {res.unit && <span className="text-sm text-muted-foreground ml-2">({res.unit})</span>}
                      </div>
                    </div>
                    <UserTypeBadge type={res.type} />
                  </div>
                  <div className="pl-8 pt-1 text-sm text-muted-foreground">
                    <p>{t('service')} {res.type}</p>
                    <p>{t('period')} {formatDate(res.startDate)} - {formatDate(res.endDate)}</p>
                    {res.reservationNumber && <p>{t('reservationNo')} {res.reservationNumber}</p>}
                  </div>
                </Label>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-center text-muted-foreground">{t('noActiveReservations')}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button onClick={handleSelectReservation} disabled={!selectedReservationId || reservations.length === 0} className="w-full bg-primary hover:bg-primary/90">
            <CheckCircle className="mr-2 h-4 w-4" /> {t('continueToSelectedService')}
          </Button>
          <Button variant="link" onClick={logout} className="text-muted-foreground">
            {commonT('logout')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
