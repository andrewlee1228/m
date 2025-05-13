"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Globe, Moon, Sun, HelpCircle, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function SettingsPage() {
  // Mock state for settings
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
  });
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'

  // In a real app, these would interact with user preferences context or backend
  const handleNotificationChange = (type: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl">Settings</CardTitle>
        <CardDescription>Manage your application preferences and account settings.</CardDescription>
      </CardHeader>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="pushNotifications" className="font-medium">Push Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive real-time updates on your device.</p>
            </div>
            <Switch
              id="pushNotifications"
              checked={notifications.push}
              onCheckedChange={(value) => handleNotificationChange('push', value)}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Get important updates via email.</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notifications.email}
              onCheckedChange={(value) => handleNotificationChange('email', value)}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="smsNotifications" className="font-medium">SMS Notifications</Label>
              <p className="text-xs text-muted-foreground">Critical alerts via text message.</p>
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
          <CardTitle className="flex items-center"><Globe className="mr-2 h-5 w-5 text-primary" /> Display Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="language" className="font-medium block mb-1.5">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ko">한국어 (Korean)</SelectItem>
                <SelectItem value="zh">中文 (Chinese)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="theme" className="font-medium block mb-1.5">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme" className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light"><Sun className="inline-block mr-2 h-4 w-4" />Light</SelectItem>
                <SelectItem value="dark"><Moon className="inline-block mr-2 h-4 w-4" />Dark</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
            {/* Implement theme switching using next-themes or similar */}
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      {/* Help & Support */}
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-primary" /> Help & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/help/faq">
                    <span>FAQ</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
             <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/help/tutorials">
                    <span>Tutorials</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
             <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/help/contact-support">
                    <span>Contact Support</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}

// Mock useState for client component compatibility
// In a real app, this would be part of a larger state management or hook
function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>] {
    const [state, setState] = React.useState(initialState);
    return [state, setState];
}
import * as React from 'react'; // Required for useState usage like this
