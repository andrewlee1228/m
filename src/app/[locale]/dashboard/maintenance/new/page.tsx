"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, Send, Paperclip, AlertTriangle, Home, Building, Loader2 } from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

// These should ideally be translation keys
const maintenanceCategories = [
  { value: "plumbing", labelKey: "plumbing" },
  { value: "electrical", labelKey: "electrical" },
  { value: "appliance", labelKey: "appliance" },
  { value: "hvac", labelKey: "hvac" },
  { value: "pest-control", labelKey: "pestControl" },
  { value: "general-repair", labelKey: "generalRepair" },
  { value: "cleaning", labelKey: "cleaning" },
  { value: "other", labelKey: "other" },
];

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  const { appContext } = useAppContext();
  const { toast } = useToast();
  const t = useScopedI18n('maintenanceRequestPage'); // Assuming a scope for this page
  const commonT = useScopedI18n('common');
  const currentLocale = useCurrentLocale();
  
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]); 

  if (appContext.status === 'loading') { // Handle loading explicitly
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (appContext.status === 'unauthenticated') {
    // This should ideally be handled by the layout, but as a fallback
    router.replace(`/${currentLocale}/login`);
    return null;
  }
  
  const { activeReservation } = appContext;
   if (!activeReservation || (activeReservation.type !== 'Live' && activeReservation.type !== 'LongStay' && activeReservation.type !== 'Stay')) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>{t('accessDenied.title')}</CardTitle>
          <CardDescription className="mt-2">{t('accessDenied.descriptionNotAvailable')}</CardDescription>
        </Card>
      </div>
    );
  }

  const userType = activeReservation.type;
  const pageTitle = userType === 'Stay' ? t('pageTitleService') : t('pageTitleMaintenance');
  const descriptionPlaceholder = userType === 'Stay' 
    ? t('descriptionPlaceholderService')
    : t('descriptionPlaceholderMaintenance');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!category || !description) {
      toast({ title: t('submitError.missingInfoTitle'), description: t('submitError.missingInfoDescription'), variant: "destructive" });
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: t('submitSuccess.title'),
      description: t('submitSuccess.description'),
    });
    router.push(`/${currentLocale}/dashboard/maintenance`); 
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPhotos(Array.from(event.target.files));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Wrench className="mr-2 h-6 w-6 text-primary" />
            {pageTitle}
          </CardTitle>
          <CardDescription>
            {t('pageSubtitle', { location: activeReservation.unit ? `${t('unit')} ${activeReservation.unit}` : activeReservation.branchName })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="category" className="font-medium">{t('categoryLabel')}</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder={t('categoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{t(`categories.${cat.labelKey}` as any)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="font-medium">{t('descriptionLabel')}</Label>
              <Textarea
                id="description"
                placeholder={descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="photos" className="font-medium">{t('photosLabel')}</Label>
              <Input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                disabled={isLoading}
              />
              {photos.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {t('filesSelected', { count: photos.length, names: photos.map(f => f.name).join(', ') })}
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              {t('urgentIssueNote')}
            </p>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('submittingButton')}</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> {t('submitButton')}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
