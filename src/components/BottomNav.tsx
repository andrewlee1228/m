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
    // Add condition to check if reservation is needed (most tabs do)
    requiresReservation?: boolean;
  }

  // Define navigation items
  const navItems: NavItem[] = [
    { href: '/dashboard', labelKey: 'home', icon: Home, userTypes: 'all', requiresReservation: false }, // Home always visible
    { href: '/dashboard/payment', labelKey: 'payment', icon: CreditCard, userTypes: ['Live'], requiresReservation: true },
    { href: '/dashboard/maintenance', labelKey: 'maintenance', icon: Wrench, userTypes: ['Live', 'LongStay', 'Stay'], requiresReservation: true }, // Stay might use this for service req
    { href: '/dashboard/community', labelKey: 'community', icon: Users, userTypes: ['Live', 'LongStay'], requiresReservation: true },
    { href: '/dashboard/booking', labelKey: 'booking', icon: Ticket, userTypes: ['LongStay', 'Stay'], requiresReservation: true }, // Combined Stay/LongStay booking
    { href: '/dashboard/check-in-out', labelKey: 'checkInOut', icon: Ticket, userTypes: ['Stay'], requiresReservation: true }, // Specific Check-in/out for Stay
    { href: '/dashboard/stay/concierge', labelKey: 'concierge', icon: ConciergeBell, userTypes: ['Stay'], requiresReservation: true },
    { href: '/dashboard/facilities', labelKey: 'facilities', icon: Building2, userTypes: ['LongStay'], requiresReservation: true },
    { href: '/dashboard/profile', labelKey: 'profile', icon: User, userTypes: 'all', requiresReservation: false }, // Profile always visible
    { href: '/dashboard/settings', labelKey: 'settings', icon: Settings, userTypes: 'all', requiresReservation: false }, // Settings always visible
  ];


  // Determine current user context
   let currentUserType: UserType | null = null;
   let isAuthenticatedOrGuest = false;

   if (appContext.status === 'authenticated' || appContext.status === 'guest') {
       isAuthenticatedOrGuest = true;
       currentUserType = appContext.activeReservation?.type ?? null; // Use null if no active reservation
   }

  // Filter items based on authentication status and user type (if available)
  const visibleNavItems = navItems.filter(item => {
    // Always show items marked 'all' if user is authenticated or guest
    if (item.userTypes === 'all' && isAuthenticatedOrGuest) {
      return true;
    }
    // Show type-specific items only if user type matches AND there's an active reservation (or item doesn't require one)
    if (currentUserType && Array.isArray(item.userTypes) && item.userTypes.includes(currentUserType)) {
       return !item.requiresReservation || !!appContext.activeReservation;
    }
    return false;
  })
  // Limit to a max of 5 items (adjust as needed)
  .slice(0, 5);


  // Don't render the nav if not authenticated/guest or no items are visible
  if (!isAuthenticatedOrGuest || visibleNavItems.length === 0) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card shadow-lg lg:hidden"> {/* Increased shadow */}
      <div className="container mx-auto grid h-16 max-w-lg" style={{gridTemplateColumns: `repeat(${visibleNavItems.length}, minmax(0, 1fr))`}}>
        {visibleNavItems.map((item) => {
          // Determine if the current path matches the item's href
          // More robust check for active state, handling nested routes
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
          // Handle the root dashboard case separately
          if (item.href === '/dashboard' && pathname !== '/dashboard') {
             // Only active if path is exactly '/dashboard'
          }

          let label: string;
          try {
              label = t(item.labelKey);
          } catch (e) {
              console.warn(`Missing translation key for bottomNav.${item.labelKey}`);
              label = item.labelKey; // Fallback to key name
          }

          return (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 p-1 text-xs font-medium transition-colors duration-200 ease-in-out", // Adjusted padding/text size
                  isActive
                    ? "text-primary" // Active color
                    : "text-muted-foreground hover:text-primary" // Inactive color and hover effect
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} /> {/* Adjusted icon size */}
                <span className="truncate w-full text-center">{label}</span> {/* Ensure text truncation */}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Add missing i18n keys to the locales files if needed
// e.g., 'checkInOut', 'concierge' keys need to be added to en.ts, ko.ts, zh.ts under 'bottomNav'.
