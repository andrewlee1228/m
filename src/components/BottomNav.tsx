"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Settings, CreditCard, Wrench, Users, Ticket, Briefcase, Building2, ConciergeBell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import type { UserType } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  userTypes: UserType[] | 'all'; // 'all' or specific user types
}

const commonNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: Home, userTypes: 'all' },
  // Profile and Settings are usually accessed via Header/Sidebar in mobile apps,
  // but PRD specifies them in bottom nav.
  { href: '/dashboard/profile', label: 'Profile', icon: User, userTypes: 'all' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, userTypes: 'all' },
];

const typeSpecificNavItems: NavItem[] = [
  // Live
  { href: '/dashboard/payment', label: 'Payment', icon: CreditCard, userTypes: ['Live'] },
  { href: '/dashboard/maintenance', label: 'Maintenance', icon: Wrench, userTypes: ['Live', 'LongStay'] }, // Also for LongStay
  { href: '/dashboard/community', label: 'Community', icon: Users, userTypes: ['Live', 'LongStay'] }, // Also for LongStay
  // Stay
  { href: '/dashboard/check-in-out', label: 'Booking', icon: Ticket, userTypes: ['Stay'] }, // Simplified 'Booking' for Check-in/out
  { href: '/dashboard/concierge', label: 'Services', icon: ConciergeBell, userTypes: ['Stay'] }, // Concierge is a key service
  // LongStay
  { href: '/dashboard/booking', label: 'Booking', icon: Ticket, userTypes: ['LongStay'] }, // For extensions, etc.
  { href: '/dashboard/facilities', label: 'Facilities', icon: Building2, userTypes: ['LongStay'] },
];


export default function BottomNav() {
  const pathname = usePathname();
  const { appContext } = useAppContext();

  if (appContext.status !== 'authenticated' && appContext.status !== 'guest') {
    return null; // Don't show nav if not logged in
  }
  
  const currentUserType = appContext.activeReservation?.type;

  let visibleNavItems: NavItem[] = [];

  if (currentUserType) {
     const commonFiltered = commonNavItems.filter(item => item.userTypes === 'all' || item.userTypes.includes(currentUserType));
     const specificFiltered = typeSpecificNavItems.filter(item => item.userTypes !== 'all' && item.userTypes.includes(currentUserType));
     
     // Prioritize specific items, then fill with common ones up to 5.
     // This logic ensures a max of 5 tabs as suggested in PRD.
     // A more robust logic might be needed for perfect tab selection.
     // For now: Home + 2 specific + Profile + Settings (if space, otherwise some specific ones might be omitted).
     // Simpler: Home, up to 2 most relevant specific, Profile, Settings.

     // Let's refine: Home is always first. Then up to 2 specific. Then Profile & Settings if slots are available.
     // Max 5 tabs.
     
     visibleNavItems.push(commonNavItems.find(item => item.label === 'Home')!);
     
     const relevantSpecificItems = specificFiltered.slice(0, 2); // Take up to 2 specific items
     visibleNavItems.push(...relevantSpecificItems);

     const remainingSlots = 5 - visibleNavItems.length;
     if (remainingSlots > 0) {
        const profileItem = commonNavItems.find(item => item.label === 'Profile');
        if (profileItem && !visibleNavItems.find(i => i.label === 'Profile')) visibleNavItems.push(profileItem);
     }
     if (remainingSlots > 1) { // Need 2 slots for Profile and Settings
        const settingsItem = commonNavItems.find(item => item.label === 'Settings');
        if (settingsItem && !visibleNavItems.find(i => i.label === 'Settings')) visibleNavItems.push(settingsItem);
     }
     // Ensure we don't exceed 5 tabs
     visibleNavItems = visibleNavItems.slice(0, 5);

  } else {
    // Fallback for authenticated users with no active reservation (e.g. only has an account)
    visibleNavItems = commonNavItems.filter(item => item.label === 'Home' || item.label === 'Profile' || item.label === 'Settings').slice(0,5);
  }


  if (visibleNavItems.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card shadow-top lg:hidden">
      <div className="container mx-auto grid h-16 max-w-lg grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-center px-2">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href} legacyBehavior>
              <a
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 rounded-md p-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")} />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
