"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Globe, Moon, Sun, HelpCircle, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useScopedI18n, useChangeLocale, useCurrentLocale } from '@/lib/i18n/client';
import type { Locale } from '@/lib/i18n/config';

export default function SettingsPage() {
  const t = useScopedI18n('settingsPage');
  const commonT = useScopedI18n('common');
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const [notifications, setNotifications] = React.useState({
    push: true,
    email: false,
    sms: false,
  });
  const [theme, setTheme] = React.useState('system'); 

  const handleNotificationChange = (type: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> {t('notifications.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="pushNotifications" className="font-medium">{t('notifications.push')}</Label>
              <p className="text-xs text-muted-foreground">{t('notifications.pushDescription')}</p>
            </div>
            <Switch
              id="pushNotifications"
              checked={notifications.push}
              onCheckedChange={(value) => handleNotificationChange('push', value)}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="emailNotifications" className="font-medium">{t('notifications.email')}</Label>
              <p className="text-xs text-muted-foreground">{t('notifications.emailDescription')}</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notifications.email}
              onCheckedChange={(value) => handleNotificationChange('email', value)}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="smsNotifications" className="font-medium">{t('notifications.sms')}</Label>
              <p className="text-xs text-muted-foreground">{t('notifications.smsDescription')}</p>
            </div>
            <Switch
              id="smsNotifications"
              checked={notifications.sms}
              onCheckedChange={(value) => handleNotificationChange('sms', value)}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Language and Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Globe className="mr-2 h-5 w-5 text-primary" /> {t('display.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="language" className="font-medium block mb-1.5">{t('display.language')}</Label>
            <Select value={currentLocale} onValueChange={(value) => changeLocale(value as Locale)}>
              <SelectTrigger id="language" className="w-full sm:w-[200px]">
                <SelectValue placeholder={t('display.languageSelectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('languages.en')}</SelectItem>
                <SelectItem value="ko">{t('languages.ko')}</SelectItem>
                <SelectItem value="zh">{t('languages.zh')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="theme" className="font-medium block mb-1.5">{t('display.theme')}</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme" className="w-full sm:w-[200px]">
                <SelectValue placeholder={t('display.themeSelectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light"><Sun className="inline-block mr-2 h-4 w-4" />{t('display.lightTheme')}</SelectItem>
                <SelectItem value="dark"><Moon className="inline-block mr-2 h-4 w-4" />{t('display.darkTheme')}</SelectItem>
                <SelectItem value="system">{t('display.systemTheme')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      {/* Help & Support */}
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-primary" /> {t('help.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href={`/${currentLocale}/help/faq`}>
                    <span>{t('help.faq')}</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
             <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href={`/${currentLocale}/help/tutorials`}>
                    <span>{t('help.tutorials')}</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
             <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href={`/${currentLocale}/help/contact-support`}>
                    <span>{t('help.contactSupport')}</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
