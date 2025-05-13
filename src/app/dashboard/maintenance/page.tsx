"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, PlusCircle, ListFilter, AlertTriangle, Home, Building } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MaintenanceRequest } from '@/types';
import { Badge } from '@/components/ui/badge';

const mockMaintenanceRequests: MaintenanceRequest[] = [
  { id: 'req1', category: 'Plumbing', description: 'Leaky faucet in kitchen sink', status: 'In Progress', submittedAt: '2024-07-03T10:00:00Z', unit: 'Apt 101', branchName: 'Downtown Central' },
  { id: 'req2', category: 'Appliance', description: 'Dishwasher not draining properly', status: 'Submitted', submittedAt: '2024-07-05T14:30:00Z', unit: 'Apt 101', branchName: 'Downtown Central' },
  { id: 'req3', category: 'HVAC', description: 'AC unit making loud noise', status: 'Completed', submittedAt: '2024-06-20T09:00:00Z', unit: 'Apt 101', branchName: 'Downtown Central' },
  { id: 'req4', category: 'Electrical', description: 'Outlet in bedroom not working', status: 'Cancelled', submittedAt: '2024-06-15T11:00:00Z', unit: 'Apt 101', branchName: 'Downtown Central' },
];

export default function MaintenanceListPage() {
  const { appContext } = useAppContext();

  if (appContext.status === 'loading' || appContext.status === 'unauthenticated') {
    return <p className="text-center py-10">Loading...</p>;
  }
  
  const { activeReservation } = appContext;
  if (!activeReservation || (activeReservation.type !== 'Live' && activeReservation.type !== 'LongStay' && activeReservation.type !== 'Stay') ) {
     // Stay users may have limited maintenance view, PRD more focused on Live/LongStay
     // Adjust this condition based on specific rules for Stay users' maintenance requests
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>Access Denied</CardTitle>
          <CardDescription className="mt-2">Maintenance requests are typically for residents. Stay guests may use service requests.</CardDescription>
        </Card>
      </div>
    );
  }

  const userType = activeReservation.type;
  const pageTitle = userType === 'Stay' ? 'Service Requests' : 'Maintenance Requests';
  const newRequestButtonText = userType === 'Stay' ? 'New Service Request' : 'New Maintenance Request';

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
      default: return '';
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
                <Link href="/dashboard/maintenance/new">
                <PlusCircle className="mr-2 h-4 w-4" /> {newRequestButtonText}
                </Link>
            </Button>
        </div>
        <CardDescription>
            View and manage your {pageTitle.toLowerCase()} for{' '}
            {activeReservation.unit ? <><Home className="inline h-4 w-4 mr-1"/> {activeReservation.unit}</> 
                                    : <><Building className="inline h-4 w-4 mr-1"/> {activeReservation.branchName}</>}.
        </CardDescription>
      </CardHeader>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Requests</CardTitle>
                <CardDescription>A list of all submitted requests.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" /> Filter by Status
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitted</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMaintenanceRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{new Date(request.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{request.category}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">{request.description}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(request.status)} className={getStatusBadgeClass(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/maintenance/${request.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mockMaintenanceRequests.length === 0 && <p className="text-center text-muted-foreground py-6">You haven't submitted any requests yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
