"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useCurrentLocale } from '@/lib/i18n/client'; // Import useCurrentLocale

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const currentLocale = useCurrentLocale(); // Get current locale
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [branch, setBranch] = useState('');
  const [userType, setUserType] = useState('Live'); // Default to Live
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (!agreedToTerms) {
      toast({ title: "Error", description: "You must agree to the terms and conditions.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // On successful registration (mocked)
    toast({
      title: "Registration Successful",
      description: "Your account has been created. Please log in.",
    });
    router.push(`/${currentLocale}/login`);
  };

  // Mock branches data
  const branches = [
    { id: 'branch1', name: '숭인' },
    { id: 'branch2', name: '신설' },
    { id: 'branch3', name: '동대문' },
    { id: 'branch4', name: '신촌' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4 sm:p-6">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <AppLogo className="w-32 h-auto mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Create Your Axxel Account</CardTitle>
          <CardDescription>Join Axxel to manage your Live residency.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="branch">Select Branch</Label>
                <Select value={branch} onValueChange={setBranch} required disabled={isLoading}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Choose your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="userType">User Type</Label>
                <Select value={userType} onValueChange={setUserType} required disabled={isLoading}>
                  <SelectTrigger id="userType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Live">Live (Long-term Resident)</SelectItem>
                    {/* Add other types if direct registration is allowed */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))} disabled={isLoading} />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the{' '}
                <Link href={`/${currentLocale}/terms`} legacyBehavior><a className="text-primary hover:underline">Terms and Conditions</a></Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-6" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : <><UserPlus className="mr-2 h-4 w-4" /> Create Account</>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href={`/${currentLocale}/login`} legacyBehavior>
              <a className="font-medium text-primary hover:underline">Log in</a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
