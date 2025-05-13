
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { Eye, EyeOff, LogIn, Ticket, Phone, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { useCurrentLocale } from '@/lib/i18n/client'; // Import useCurrentLocale

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { loginAsUser, loginAsStayGuest } = useAppContext();
  const currentLocale = useCurrentLocale(); // Get current locale

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [reservationNumber, setReservationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);


  const handleAccountLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'alice@example.com' && password === 'password') {
      loginAsUser('live'); // AppContext handles navigation
      toast({ title: "Login Successful", description: "Welcome back, Alice!" });
    } else if (email === 'bob@example.com' && password === 'password') {
      loginAsUser('multi'); // AppContext handles navigation
      toast({ title: "Login Successful", description: "Welcome back, Bob!" });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
       setIsLoading(false);
    }
    // setIsLoading(false); // Moved inside else for failed login, success handles navigation
  };

  const handleStayGuestLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (loginAsStayGuest(reservationNumber, phoneNumber)) { // AppContext handles navigation
        toast({ title: "Reservation Found", description: "Welcome! Accessing your stay details." });
    } else {
      toast({
        title: "Reservation Not Found",
        description: "Invalid reservation number or phone. Please check and try again.",
        variant: "destructive",
      });
      setIsLoading(false); 
    }
     // setIsLoading(false); // Moved inside else for failed login
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <AppLogo className="w-32 h-auto mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Welcome to M</CardTitle>
          <CardDescription>Sign in to manage your living and stay experiences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account Login</TabsTrigger>
              <TabsTrigger value="guest">Stay Guest</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <form onSubmit={handleAccountLogin} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : <> <LogIn className="mr-2 h-4 w-4" /> Login with Account </>}
                </Button>
                <div className="text-sm text-center">
                  <Link href={`/${currentLocale}/forgot-password`} legacyBehavior>
                    <a className="font-medium text-primary hover:underline">Forgot password?</a>
                  </Link>
                </div>
              </form>
              <Separator className="my-6" />
              <div className="space-y-3">
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                  Sign in with Google
                </Button>
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM11.995 18.668C8.967 18.668 6.501 16.331 6.501 13.453C6.501 10.575 8.958 8.238 11.995 8.238C13.43 8.238 14.727 8.795 15.695 9.705L14.321 10.999C13.722 10.442 12.92 10.114 11.995 10.114C10.014 10.114 8.377 11.639 8.377 13.453C8.377 15.267 10.014 16.792 11.995 16.792C13.089 16.792 13.911 16.374 14.49 15.737L15.893 16.97C14.904 17.998 13.578 18.668 11.995 18.668ZM18.022 14.286C18.022 14.33 18.022 14.374 18.022 14.408C18.022 15.728 17.054 16.687 15.824 16.687C15.669 16.687 15.524 16.677 15.379 16.648L15.805 15.069C15.814 15.078 15.814 15.078 15.824 15.078C16.297 15.078 16.567 14.79 16.567 14.364V11.639H18.022V14.286Z" fill="#000000"></path></svg>
                  Sign in with Apple
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="guest">
              <form onSubmit={handleStayGuestLogin} className="space-y-6 mt-4">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">For Stay guests without an account.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reservationNumber">Reservation Number</Label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reservationNumber"
                      type="text"
                      placeholder="e.g., GUEST007"
                      value={reservationNumber}
                      onChange={(e) => setReservationNumber(e.target.value)}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="e.g., 111-2222"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                   <p className="text-xs text-muted-foreground pt-1">Used to verify your booking. <Link href={`/${currentLocale}/find-reservation`} legacyBehavior><a className="text-primary hover:underline">Help finding reservation?</a></Link></p>
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                 {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : <> <LogIn className="mr-2 h-4 w-4" />  Access Your Stay </>}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            New to M?{' '}
            <Link href={`/${currentLocale}/register`} legacyBehavior>
              <a className="font-medium text-primary hover:underline">Create an account</a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

