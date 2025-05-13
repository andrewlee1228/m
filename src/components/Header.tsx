"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import AppLogo from './AppLogo';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ChevronDown, LogOut, UserCircle, Settings, Repeat, Home, Building } from 'lucide-react';
import UserTypeBadge from './UserTypeBadge';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

export default function Header() {
  const { appContext, logout, switchReservation } = useAppContext();
  const router = useRouter();
  const t = useScopedI18n('header');
  const commonT = useScopedI18n('common');
  const currentLocale = useCurrentLocale();

  if (appContext.status !== 'authenticated' && appContext.status !== 'guest') {
    return ( 
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" legacyBehavior><a className="flex items-center space-x-2"><AppLogo className="h-7 w-auto" /></a></Link>
        </div>
      </header>
    );
  }

  const { activeReservation } = appContext;
  const userName = appContext.status === 'authenticated' ? appContext.user.name : "Guest";
  const userEmail = appContext.status === 'authenticated' ? appContext.user.email : activeReservation?.reservationNumber;
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }

  const handleSwitchReservation = (reservationId: string) => {
    if (appContext.status === 'authenticated') {
      switchReservation(reservationId);
    }
  };
  
  const canSwitch = appContext.status === 'authenticated' && appContext.user.activeReservations.length > 1;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(currentLocale);


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" legacyBehavior>
          <a className="flex items-center">
            <AppLogo className="h-8 w-auto" />
          </a>
        </Link>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {activeReservation && (
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className={`flex flex-col items-end h-auto p-1 text-right ${canSwitch ? 'cursor-pointer' : 'cursor-default'}`}>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-foreground mr-1 hidden sm:inline">
                      {activeReservation.branchName}
                    </span>
                     <Building className="h-4 w-4 text-muted-foreground sm:hidden" />
                    {canSwitch && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <UserTypeBadge type={activeReservation.type} />
                </Button>
              </SheetTrigger>
              {canSwitch && appContext.status === 'authenticated' && (
                <SheetContent side="top" className="w-full rounded-b-lg">
                  <SheetHeader>
                    <SheetTitle>{t('switchServiceContext')}</SheetTitle>
                    <SheetDescription>
                      {t('switchServiceDescription')}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-3 py-4">
                    {appContext.user.activeReservations.map((res) => (
                      <Button
                        key={res.id}
                        variant={activeReservation.id === res.id ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleSwitchReservation(res.id)}
                      >
                        <div className="flex flex-col">
                           <div className="flex items-center">
                            <span className="font-semibold">{res.branchName}</span>
                            {res.unit && <span className="text-xs text-muted-foreground ml-1">({res.unit})</span>}
                           </div>
                          <div className="text-xs">
                            <UserTypeBadge type={res.type} />
                            <span className="ml-2 text-muted-foreground">
                              {formatDate(res.startDate)} - {formatDate(res.endDate)}
                            </span>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              )}
            </Sheet>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                 <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://picsum.photos/seed/${userName}/40/40`} alt={userName} data-ai-hint="profile avatar" />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="pb-4 border-b mb-4">
                <div className="flex items-center space-x-3">
                   <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://picsum.photos/seed/${userName}/80/80`} alt={userName} data-ai-hint="user avatar" />
                    <AvatarFallback className="text-xl">{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-lg">{userName}</SheetTitle>
                    <SheetDescription className="text-xs truncate max-w-[200px]">{userEmail}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start text-base" onClick={() => router.push('/dashboard')}>
                  <Home className="mr-2 h-5 w-5" /> {t('dashboard')}
                </Button>
                <Button variant="ghost" className="justify-start text-base" onClick={() => router.push('/dashboard/profile')}>
                  <UserCircle className="mr-2 h-5 w-5" /> {commonT('profile')}
                </Button>
                <Button variant="ghost" className="justify-start text-base" onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 h-5 w-5" /> {commonT('settings')}
                </Button>
                {canSwitch && (
                   <SheetTrigger asChild>
                    <Button variant="ghost" className="justify-start text-base">
                        <Repeat className="mr-2 h-5 w-5" /> {t('switchServiceContext')}
                    </Button>
                   </SheetTrigger>
                )}
                <Button variant="ghost" className="justify-start text-base text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                  <LogOut className="mr-2 h-5 w-5" /> {commonT('logout')}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
