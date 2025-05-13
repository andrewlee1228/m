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
import { Wrench, Send, Paperclip, AlertTriangle, Home, Building, Loader2 } from 'lucide-react'; // Added Loader2
import { useToast } from '@/hooks/use-toast';

const maintenanceCategories = [
  "Plumbing", "Electrical", "Appliance", "HVAC (Heating/Cooling)", 
  "Pest Control", "General Repair", "Cleaning (for LongStay/Stay services)", "Other"
];

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  const { appContext } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]); // For file uploads

  if (appContext.status === 'loading' || appContext.status === 'unauthenticated') {
    return <p className="text-center py-10">Loading...</p>;
  }
  
  const { activeReservation } = appContext;
   if (!activeReservation || (activeReservation.type !== 'Live' && activeReservation.type !== 'LongStay' && activeReservation.type !== 'Stay')) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>Access Denied</CardTitle>
          <CardDescription className="mt-2">This feature is not available for your current service type.</CardDescription>
        </Card>
      </div>
    );
  }

  const userType = activeReservation.type;
  const pageTitle = userType === 'Stay' ? 'Submit a New Service Request' : 'Submit a New Maintenance Request';
  const descriptionPlaceholder = userType === 'Stay' 
    ? "e.g., Need extra towels, room cleaning, or help with TV remote."
    : "e.g., Kitchen sink is clogged, AC is not cooling, light bulb in hallway needs replacement.";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!category || !description) {
      toast({ title: "Missing Information", description: "Please select a category and provide a description.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: "Request Submitted",
      description: "Your request has been received. We'll process it shortly.",
    });
    router.push('/dashboard/maintenance'); // Or a page showing the specific request
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
            Let us know what needs attention in your {' '}
            {activeReservation.unit ? <><Home className="inline h-4 w-4 mr-1"/> {activeReservation.unit}</> 
                                    : <><Building className="inline h-4 w-4 mr-1"/> {activeReservation.branchName}</>}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="category" className="font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceCategories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, '-')}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="font-medium">Description</Label>
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
              <Label htmlFor="photos" className="font-medium">Upload Photos (Optional)</Label>
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
                  {photos.length} file(s) selected: {photos.map(f => f.name).join(', ')}
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              For urgent issues, please contact the front desk or management directly.
            </p>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Submit Request</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
