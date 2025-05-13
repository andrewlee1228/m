"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, QrCode, Link2, Smile, Meh, Frown, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function CheckInOutPage() {
  const { appContext } = useAppContext();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(null); // e.g. 1-5 or smiley based
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (appContext.status !== 'guest' && (appContext.status !== 'authenticated' || appContext.activeReservation?.type !== 'Stay')) {
     return (
       <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>Feature Not Applicable</CardTitle>
          <CardDescription className="mt-2">Check-in and Check-out processes are for Stay guests.</CardDescription>
        </Card>
      </div>
    );
  }

  const { activeReservation } = appContext;
  const now = new Date();
  const checkinDate = new Date(activeReservation.startDate);
  const checkoutDate = new Date(activeReservation.endDate);

  const canCheckIn = now >= checkinDate && now < checkoutDate; // Simplified logic
  const canCheckOut = now >= checkinDate; // Can checkout anytime after checkin, ideally close to endDate

  const handleCheckIn = () => {
    toast({ title: "Check-In Initiated", description: "Follow QR code or link instructions." });
    // Logic for QR scan or opening a link would go here
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCheckingOut(false);
    toast({ title: "Check-Out Successful", description: "Thank you for staying with us! Your feedback is appreciated." });
    // Potentially redirect or update UI state
  };
  
  const SmileyButton = ({ Icon, value, currentRating, onClick }: {Icon: React.ElementType, value: number, currentRating: number | null, onClick: (value: number) => void}) => (
    <Button 
        variant={currentRating === value ? "default" : "outline"} 
        size="icon" 
        className={`rounded-full h-12 w-12 ${currentRating === value ? (value <=2 ? 'bg-destructive' : value === 3 ? 'bg-yellow-500' : 'bg-green-500') : ''}`}
        onClick={() => onClick(value)}
    >
        <Icon className="h-6 w-6" />
    </Button>
  );


  return (
    <div className="max-w-lg mx-auto space-y-8">
      <Card className="shadow-lg">
         <div className="relative h-40 w-full">
             <Image 
                src={`https://picsum.photos/seed/checkin_${activeReservation.branchName.replace(/\s+/g, '')}/600/200`} 
                alt="Hotel lobby or welcome area" 
                layout="fill" 
                objectFit="cover"
                data-ai-hint="hotel lobby"
            />
         </div>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Check-In / Check-Out</CardTitle>
          <CardDescription>Manage your arrival and departure for {activeReservation.branchName}.</CardDescription>
        </CardHeader>
      </Card>

      {/* Check-In Section */}
      {canCheckIn && !canCheckOut /* Crude logic to hide check-in if checkout is possible or past */ && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><LogIn className="mr-2 h-5 w-5 text-primary" /> Check-In</CardTitle>
            <CardDescription>Your check-in time is from {checkinDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {checkinDate.toLocaleDateString()}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Ready to check in? You can use the QR code provided at the reception or a check-in link sent to your email/SMS.</p>
            <div className="flex space-x-4">
              <Button className="flex-1" onClick={handleCheckIn}><QrCode className="mr-2 h-4 w-4" /> Scan QR Code</Button>
              <Button variant="outline" className="flex-1" onClick={handleCheckIn}><Link2 className="mr-2 h-4 w-4" /> Use Check-In Link</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check-Out Section */}
      {canCheckOut && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><LogOut className="mr-2 h-5 w-5 text-destructive" /> Check-Out</CardTitle>
            <CardDescription>Standard check-out time is {new Date(checkoutDate.setHours(11,0,0,0)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {checkoutDate.toLocaleDateString()}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="feedback" className="font-medium">Share Your Feedback (Optional)</Label>
              <p className="text-xs text-muted-foreground mb-2">How was your stay?</p>
              <div className="flex justify-around mb-3">
                <SmileyButton Icon={Frown} value={1} currentRating={rating} onClick={setRating} />
                <SmileyButton Icon={Frown} value={2} currentRating={rating} onClick={setRating} /> {/* Using Frown for 2 for simplicity */}
                <SmileyButton Icon={Meh} value={3} currentRating={rating} onClick={setRating} />
                <SmileyButton Icon={Smile} value={4} currentRating={rating} onClick={setRating} />
                <SmileyButton Icon={Smile} value={5} currentRating={rating} onClick={setRating} /> {/* Using Smile for 5 for simplicity */}
              </div>
              <Textarea
                id="feedback"
                placeholder="Tell us about your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCheckout} className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground" disabled={isCheckingOut}>
              {isCheckingOut ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Check-Out...</> : "Complete Check-Out"}
            </Button>
          </CardFooter>
        </Card>
      )}
       {!canCheckIn && !canCheckOut && now < checkinDate && (
         <Card>
            <CardHeader>
                <CardTitle>Your Stay is Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Check-in begins on {checkinDate.toLocaleDateString()} at {checkinDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</p>
                <p className="mt-2 text-sm text-muted-foreground">We look forward to welcoming you!</p>
            </CardContent>
         </Card>
       )}
       {now > checkoutDate && (
         <Card>
            <CardHeader>
                <CardTitle>Your Stay Has Ended</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Thank you for staying at {activeReservation.branchName}. We hope you had a pleasant time.</p>
                <Button variant="link" asChild className="mt-2 px-0"><Link href="/new-booking">Book another stay?</Link></Button>
            </CardContent>
         </Card>
       )}
    </div>
  );
}
