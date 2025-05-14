export type UserType = "Live" | "Stay" | "LongStay";
export type GuestUserType = "StayGuest"; // For non-account Stay users
export type AppUserType = UserType | GuestUserType;

export interface Reservation {
  id: string;
  branchName: string;
  type: UserType; // The type of service this reservation is for
  reservationNumber?: string; // For Stay/LongStay and StayGuest
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  unit?: string; // e.g. "Apartment 301", "Room 102"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthenticatedUser extends UserProfile {
  activeReservations: Reservation[];
  // preferences, etc.
}

export interface StayGuestData {
  reservationNumber: string;
  phone: string;
  reservation: Reservation; // Details of the single reservation
}

export type CurrentAppContext = 
  | { status: 'authenticated'; user: AuthenticatedUser; activeReservation: Reservation | null }
  | { status: 'guest'; guestData: StayGuestData; activeReservation: Reservation }
  | { status: 'unauthenticated' }
  | { status: 'loading' };

export interface MaintenanceRequest {
  id: string;
  category: string;
  description: string;
  status: "Submitted" | "In Progress" | "Completed" | "Cancelled";
  submittedAt: string; // ISO Date string
  photos?: string[]; // URLs of photos
  unit?: string;
  branchName: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO Date string
  location: string;
  branchName: string;
  rsvp?: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  date: string; // ISO Date string
  status: "Paid" | "Pending" | "Failed";
  description: string;
}
