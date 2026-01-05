// Food item from database
export interface Food {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  fiber?: number;   // grams
  category: FoodCategory;
  tags?: string[];
}

export type FoodCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

// Daily log entry
export interface LogEntry {
  id: string;
  foodId: string;
  foodName: string;
  date: string;      // ISO date string (YYYY-MM-DD)
  meal: MealType;
  servings: number;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  timestamp: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// User goals and profile
export interface UserGoals {
  dailyCalorieTarget: number;
  proteinTarget?: number;  // grams
  carbsTarget?: number;    // grams
  fatTarget?: number;      // grams
}

export interface UserProfile {
  weight?: number;    // kg
  height?: number;    // cm
  age?: number;       // years
  gender?: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  goals: UserGoals;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

// Daily summary
export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  meals: {
    breakfast: LogEntry[];
    lunch: LogEntry[];
    dinner: LogEntry[];
    snacks: LogEntry[];
  };
}

// Search state
export interface SearchState {
  query: string;
  results: Food[];
  recentSearches: string[];
  isSearching: boolean;
}

// BMR/TDEE calculation result
export interface CalorieNeeds {
  bmr: number;        // Basal Metabolic Rate
  tdee: number;       // Total Daily Energy Expenditure
  recommended: number; // Recommended daily intake
  macros?: {
    protein: { grams: number; calories: number };
    carbs: { grams: number; calories: number };
    fat: { grams: number; calories: number };
  };
}

// Re-export utility functions
export { generateId, getTodayDate, formatDate, calculateBMR, calculateTDEE, calculateMacros } from '@/lib/utils';
