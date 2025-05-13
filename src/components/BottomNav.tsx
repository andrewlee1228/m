"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Settings, CreditCard, Wrench, Users, Ticket, Building2, ConciergeBell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import type { UserType } from '@/types';
import { useScopedI18n } from '@/lib/i18n/client';


export default function BottomNav() {
  const pathname = usePathname();
  const { appContext } = useAppContext();
  const t = useScopedI18n('bottomNav');

  interface NavItem {
    href: string;
    labelKey: keyof typeof import('@/locales/en').default.bottomNav; // Type-safe key
    icon: React.ElementType;
    userTypes: UserType[] | 'all'; 
  }
  
  const commonNavItems: NavItem[] = [
    { href: '/dashboard', labelKey: 'home', icon: Home, userTypes: 'all' },
    { href: '/dashboard/profile', labelKey: 'profile', icon: User, userTypes: 'all' },
    { href: '/dashboard/settings', labelKey: 'settings', icon: Settings, userTypes: 'all' },
  ];
  
  const typeSpecificNavItems: NavItem[] = [
    { href: '/dashboard/payment', labelKey: 'payment', icon: CreditCard, userTypes: ['Live'] },
    { href: '/dashboard/maintenance', labelKey: 'maintenance', icon: Wrench, userTypes: ['Live', 'LongStay'] },
    { href: '/dashboard/community', labelKey: 'community', icon: Users, userTypes: ['Live', 'LongStay'] },
    { href: '/dashboard/check-in-out', labelKey: 'booking', icon: Ticket, userTypes: ['Stay'] }, 
    { href: '/dashboard/stay/concierge', labelKey: 'services', icon: ConciergeBell, userTypes: ['Stay'] }, 
    { href: '/dashboard/booking', labelKey: 'booking', icon: Ticket, userTypes: ['LongStay'] },
    { href: '/dashboard/facilities', labelKey: 'facilities', icon: Building2, userTypes: ['LongStay'] },
  ];


  if (appContext.status !== 'authenticated' && appContext.status !== 'guest') {
    return null;
  }
  
  const currentUserType = appContext.activeReservation?.type;
  let visibleNavItems: NavItem[] = [];

  if (currentUserType) {
     const commonFiltered = commonNavItems.filter(item => item.userTypes === 'all' || item.userTypes.includes(currentUserType));
     const specificFiltered = typeSpecificNavItems.filter(item => item.userTypes !== 'all' && item.userTypes.includes(currentUserType));
     
     const homeItem = commonFiltered.find(item => item.labelKey === 'home');
     if (homeItem) visibleNavItems.push(homeItem);
     
     visibleNavItems.push(...specificFiltered.slice(0, 2));

     const profileItem = commonFiltered.find(item => item.labelKey === 'profile');
     if (profileItem && visibleNavItems.length < 5 && !visibleNavItems.some(i => i.labelKey === 'profile')) {
       visibleNavItems.push(profileItem);
     }

     const settingsItem = commonFiltered.find(item => item.labelKey === 'settings');
     if (settingsItem && visibleNavItems.length < 5 && !visibleNavItems.some(i => i.labelKey === 'settings')) {
        visibleNavItems.push(settingsItem);
     }
     visibleNavItems = visibleNavItems.slice(0, 5);

  } else {
    visibleNavItems = commonNavItems.filter(item => item.labelKey === 'home' || item.labelKey === 'profile' || item.labelKey === 'settings').slice(0,5);
  }


  if (visibleNavItems.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card shadow-top lg:hidden">
      <div className="container mx-auto grid h-16 max-w-lg" style={{gridTemplateColumns: `repeat(${visibleNavItems.length}, minmax(0, 1fr))`}}>
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const label = t(item.labelKey);
          return (
            <Link key={label} href={item.href} legacyBehavior>
              <a
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 rounded-md p-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")} />
                <span>{label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
