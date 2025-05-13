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

interface DaySelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface DayOptionConfig {
  days: number;
  labelKeySuffix?: 'oneWeek' | 'twoWeeks' | 'threeWeeks' | 'oneMonthApprox';
}

const dayOptionsConfig: DayOptionConfig[] = [
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

export function DaySelect({
  id,
  value,
  onValueChange,
  placeholder,
  disabled,
  className,
}: DaySelectProps) {
  const t = useScopedI18n('daySelect');

  const options = React.useMemo(() => {
    return dayOptionsConfig.map((opt) => {
      const valueString = t('daysUnit', { count: opt.days });
      const labelString = opt.labelKeySuffix
        ? t(opt.labelKeySuffix, { count: opt.days })
        : valueString;
      return { value: valueString, label: labelString };
    });
  }, [t]);

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn(className)}>
        <SelectValue placeholder={placeholder || t('selectPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
