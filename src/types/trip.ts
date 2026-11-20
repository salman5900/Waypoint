/**
 * Waypoint API Contract & Frontend TypeScript Definitions
 * Synchronized with API_CONTRACT.md
 */

// Global Response Envelopes
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[] | string> | null;
  };
}

// User & Authentication
export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: UserProfile;
  isNewUser?: boolean;
}

// Flight & Stay Options
export interface FlightOption {
  airline: string;
  route: string;
  estimatedPrice: number;
  duration: string;
  stops: string;
  bookingSearchUrl: string;
  tip: string;
}

export interface HotelRecommendation {
  name: string;
  neighborhood: string;
  pricePerNight: number;
  rating: string;
  whyItFits: string;
  bookingSearchUrl: string;
}

// Activities & Dining with Landmark/Food Photography
export interface ActivityItem {
  time: string;
  title: string;
  category: 'sightseeing' | 'transit' | 'experience' | 'shopping' | string;
  description: string;
  estimatedCost: number;
  mapOrBookingUrl: string;
  imageUrl: string;
}

export interface RestaurantPick {
  name: string;
  cuisine: string;
  priceRange: string;
  signatureDish: string;
  mapUrl: string;
  imageUrl: string;
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: ActivityItem[];
  restaurantPicks: RestaurantPick[];
}

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  foodAndDining: number;
  activitiesAndLocalTransit: number;
  totalEstimated: number;
  currency: string;
}

// Core Generated Itinerary
export interface TripItinerary {
  tripTitle: string;
  summary: string;
  heroImages: string[];
  budgetBreakdown: BudgetBreakdown;
  flightOptions: FlightOption[];
  hotelRecommendations: HotelRecommendation[];
  days: DayPlan[];
}

// Trip History Summaries
export interface TripPlanSummary {
  id: number;
  tripTitle: string;
  origin: string;
  destination: string;
  days: number;
  members: number;
  budget: string | null;
  currency: string;
  travelStyle: string;
  createdAt: string;
}

export interface TripPlanDetail extends TripPlanSummary {
  travel_style: string;
  extraNotes: string;
  extra_notes: string;
  itinerary: TripItinerary;
  created_at: string;
}

// Trip Generation Request Payload
export interface TripGenerateInput {
  origin: string;
  destination: string;
  days: number;
  members?: number;
  budget?: number | null;
  currency?: string;
  travelStyle?: string;
  travel_style?: string;
  extraNotes?: string;
  extra_notes?: string;
}
