"use client";

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, CalendarPlus, Dumbbell, Waves, Coffee, Users2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
// Import locale-specific date-fns objects
import { enUS, ko, zhCN } from 'date-fns/locale'; 
import Image from 'next/image';
import { useScopedI18n, useCurrentLocale } from '@/lib/i18n/client';
import { Label } from '@/components/ui/label';


interface Facility {
  id: string;
  nameKey: keyof typeof import('@/locales/en').default.facilitiesPage.facilityNames; // For translation
  descriptionKey: keyof typeof import('@/locales/en').default.facilitiesPage.facilityDescriptions; // For translation
  icon: React.ElementType;
  imageHint: string; 
  availableSlots?: string[]; 
}

// Mock data for facilities - using keys for translation
const mockFacilities: Facility[] = [
  { id: 'gym', nameKey: 'gym', descriptionKey: 'gymDescription', icon: Dumbbell, imageHint: "gym fitness", availableSlots: ["07:00-08:00", "09:00-10:00", "17:00-18:00"] },
  { id: 'pool', nameKey: 'pool', descriptionKey: 'poolDescription', icon: Waves, imageHint: "swimming pool", availableSlots: ["10:00-11:00", "14:00-15:00"] },
  { id: 'lounge', nameKey: 'lounge', descriptionKey: 'loungeDescription', icon: Coffee, imageHint: "lounge area" },
  { id: 'meeting', nameKey: 'meeting', descriptionKey: 'meetingDescription', icon: Users2, imageHint: "meeting room", availableSlots: ["09:00-11:00", "14:00-16:00"] },
];

export default function FacilitiesPage() {
  const { appContext } = useAppContext();
  const t = useScopedI18n('facilitiesPage');
  const currentLocale = useCurrentLocale(); 

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

  const getDateFnsLocale = (localeString: string) => {
    if (localeString === 'ko') return ko;
    if (localeString === 'zh') return zhCN;
    return enUS; 
  };

  const handleBookFacility = () => {
    if (selectedFacility && selectedDate && (selectedFacility.availableSlots ? selectedSlot : true)) {
      const facilityName = t(`facilityNames.${selectedFacility.nameKey}`);
      const formattedDate = format(selectedDate, "PPP", { locale: getDateFnsLocale(currentLocale) });
      alert(t('bookingConfirmationMessage', { facilityName: facilityName, date: formattedDate, timeSlot: selectedSlot ? ` at ${selectedSlot}` : '' }));
      setSelectedFacility(null);
      setSelectedSlot(null);
    } else {
      alert(t('bookingSelectionError'));
    }
  };
  
  const translatedFacilityName = (facility: Facility) => t(`facilityNames.${facility.nameKey}`);
  const translatedFacilityDescription = (facility: Facility) => t(`facilityDescriptions.${facility.descriptionKey}`);


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
                    alt={translatedFacilityName(facility)} 
                    fill // Use fill instead of layout="fill"
                    className="object-cover" // Use objectFit directly as a class
                    data-ai-hint={facility.imageHint}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <facility.icon className="h-12 w-12 text-white opacity-80" />
                </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{translatedFacilityName(facility)}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{translatedFacilityDescription(facility)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedFacility && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('bookFacilityTitle', { facilityName: translatedFacilityName(selectedFacility)})}</CardTitle>
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
                        locale={getDateFnsLocale(currentLocale)} 
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
              {t('confirmBookingFor', { facilityName: translatedFacilityName(selectedFacility) })}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
