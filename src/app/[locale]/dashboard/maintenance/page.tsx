"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, PlusCircle, ListFilter, AlertTriangle, Home, Building, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MaintenanceRequest } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';

const mockMaintenanceRequests: MaintenanceRequest[] = [
  { id: 'req1', category: 'Plumbing', description: 'Leaky faucet in kitchen sink', status: 'In Progress', submittedAt: '2024-07-03T10:00:00Z', unit: 'Apt 101', branchName: 'Downtown Central' },
  { id: 'req2', category: 'Appliance', description: 'Dishwasher not draining properly', status: 'Submitted', submittedAt: '2024-07-05T14:30:00Z', unit: 'Apt 101', branchName: 'Downtown Central' },
  { id: 'req3', category: 'HVAC', description: 'AC unit making loud noise', status: 'Completed', submittedAt: '2024-06-20T09:00:00Z', unit: 'Apt 101', branchName: 'Downtown Central' },
  { id: 'req4', category: 'Electrical', description: 'Outlet in bedroom not working', status: 'Cancelled', submittedAt: '2024-06-15T11:00:00Z', unit: 'Apt 101', branchName: 'Downtown Central' },
];

export default function MaintenanceListPage() {
  const { appContext } = useAppContext();
  const t = useScopedI18n('maintenanceListPage'); // Assuming a scope for this page
  const commonT = useScopedI18n('common');
  const currentLocale = useCurrentLocale();


  if (appContext.status === 'loading') { // Handle loading explicitly
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (appContext.status === 'unauthenticated') {
    // This should ideally be handled by the layout, but as a fallback
    // router.replace(`/${currentLocale}/login`); // useRouter cannot be called at top level here
    if (typeof window !== 'undefined') window.location.href = `/${currentLocale}/login`;
    return null;
  }
  
  const { activeReservation } = appContext;
  if (!activeReservation || (activeReservation.type !== 'Live' && activeReservation.type !== 'LongStay' && activeReservation.type !== 'Stay') ) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>{t('accessDenied.title')}</CardTitle>
          <CardDescription className="mt-2">{t('accessDenied.descriptionForResidents')}</CardDescription>
        </Card>
      </div>
    );
  }

  const userType = activeReservation.type;
  const pageTitle = userType === 'Stay' ? t('pageTitleService') : t('pageTitleMaintenance');
  const newRequestButtonText = userType === 'Stay' ? t('newRequestButtonService') : t('newRequestButtonMaintenance');

  const getStatusBadgeVariant = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'Completed': return 'default'; 
      case 'In Progress': return 'secondary';
      case 'Submitted': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusBadgeClass = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-500 text-white hover:bg-green-600';
      // Add other custom classes if needed
      default: return '';
    }
  };
  
  const translateStatus = (status: MaintenanceRequest['status']) => {
    try {
      return t(`status.${status.toLowerCase().replace(/\s+/g, '')}` as any);
    } catch {
      return status; // Fallback
    }
  };
  
  const translateCategory = (category: string) => {
     try {
      // Assuming categories are like "Plumbing", "HVAC" in mock data
      // and translation keys are "plumbing", "hvac"
      return t(`categories.${category.toLowerCase().replace(/\s+/g, '-')}` as any);
    } catch {
      return category; // Fallback
    }
  };


  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <div className="flex justify-between items-center">
            <CardTitle className="text-3xl flex items-center">
                <Wrench className="mr-3 h-8 w-8 text-primary" />
                {pageTitle}
            </CardTitle>
            <Button asChild>
                <Link href={`/${currentLocale}/dashboard/maintenance/new`}>
                <PlusCircle className="mr-2 h-4 w-4" /> {newRequestButtonText}
                </Link>
            </Button>
        </div>
        <CardDescription>
            {t('pageSubtitle', { title: pageTitle.toLowerCase(), location: activeReservation.unit ? `${commonT('unit')} ${activeReservation.unit}` : activeReservation.branchName })}
        </CardDescription>
      </CardHeader>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>{t('yourRequestsTitle')}</CardTitle>
                <CardDescription>{t('yourRequestsDescription')}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" /> {t('filterButton')}
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tableHeaders.submitted')}</TableHead>
                <TableHead>{t('tableHeaders.category')}</TableHead>
                <TableHead>{t('tableHeaders.description')}</TableHead>
                <TableHead className="text-center">{t('tableHeaders.status')}</TableHead>
                <TableHead className="text-right">{t('tableHeaders.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMaintenanceRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{new Date(request.submittedAt).toLocaleDateString(currentLocale)}</TableCell>
                  <TableCell>{translateCategory(request.category)}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">{request.description}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(request.status)} className={getStatusBadgeClass(request.status)}>
                      {translateStatus(request.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                        {/* Ensure this link is also locale-aware if it leads to a dynamic page */}
                        <Link href={`/${currentLocale}/dashboard/maintenance/${request.id}`}>{t('viewAction')}</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mockMaintenanceRequests.length === 0 && <p className="text-center text-muted-foreground py-6">{t('noRequestsMessage')}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
