// src/components/shared/DaySelect.tsx
'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useScopedI18n } from '@/lib/i18n/client';
import { cn } from '@/lib/utils';

export interface DayOptionConfig {
  days: number;
  labelKeySuffix?: 'oneWeek' | 'twoWeeks' | 'threeWeeks' | 'oneMonthApprox';
}

export const dayOptionsConfig: DayOptionConfig[] = [
  { days: 1 },
  { days: 2 },
  { days: 3 },
  { days: 4 },
  { days: 5 },
  { days: 6 },
  { days: 7, labelKeySuffix: 'oneWeek' },
  { days: 10 },
  { days: 14, labelKeySuffix: 'twoWeeks' },
  { days: 21, labelKeySuffix: 'threeWeeks' },
  { days: 30, labelKeySuffix: 'oneMonthApprox' },
];

interface DaySelectProps {
  id?: string;
  value: string; // Expects a stringified number of days, e.g., "1", "7", "30"
  onValueChange: (value: string) => void; // Will emit a stringified number of days
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DaySelect({
  id,
  value,
  onValueChange,
  placeholder,
  disabled,
  className,
}: DaySelectProps) {
  const t = useScopedI18n('daySelect');

  const selectOptions = React.useMemo(() => {
    return dayOptionsConfig.map((optConfig) => {
      const uniqueValueStr = String(optConfig.days);
      const localizedDayCountStr = t('daysUnit', { count: optConfig.days });
      
      const displayLabel = optConfig.labelKeySuffix
        ? t(optConfig.labelKeySuffix, { count: optConfig.days })
        : localizedDayCountStr;
        
      return { value: uniqueValueStr, label: displayLabel };
    });
  }, [t]);

  const currentOption = selectOptions.find(opt => opt.value === value);

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn(className)}>
        <SelectValue placeholder={placeholder || t('selectPlaceholder')}>
          {currentOption ? currentOption.label : (placeholder || t('selectPlaceholder'))}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {selectOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
