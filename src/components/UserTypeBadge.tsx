import type { UserType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserTypeBadgeProps {
  type: UserType;
  className?: string;
}

export default function UserTypeBadge({ type, className }: UserTypeBadgeProps) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let badgeText = type;

  switch (type) {
    case 'Live':
      variant = 'default'; // Primary color (Deep Teal)
      badgeText = 'Live Resident';
      break;
    case 'Stay':
      variant = 'secondary'; // Accent color (Coral) or secondary
      // If using shadcn default colors directly, might need custom class for Coral
      // For now, 'secondary' will use theme's secondary.
      // Custom style for coral: className="bg-accent text-accent-foreground"
      badgeText = 'Stay Guest';
      break;
    case 'LongStay':
      variant = 'outline'; // A distinct outline style
      badgeText = 'Long Stay';
      break;
    default:
      variant = 'secondary';
  }
  
  // Special styling for Stay to use Accent color
  const typeSpecificClass = type === 'Stay' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : '';

  return (
    <Badge variant={variant} className={cn("capitalize text-xs px-2 py-0.5", typeSpecificClass, className)}>
      {badgeText}
    </Badge>
  );
}
