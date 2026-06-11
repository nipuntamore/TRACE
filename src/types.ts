/**
 * Types and interfaces for the TRACE Gamified Sustainability app.
 */

export interface QuizProfile {
  commuteMode: 'alone' | 'carpool' | 'transit' | 'active';
  dietType: 'heavy_meat' | 'balanced' | 'poultry_fish' | 'veg_vegan';
  homeEnergy: 'grid' | 'partial' | 'solar';
  flyFrequency: 'frequent' | 'occasional' | 'rare' | 'never';
  wasteHabit: 'none' | 'basic' | 'active';
}

export interface CarbonLog {
  id: string;
  date: string; // YYYY-MM-DD
  commuteKm: number;
  meatMeals: number; // 0 to 3
  energyRating: number; // appliance hours or simple index slider 0-10
  wasteRecycled: boolean;
  co2Total: number; // Computed kg CO2
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'food' | 'energy' | 'waste';
  effort: 'low' | 'medium' | 'high';
  impact: number; // 1 to 5 scale
  co2Saved: number; // kg saved
  completed: boolean;
  active: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'log' | 'challenge' | 'social' | 'overall';
  icon: string; // lucide icon name
  unlocked: boolean;
  requirementDesc: string;
  unlockedAt?: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  streak: number;
  totalSavedCo2: number; // kg CO2
  isCurrentUser?: boolean;
}

export interface CommunityEvent {
  id: string;
  user: string;
  action: string;
  co2Saved: number; // kg
  timeString: string;
}

export interface EcoCoachMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
