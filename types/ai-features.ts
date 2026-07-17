
/**
 * Type definitions for AI Problem-Solving Engine and Travel Assistant
 */

import { IconSymbolName } from '@/components/IconSymbol';

// Problem Solver Types
export interface Problem {
  id: string;
  title: string;
  description: string;
  detectedFrom: 'email' | 'task' | 'message' | 'calendar';
  timestamp: string;
  status: 'new' | 'analyzing' | 'solved' | 'dismissed';
  blockers: string[];
  deadline?: string;
}

export interface Solution {
  id: string;
  problemId: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  impactScore: number;
  steps: string[];
  estimatedTime: string;
  helpful?: boolean;
}

export interface ProductivityIntegration {
  id: string;
  name: string;
  icon: IconSymbolName;
  connected: boolean;
  color: string;
  apiEndpoint?: string;
  authToken?: string;
}

// Travel Assistant Types
export interface TravelIntent {
  id: string;
  destination: string;
  purpose: string;
  date: string;
  detectedFrom: 'email' | 'calendar' | 'message';
  status: 'pending' | 'searching' | 'booked';
  urgency: 'urgent' | 'normal' | 'flexible';
}

export interface TravelOption {
  id: string;
  type: 'flight' | 'train' | 'hotel' | 'car';
  provider: string;
  name: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  price: number;
  currency: string;
  rating?: number;
  sustainability?: 'high' | 'medium' | 'low';
  distance?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  date: string;
  flights: TravelOption[];
  hotel?: TravelOption;
  transport?: TravelOption;
  totalCost: number;
  travelTime: string;
  bufferTime: string;
  returnDate?: string;
}

export interface TripDashboard {
  flightStatus: string;
  weather: string;
  temperature: string;
  exchangeRate: string;
  localTime: string;
  meetingLocation: string;
}

// AI Analysis Types
export interface AIAnalysisRequest {
  text: string;
  context?: string;
  type: 'problem' | 'travel' | 'task';
}

export interface AIAnalysisResponse {
  success: boolean;
  data?: Problem | TravelIntent;
  suggestions?: Solution[] | TravelOption[];
  error?: string;
}

// User Preferences
export interface UserPreferences {
  travelPreferences: {
    preferredAirlines: string[];
    preferredHotels: string[];
    seatPreference: 'window' | 'aisle' | 'any';
    mealPreference: string;
    sustainabilityPriority: 'high' | 'medium' | 'low';
  };
  problemSolvingPreferences: {
    autonomyLevel: 'suggest-only' | 'semi-autonomous' | 'fully-autonomous';
    preferredTools: string[];
    notificationFrequency: 'immediate' | 'hourly' | 'daily';
  };
}
