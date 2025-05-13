"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, CreditCard, ListFilter, AlertTriangle } from 'lucide-react'; // Removed CalendarDays
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Payment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useCurrentLocale } from '@/lib/i18n/client'; // Import useCurrentLocale

const mockPayments: Payment[] = [
  { id: 'pay1', amount: 1200.00, currency: 'USD', date: '2024-07-01', status: 'Paid', description: 'July Rent' },
  { id: 'pay2', amount: 50.00, currency: 'USD', date: '2024-07-15', status: 'Pending', description: 'Amenity Fee - Gym Access Q3' },
  { id: 'pay3', amount: 1200.00, currency: 'USD', date: '2024-06-01', status: 'Paid', description: 'June Rent' },
  { id: 'pay4', amount: 25.00, currency: 'USD', date: '2024-05-20', status: 'Failed', description: 'Late Fee - May' },
];

export default function RentPaymentPage() {
  const { appContext } = useAppContext();
  const currentLocale = useCurrentLocale(); // Get current locale

  if (appContext.status !== 'authenticated' || appContext.activeReservation?.type !== 'Live') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>Access Denied</CardTitle>
          <CardDescription className="mt-2">Rent payment is available for Live residents only.</CardDescription>
        </Card>
      </div>
    );
  }

  const { activeReservation } = appContext;
  const pendingPayment = mockPayments.find(p => p.status === 'Pending');

  const getStatusBadgeVariant = (status: Payment['status']) => {
    switch (status) {
      case 'Paid': return 'default'; 
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusBadgeClass = (status: Payment['status']) => {
    switch (status) {
      case 'Paid': return 'bg-green-500 text-white hover:bg-green-600';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale);
  };

  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl flex items-center"><DollarSign className="mr-3 h-8 w-8 text-primary" />Rent & Payments</CardTitle>
        <CardDescription>Manage your rent payments and view transaction history for {activeReservation.branchName} ({activeReservation.unit}).</CardDescription>
      </CardHeader>

      {pendingPayment && (
        <Card className="border-primary ring-2 ring-primary/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Upcoming Payment Due</CardTitle>
            <CardDescription>{pendingPayment.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-primary">{pendingPayment.currency} {pendingPayment.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Due Date: {formatDate(pendingPayment.date)}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <CreditCard className="mr-2 h-4 w-4" /> Pay Now
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Review all your past transactions.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" /> Filter
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell className="font-medium">{payment.description}</TableCell>
                  <TableCell className="text-right">{payment.currency} {payment.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(payment.status)} className={getStatusBadgeClass(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled={payment.status !== 'Failed'}>
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mockPayments.length === 0 && <p className="text-center text-muted-foreground py-4">No payment history found.</p>}
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>Manage Payment Methods</CardTitle>
            <CardDescription>Add or update your preferred payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm mb-3">You have 1 card on file ending in **** 1234.</p>
            <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" /> Add New Payment Method
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
