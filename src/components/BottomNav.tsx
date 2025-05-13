"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Settings, CreditCard, Wrench, Users, Ticket, Building2, ConciergeBell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import type { UserType } from '@/types';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';


export default function BottomNav() {
  const pathname = usePathname();
  const { appContext } = useAppContext();
  const t = useScopedI18n('bottomNav');
  const currentLocale = useCurrentLocale(); // Get current locale

  interface NavItem {
    href: string; // Relative to /dashboard
    labelKey: keyof typeof import('@/locales/en').default.bottomNav; 
    icon: React.ElementType;
    userTypes: UserType[] | 'all';
    requiresReservation?: boolean;
  }

  const navItems: NavItem[] = [
    { href: '/dashboard', labelKey: 'home', icon: Home, userTypes: 'all', requiresReservation: false },
    { href: '/dashboard/payment', labelKey: 'payment', icon: CreditCard, userTypes: ['Live'], requiresReservation: true },
    { href: '/dashboard/maintenance', labelKey: 'maintenance', icon: Wrench, userTypes: ['Live', 'LongStay', 'Stay'], requiresReservation: true },
    { href: '/dashboard/community', labelKey: 'community', icon: Users, userTypes: ['Live', 'LongStay'], requiresReservation: true },
    { href: '/dashboard/booking', labelKey: 'booking', icon: Ticket, userTypes: ['LongStay', 'Stay'], requiresReservation: true },
    { href: '/dashboard/check-in-out', labelKey: 'checkInOut', icon: Ticket, userTypes: ['Stay'], requiresReservation: true },
    { href: '/dashboard/stay/concierge', labelKey: 'concierge', icon: ConciergeBell, userTypes: ['Stay'], requiresReservation: true },
    { href: '/dashboard/facilities', labelKey: 'facilities', icon: Building2, userTypes: ['LongStay'], requiresReservation: true },
    { href: '/dashboard/profile', labelKey: 'profile', icon: User, userTypes: 'all', requiresReservation: false },
    { href: '/dashboard/settings', labelKey: 'settings', icon: Settings, userTypes: 'all', requiresReservation: false },
  ];


   let currentUserType: UserType | null = null;
   let isAuthenticatedOrGuest = false;

   if (appContext.status === 'authenticated' || appContext.status === 'guest') {
       isAuthenticatedOrGuest = true;
       currentUserType = appContext.activeReservation?.type ?? null;
   }

  const visibleNavItems = navItems.filter(item => {
    if (item.userTypes === 'all' && isAuthenticatedOrGuest) {
      return true;
    }
    if (currentUserType && Array.isArray(item.userTypes) && item.userTypes.includes(currentUserType)) {
       return !item.requiresReservation || !!appContext.activeReservation;
    }
    return false;
  })
  .slice(0, 5);


  if (!isAuthenticatedOrGuest || visibleNavItems.length === 0) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card shadow-lg lg:hidden">
      <div className="container mx-auto grid h-16 max-w-lg" style={{gridTemplateColumns: `repeat(${visibleNavItems.length}, minmax(0, 1fr))`}}>
        {visibleNavItems.map((item) => {
          const localePrefixedHref = `/${currentLocale}${item.href}`;
          // isActive check needs to account for the locale prefix in pathname
          const isActive = pathname === localePrefixedHref || (item.href !== '/dashboard' && pathname.startsWith(localePrefixedHref + '/'));
          
          let label: string;
          try {
              label = t(item.labelKey);
          } catch (e) {
              console.warn(`Missing translation key for bottomNav.${item.labelKey}`);
              label = item.labelKey; 
          }

          return (
            <Link key={item.href} href={localePrefixedHref} legacyBehavior>
              <a
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 p-1 text-xs font-medium transition-colors duration-200 ease-in-out",
                  isActive
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                <span className="truncate w-full text-center">{label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
