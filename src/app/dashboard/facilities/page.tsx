"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, CalendarPlus, Dumbbell, Waves, Coffee, Users2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
// Import locale-specific date-fns if needed, or rely on currentLocale for formatting
// import { enUS, ko, zhCN } from 'date-fns/locale'; 
import Image from 'next/image';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';
import { Label } from '@/components/ui/label';


interface Facility {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  imageHint: string; 
  availableSlots?: string[]; 
}

// Mock data for facilities - names and descriptions ideally come from a translatable source
const mockFacilities: Facility[] = [
  { id: 'gym', name: 'Fitness Center', description: 'State-of-the-art gym equipment.', icon: Dumbbell, imageHint: "gym fitness", availableSlots: ["07:00-08:00", "09:00-10:00", "17:00-18:00"] },
  { id: 'pool', name: 'Swimming Pool', description: 'Indoor heated swimming pool.', icon: Waves, imageHint: "swimming pool", availableSlots: ["10:00-11:00", "14:00-15:00"] },
  { id: 'lounge', name: 'Resident Lounge', description: 'Comfortable lounge with Wi-Fi and coffee.', icon: Coffee, imageHint: "lounge area" },
  { id: 'meeting', name: 'Meeting Room', description: 'Bookable meeting room for residents.', icon: Users2, imageHint: "meeting room", availableSlots: ["09:00-11:00", "14:00-16:00"] },
];

export default function FacilitiesPage() {
  const { appContext } = useAppContext();
  const t = useScopedI18n('facilitiesPage');
  const currentLocale = useCurrentLocale(); // For date formatting

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (appContext.status !== 'authenticated' || appContext.activeReservation?.type !== 'LongStay') {
     return (
       <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
           <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>{t('accessDenied')}</CardTitle>
          <CardDescription className="mt-2">{t('facilityBookingForLongStay')}</CardDescription>
        </Card>
      </div>
    );
  }
  
  const { activeReservation } = appContext;

  const handleBookFacility = () => {
    if (selectedFacility && selectedDate && (selectedFacility.availableSlots ? selectedSlot : true)) {
      // Use currentLocale for formatting date in alert for consistency
      const formattedDate = format(selectedDate, "PPP", { locale: getDateFnsLocale(currentLocale) });
      alert(t('bookingConfirmationMessage', { facilityName: selectedFacility.name, date: formattedDate, timeSlot: selectedSlot ? ` at ${selectedSlot}` : '' }));
      setSelectedFacility(null);
      setSelectedSlot(null);
    } else {
      alert(t('bookingSelectionError'));
    }
  };
  
  // Helper to get date-fns locale object (simplified)
  const getDateFnsLocale = (localeString: string) => {
    // This is a placeholder. For a real app, you'd map locales to date-fns locale objects
    // e.g., if (localeString === 'ko') return require('date-fns/locale/ko');
    return undefined; // Uses default if specific locale not found or mapped
  };


  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl flex items-center">
            <Building2 className="mr-3 h-8 w-8 text-primary" />
            {t('facilityBooking')}
        </CardTitle>
        <CardDescription>
            {t('reserveAmenities', { branchName: activeReservation.branchName })}
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockFacilities.map((facility) => (
          <Card 
            key={facility.id} 
            className={`overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer 
                        ${selectedFacility?.id === facility.id ? 'ring-2 ring-primary border-primary' : ''}`}
            onClick={() => {setSelectedFacility(facility); setSelectedSlot(null);}}
          >
            <div className="relative h-40 w-full">
                <Image 
                    src={`https://picsum.photos/seed/${facility.id}/400/200`} 
                    alt={facility.name} // Facility names could be translated if they were keys
                    layout="fill" 
                    objectFit="cover"
                    data-ai-hint={facility.imageHint}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <facility.icon className="h-12 w-12 text-white opacity-80" />
                </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{facility.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{facility.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedFacility && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('bookFacilityTitle', { facilityName: selectedFacility.name})}</CardTitle>
            <CardDescription>{t('selectDateAndTime')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <Label className="font-medium block mb-1.5">{t('selectDate')}</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                        >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: getDateFnsLocale(currentLocale) }) : <span>{t('pickADate')}</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        locale={getDateFnsLocale(currentLocale)} // Pass locale to Calendar
                        />
                    </PopoverContent>
                </Popover>
            </div>
            
            {selectedFacility.availableSlots && selectedFacility.availableSlots.length > 0 && (
              <div>
                <Label className="font-medium block mb-1.5">{t('selectTimeSlot')}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedFacility.availableSlots.map(slot => (
                    <Button 
                      key={slot} 
                      variant={selectedSlot === slot ? "default" : "outline"}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full sm:w-auto" 
              onClick={handleBookFacility}
              disabled={!selectedDate || (!!selectedFacility.availableSlots && !selectedSlot)}
            >
              {t('confirmBookingFor', { facilityName: selectedFacility.name })}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
