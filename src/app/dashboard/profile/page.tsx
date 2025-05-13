"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // Not used for display
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Edit3, Shield } from 'lucide-react';
import UserTypeBadge from '@/components/UserTypeBadge';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

export default function ProfilePage() {
  const { appContext, logout } = useAppContext();
  const t = useScopedI18n('profilePage');
  const commonT = useScopedI18n('common');
  const currentLocale = useCurrentLocale();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale);
  };

  if (appContext.status !== 'authenticated') {
    if (appContext.status === 'guest') {
         return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('guestProfile')}</CardTitle>
                        <CardDescription>{t('yourCurrentStayInfo')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p><strong>{t('reservationNumber')}</strong> {appContext.guestData.reservation.reservationNumber}</p>
                        <p><strong>{t('branch')}</strong> {appContext.guestData.reservation.branchName}</p>
                        <p><strong>{t('stayPeriod')}</strong> {formatDate(appContext.guestData.reservation.startDate)} - {formatDate(appContext.guestData.reservation.endDate)}</p>
                        <UserTypeBadge type={appContext.guestData.reservation.type} className="mt-2" />
                         <Button onClick={logout} variant="outline" className="w-full mt-6">{t('endGuestSession')}</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return <p className="text-center py-10">{t('pleaseLogInToViewProfile')}</p>;
  }

  const { user } = appContext;
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
            <AvatarImage src={`https://picsum.photos/seed/${user.name}/100/100`} alt={user.name} data-ai-hint="profile picture" />
            <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">{user.name}</CardTitle>
          <CardDescription>{t('manageProfileInfo')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('personalInformation')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-md">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="profileName" className="text-xs text-muted-foreground">{t('fullName')}</Label>
                  <p id="profileName" className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-md">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="profileEmail" className="text-xs text-muted-foreground">{t('emailAddress')}</Label>
                  <p id="profileEmail" className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-md">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="profilePhone" className="text-xs text-muted-foreground">{t('phoneNumber')}</Label>
                  <p id="profilePhone" className="font-medium">{user.phone}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full sm:w-auto">
              <Edit3 className="mr-2 h-4 w-4" /> {t('editInformation')}
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">{t('activeServices')}</h3>
            {user.activeReservations.length > 0 ? (
              <div className="space-y-3">
                {user.activeReservations.map(res => (
                  <Card key={res.id} className="bg-secondary/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{res.branchName} {res.unit ? `(${res.unit})` : ''}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(res.startDate)} - {formatDate(res.endDate)}
                          </p>
                        </div>
                        <UserTypeBadge type={res.type} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">{t('noActiveServices')}</p>
            )}
             <Button variant="outline" className="mt-4 w-full sm:w-auto">
                {t('addNewServiceReservation')}
            </Button>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('accountSecurity')}</h3>
            <Button variant="outline" className="w-full sm:w-auto">
              <Shield className="mr-2 h-4 w-4" /> {t('changePassword')}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">{t('enable2FA')}</p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
