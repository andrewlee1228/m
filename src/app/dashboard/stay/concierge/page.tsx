"use client";

import { useState, type FormEvent } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, MapPin, Utensils, ShoppingBag, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiConciergeForStayUsers, type AiConciergeInput, type AiConciergeOutput } from '@/ai/flows/ai-concierge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

export default function AiConciergePage() {
  const { appContext } = useAppContext();
  const { toast } = useToast();

  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [stayDuration, setStayDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AiConciergeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill location and stay duration if possible from context
  useState(() => {
    if (appContext.status === 'authenticated' || appContext.status === 'guest') {
      const res = appContext.activeReservation;
      if (res) {
        setLocation(res.branchName);
        const startDate = new Date(res.startDate);
        const endDate = new Date(res.endDate);
        const durationMs = endDate.getTime() - startDate.getTime();
        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
        setStayDuration(`${durationDays} day${durationDays !== 1 ? 's' : ''}`);
      }
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const input: AiConciergeInput = { interests, location, stayDuration };

    try {
      const result = await aiConciergeForStayUsers(input);
      setRecommendations(result);
      toast({ title: "Recommendations Ready!", description: "Here are some ideas for your stay." });
    } catch (err) {
      console.error("AI Concierge Error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Failed to get recommendations: ${errorMessage}`);
      toast({
        title: "Error",
        description: "Could not fetch recommendations at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (appContext.status !== 'guest' && (appContext.status !== 'authenticated' || appContext.activeReservation?.type !== 'Stay')) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
          <CardTitle>AI Concierge Not Available</CardTitle>
          <CardDescription className="mt-2">This feature is exclusively for Stay guests.</CardDescription>
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
            Axxel AI Concierge
          </CardTitle>
          <CardDescription>Get personalized recommendations for your stay at {location || "your current location"}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="interests">Your Interests & Preferences</Label>
              <Textarea
                id="interests"
                placeholder="e.g., quiet cafes, historical sites, family-friendly activities, italian food"
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
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., City Center Hotel, Downtown"
                  required
                  disabled={isLoading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="stayDuration">Duration of Stay</Label>
                <Input
                  id="stayDuration"
                  value={stayDuration}
                  onChange={(e) => setStayDuration(e.target.value)}
                  placeholder="e.g., 3 days, 1 week"
                  required
                  disabled={isLoading}
                  className="mt-1"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Get Recommendations</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendations.restaurants && recommendations.restaurants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Utensils className="mr-2 h-5 w-5 text-accent" /> Restaurants</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {recommendations.restaurants.map((item, index) => <li key={`rest-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
            {recommendations.attractions && recommendations.attractions.length > 0 && (
              <div>
                 <Separator className="my-4" />
                <h3 className="text-lg font-semibold mb-2 flex items-center"><MapPin className="mr-2 h-5 w-5 text-accent" /> Attractions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {recommendations.attractions.map((item, index) => <li key={`attr-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
            {recommendations.services && recommendations.services.length > 0 && (
              <div>
                <Separator className="my-4" />
                <h3 className="text-lg font-semibold mb-2 flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-accent" /> Services</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {recommendations.services.map((item, index) => <li key={`serv-${index}`}>{item}</li>)}
                </ul>
              </div>
            )}
            {(recommendations.restaurants?.length === 0 && recommendations.attractions?.length === 0 && recommendations.services?.length === 0) && (
                <p className="text-muted-foreground">No specific recommendations found for your criteria. Try broadening your interests!</p>
            )}
          </CardContent>
           <CardFooter>
                <p className="text-xs text-muted-foreground">AI recommendations are for informational purposes. Please verify details independently.</p>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}
