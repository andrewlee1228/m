import type { HTMLAttributes } from 'react';
import { useScopedI18n } from '@/lib/i18n/client';
import { cn } from '@/lib/utils';

interface AppLogoProps extends HTMLAttributes<HTMLDivElement> {
  textColor?: string;
}

const AppLogo = ({ textColor = "hsl(var(--primary))", className, ...rest }: AppLogoProps) => {
  let ariaLabel = "Mangrove Logo"; // Default
  try {
    // This hook will only work if AppLogo is rendered within an I18nProviderClient context.
    // If AppLogo can be rendered outside, consider passing the label as a prop or a different i18n strategy.
    const commonT = useScopedI18n('common');
    ariaLabel = commonT('appLogoAriaLabel');
  } catch (e) {
    // Fallback if context is not available (e.g. rendered in a storybook or isolated environment)
    // console.warn("AppLogo: i18n context not available, using default aria-label.");
  }

  return (
    <div
      aria-label={ariaLabel}
      className={cn("font-bold text-2xl tracking-tight", className)} // Basic styling for text logo
      style={{ color: textColor }}
      {...rest}
    >
      Mangrove
    </div>
  );
};

export default AppLogo;
