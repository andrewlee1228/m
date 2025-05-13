"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, CreditCard, ListFilter, AlertTriangle, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Payment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

const mockPayments: Payment[] = [
  { id: 'pay1', amount: 1200.00, currency: 'USD', date: '2024-07-01', status: 'Paid', description: 'July Rent' },
  { id: 'pay2', amount: 50.00, currency: 'USD', date: '2024-07-15', status: 'Pending', description: 'Amenity Fee - Gym Access Q3' },
  { id: 'pay3', amount: 1200.00, currency: 'USD', date: '2024-06-01', status: 'Paid', description: 'June Rent' },
  { id: 'pay4', amount: 25.00, currency: 'USD', date: '2024-05-20', status: 'Failed', description: 'Late Fee - May' },
];

export default function RentPaymentPage() {
  const { appContext } = useAppContext();
  const t = useScopedI18n('rentPaymentPage'); // Assuming a scope for this page
  const currentLocale = useCurrentLocale(); 

  if (appContext.status === 'loading') { // Handle loading explicitly
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (appContext.status === 'unauthenticated' || appContext.activeReservation?.type !== 'Live') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>{t('accessDenied.title')}</CardTitle>
          <CardDescription className="mt-2">{t('accessDenied.descriptionLiveOnly')}</CardDescription>
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

  const translateStatus = (status: Payment['status']) => {
    try {
        return t(`status.${status.toLowerCase()}` as any);
    } catch {
        return status; // Fallback
    }
  };
  
  const translateDescription = (description: string) => {
    // This is a placeholder for potentially complex description translation
    // For simple cases, you might have keys like 'rentJuly', 'amenityFee'
    // For now, return as is or use a generic approach if possible.
    // Example: if description keys are 'rentJuly', 'amenityFeeGymQ3'
    try {
      const key = description.replace(/\s+/g, '').replace(/-/g,''); // e.g. "JulyRent", "AmenityFee-GymAccessQ3" -> "AmenityFeeGymAccessQ3"
      return t(`descriptions.${key}` as any);
    } catch {
      return description; // Fallback
    }
  };

  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl flex items-center"><DollarSign className="mr-3 h-8 w-8 text-primary" />{t('pageTitle')}</CardTitle>
        <CardDescription>{t('pageSubtitle', { branchName: activeReservation.branchName, unit: activeReservation.unit })}</CardDescription>
      </CardHeader>

      {pendingPayment && (
        <Card className="border-primary ring-2 ring-primary/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{t('upcomingPayment.title')}</CardTitle>
            <CardDescription>{translateDescription(pendingPayment.description)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-primary">{pendingPayment.currency} {pendingPayment.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{t('upcomingPayment.dueDate', { date: formatDate(pendingPayment.date) })}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <CreditCard className="mr-2 h-4 w-4" /> {t('upcomingPayment.payNowButton')}
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>{t('paymentHistory.title')}</CardTitle>
                <CardDescription>{t('paymentHistory.description')}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" /> {t('paymentHistory.filterButton')}
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('paymentHistory.tableHeaders.date')}</TableHead>
                <TableHead>{t('paymentHistory.tableHeaders.description')}</TableHead>
                <TableHead className="text-right">{t('paymentHistory.tableHeaders.amount')}</TableHead>
                <TableHead className="text-center">{t('paymentHistory.tableHeaders.status')}</TableHead>
                <TableHead className="text-right">{t('paymentHistory.tableHeaders.action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell className="font-medium">{translateDescription(payment.description)}</TableCell>
                  <TableCell className="text-right">{payment.currency} {payment.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(payment.status)} className={getStatusBadgeClass(payment.status)}>
                      {translateStatus(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled={payment.status !== 'Failed'}>
                      {t('paymentHistory.retryAction')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mockPayments.length === 0 && <p className="text-center text-muted-foreground py-4">{t('paymentHistory.noHistoryMessage')}</p>}
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>{t('managePaymentMethods.title')}</CardTitle>
            <CardDescription>{t('managePaymentMethods.description')}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm mb-3">{t('managePaymentMethods.cardsOnFile', { count: 1, lastFour: "**** 1234" })}</p>
            <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" /> {t('managePaymentMethods.addNewButton')}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
