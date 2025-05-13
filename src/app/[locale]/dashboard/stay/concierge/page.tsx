"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, MapPin, Utensils, ShoppingBag, AlertTriangle as AlertTriangleIcon } from 'lucide-react'; // Renamed AlertTriangle to avoid conflict
import { useToast } from '@/hooks/use-toast';
import { aiConciergeForStayUsers, type AiConciergeInput, type AiConciergeOutput } from '@/ai/flows/ai-concierge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client'; // Added useCurrentLocale
import { useRouter } from 'next/navigation'; // Added useRouter

export default function AiConciergePage() {
  const { appContext } = useAppContext();
  const { toast } = useToast();
  const t = useScopedI18n('aiConciergePage'); // Assuming scope for this page
  const router = useRouter(); // For redirection
  const currentLocale = useCurrentLocale(); // For locale-aware redirection

  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [stayDuration, setStayDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AiConciergeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appContext.status === 'authenticated' || appContext.status === 'guest') {
      const res = appContext.activeReservation;
      if (res) {
        setLocation(res.branchName);
        const startDate = new Date(res.startDate);
        const endDate = new Date(res.endDate);
        const durationMs = endDate.getTime() - startDate.getTime();
        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
        setStayDuration(t('durationDays', { count: durationDays }));
      }
    }
  }, [appContext.status, appContext.activeReservation, t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const input: AiConciergeInput = { interests, location, stayDuration };

    try {
      const result = await aiConciergeForStayUsers(input);
      setRecommendations(result);
      toast({ title: t('toast.recommendationsReadyTitle'), description: t('toast.recommendationsReadyDescription') });
    } catch (err) {
      console.error("AI Concierge Error:", err);
      const errorMessage = err instanceof Error ? err.message : t('error.unexpectedError');
      setError(t('error.failedToGetRecommendations', { error: errorMessage }));
      toast({
        title: t('toast.errorTitle'),
        description: t('toast.errorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (appContext.status === 'loading') {
     return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (appContext.status !== 'guest' && (appContext.status !== 'authenticated' || appContext.activeReservation?.type !== 'Stay')) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>{t('notAvailable.title')}</CardTitle>
          <CardDescription className="mt-2">{t('notAvailable.descriptionStayOnly')}</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-primary" />
            {t('pageTitle')}
          </CardTitle>
          <CardDescription>{t('pageSubtitle', { location: location || t('currentLocationFallback') })}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="interests">{t('form.interestsLabel')}</Label>
              <Textarea
                id="interests"
                placeholder={t('form.interestsPlaceholder')}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={3}
                required
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">{t('form.locationLabel')}</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('form.locationPlaceholder')}
                  required
                  disabled={isLoading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="stayDuration">{t('form.stayDurationLabel')}</Label>
                <Input
                  id="stayDuration"
                  value={stayDuration}
                  onChange={(e) => setStayDuration(e.target.value)}
                  placeholder={t('form.stayDurationPlaceholder')}
                  required
                  disabled={isLoading}
                  className="mt-1"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('form.generatingButton')}</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> {t('form.getRecommendationsButton')}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>{t('error.alertTitle')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('recommendations.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendations.restaurants && recommendations.restaurants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Utensils className="mr-2 h-5 w-5 text-accent" /> {t('recommendations.restaurantsTitle')}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {recommendations.restaurants.map((item, index) => <li key={`rest-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
            {recommendations.attractions && recommendations.attractions.length > 0 && (
              <div>
                 <Separator className="my-4" />
                <h3 className="text-lg font-semibold mb-2 flex items-center"><MapPin className="mr-2 h-5 w-5 text-accent" /> {t('recommendations.attractionsTitle')}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {recommendations.attractions.map((item, index) => <li key={`attr-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
            {recommendations.services && recommendations.services.length > 0 && (
              <div>
                <Separator className="my-4" />
                <h3 className="text-lg font-semibold mb-2 flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-accent" /> {t('recommendations.servicesTitle')}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {recommendations.services.map((item, index) => <li key={`serv-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
            {(recommendations.restaurants?.length === 0 && recommendations.attractions?.length === 0 && recommendations.services?.length === 0) && (
                <p className="text-muted-foreground">{t('recommendations.noResults')}</p>
            )}
          </CardContent>
           <CardFooter>
                <p className="text-xs text-muted-foreground">{t('recommendations.disclaimer')}</p>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}
