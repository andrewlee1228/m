"use client";

import type { UserType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useScopedI18n } from '@/lib/i18n/client';

interface UserTypeBadgeProps {
  type: UserType;
  className?: string;
}

export default function UserTypeBadge({ type, className }: UserTypeBadgeProps) {
  const t = useScopedI18n('userTypeBadge');
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let badgeTextKey: keyof typeof import('@/locales/en').default.userTypeBadge = type;

  switch (type) {
    case 'Live':
      variant = 'default';
      badgeTextKey = 'Live';
      break;
    case 'Stay':
      variant = 'secondary';
      badgeTextKey = 'Stay';
      break;
    case 'LongStay':
      variant = 'outline';
      badgeTextKey = 'LongStay';
      break;
    default:
      variant = 'secondary';
  }
  
  const badgeText = t(badgeTextKey);
  const typeSpecificClass = type === 'Stay' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : '';

  return (
    <Badge variant={variant} className={cn("capitalize text-xs px-2 py-0.5", typeSpecificClass, className)}>
      {badgeText}
    </Badge>
  );
}
