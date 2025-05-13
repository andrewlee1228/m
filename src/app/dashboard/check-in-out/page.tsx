"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, QrCode, Link2, Smile, Meh, Frown, AlertTriangle, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

export default function CheckInOutPage() {
  const { appContext } = useAppContext();
  const { toast } = useToast();
  const t = useScopedI18n('checkInOutPage');
  const currentLocale = useCurrentLocale();

  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (appContext.status !== 'guest' && (appContext.status !== 'authenticated' || appContext.activeReservation?.type !== 'Stay')) {
     return (
       <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>{t('featureNotApplicable')}</CardTitle>
          <CardDescription className="mt-2">{t('checkInOutForStayGuests')}</CardDescription>
        </Card>
      </div>
    );
  }

  const { activeReservation } = appContext;
  const now = new Date();
  const checkinDate = new Date(activeReservation.startDate);
  const checkoutDate = new Date(activeReservation.endDate);

  const checkinStartOfDay = new Date(checkinDate);
  checkinStartOfDay.setHours(0, 0, 0, 0);

  const checkoutEndOfDay = new Date(checkoutDate);
  checkoutEndOfDay.setHours(23, 59, 59, 999);

  const canCheckIn = now >= checkinStartOfDay && now < checkoutEndOfDay;
  const canCheckOut = now >= checkinStartOfDay;

  const formatDate = (date: Date) => date.toLocaleDateString(currentLocale);
  const formatTime = (date: Date) => date.toLocaleTimeString(currentLocale, { hour: '2-digit', minute: '2-digit' });

  const handleCheckIn = () => {
    toast({ title: t('checkInInitiatedToast'), description: t('followQRInstructionsToast') });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCheckingOut(false);
    toast({ title: t('checkoutSuccessfulToast'), description: t('thankYouFeedbackToast') });
  };

  const SmileyButton = ({ Icon, value, currentRating, onClick }: {Icon: React.ElementType, value: number, currentRating: number | null, onClick: (value: number) => void}) => (
    <Button
        variant={currentRating === value ? "default" : "outline"}
        size="icon"
        className={`rounded-full h-12 w-12 transition-all ${
          currentRating === value
            ? value <= 2 
              ? 'bg-destructive text-destructive-foreground scale-110' 
              : value === 3 
              ? 'bg-yellow-500 text-white scale-110' 
              : 'bg-green-500 text-white scale-110'
            : 'hover:bg-muted'
        }`}
        onClick={() => onClick(value)}
    >
        <Icon className="h-6 w-6" />
    </Button>
  );


  return (
    <div className="max-w-lg mx-auto space-y-8">
      <Card className="shadow-lg">
         <div className="relative h-40 w-full">
             <Image
                src={`https://picsum.photos/seed/checkin_${activeReservation.branchName.replace(/\s+/g, '')}/600/200`}
                alt="Hotel lobby or welcome area"
                layout="fill"
                objectFit="cover"
                data-ai-hint="hotel lobby"
            />
         </div>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('checkInOutTitle')}</CardTitle>
          <CardDescription>{t('manageArrivalDeparture', { branchName: activeReservation.branchName })}</CardDescription>
        </CardHeader>
      </Card>

      {canCheckIn && !canCheckOut && now < checkoutDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><LogIn className="mr-2 h-5 w-5 text-primary" /> {t('checkIn')}</CardTitle>
            <CardDescription>{t('checkInTimeInfo', { time: formatTime(checkinDate), date: formatDate(checkinDate) })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t('readyToScanQR')}</p>
            <div className="flex space-x-4">
              <Button className="flex-1" onClick={handleCheckIn}><QrCode className="mr-2 h-4 w-4" /> {t('scanQRCode')}</Button>
              <Button variant="outline" className="flex-1" onClick={handleCheckIn}><Link2 className="mr-2 h-4 w-4" /> {t('useCheckInLink')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {canCheckOut && now < checkoutEndOfDay && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><LogOut className="mr-2 h-5 w-5 text-destructive" /> {t('checkOut')}</CardTitle>
            <CardDescription>{t('standardCheckoutTimeInfo', { time: formatTime(new Date(checkoutDate.setHours(11,0,0,0))), date: formatDate(checkoutDate) })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="feedback" className="font-medium">{t('shareYourFeedback')}</Label>
              <p className="text-xs text-muted-foreground mb-2">{t('howWasYourStay')}</p>
              <div className="flex justify-around mb-3">
                <SmileyButton Icon={Frown} value={1} currentRating={rating} onClick={setRating} />
                <SmileyButton Icon={Meh} value={2} currentRating={rating} onClick={setRating} />
                <SmileyButton Icon={Meh} value={3} currentRating={rating} onClick={setRating} />
                <SmileyButton Icon={Smile} value={4} currentRating={rating} onClick={setRating} />
                <SmileyButton Icon={Smile} value={5} currentRating={rating} onClick={setRating} />
              </div>
              <Textarea
                id="feedback"
                placeholder={t('tellUsExperience')}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCheckout} className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground" disabled={isCheckingOut}>
              {isCheckingOut ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('processingCheckout')}</> : t('completeCheckout')}
            </Button>
          </CardFooter>
        </Card>
      )}
       {!canCheckIn && now < checkinStartOfDay && (
         <Card>
            <CardHeader>
                <CardTitle>{t('yourStayIsUpcoming')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('checkInBeginsOn', { date: formatDate(checkinDate), time: formatTime(checkinDate) })}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t('lookForwardToWelcoming')}</p>
            </CardContent>
         </Card>
       )}
       {now > checkoutEndOfDay && ( 
         <Card>
            <CardHeader>
                <CardTitle>{t('yourStayHasEnded')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('thankYouForStaying', { branchName: activeReservation.branchName })}</p>
                <Button variant="link" asChild className="mt-2 px-0"><Link href="/new-booking">{t('bookAnotherStay')}</Link></Button>
            </CardContent>
         </Card>
       )}
    </div>
  );
}
