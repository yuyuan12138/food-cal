import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LogEntry, Food, UserProfile, DailySummary, MealType, getTodayDate, generateId } from '@/types';

interface DailyLogState {
  // User profile and goals
  profile: UserProfile;

  // Log entries
  entries: LogEntry[];

  // UI state
  selectedDate: string;
  selectedMeal: MealType;

  // Actions
  addEntry: (food: Food, meal: MealType, servings: number, date?: string) => void;
  updateEntry: (id: string, updates: Partial<LogEntry>) => void;
  deleteEntry: (id: string) => void;
  setEntries: (entries: LogEntry[]) => void;

  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  setCalorieTarget: (calories: number) => void;

  // UI actions
  setSelectedDate: (date: string) => void;
  setSelectedMeal: (meal: MealType) => void;

  // Computed values
  getDailySummary: (date?: string) => DailySummary;
  getEntriesForDate: (date: string) => LogEntry[];
  getEntriesForMeal: (date: string, meal: MealType) => LogEntry[];
}

const defaultProfile: UserProfile = {
  activityLevel: 'moderate',
  goals: {
    dailyCalorieTarget: 2000,
    proteinTarget: 150,
    carbsTarget: 200,
    fatTarget: 65,
  },
};

export const useDailyLogStore = create<DailyLogState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: defaultProfile,
      entries: [],
      selectedDate: getTodayDate(),
      selectedMeal: 'breakfast',

      // Add a food entry
      addEntry: (food: Food, meal: MealType, servings: number, date = getTodayDate()) => {
        const newEntry: LogEntry = {
          id: generateId(),
          foodId: food.id,
          foodName: food.name,
          date,
          meal,
          servings,
          servingSize: food.servingSize,
          servingUnit: food.servingUnit,
          calories: Math.round(food.calories * servings),
          protein: Math.round(food.protein * servings * 10) / 10,
          carbs: Math.round(food.carbs * servings * 10) / 10,
          fat: Math.round(food.fat * servings * 10) / 10,
          fiber: Math.round((food.fiber || 0) * servings * 10) / 10,
          timestamp: Date.now(),
        };

        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
      },

      // Update an entry
      updateEntry: (id: string, updates: Partial<LogEntry>) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
      },

      // Delete an entry
      deleteEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      // Set all entries (for bulk operations)
      setEntries: (entries: LogEntry[]) => {
        set({ entries });
      },

      // Update user profile
      updateProfile: (profileUpdates: Partial<UserProfile>) => {
        set((state) => ({
          profile: { ...state.profile, ...profileUpdates },
        }));
      },

      // Set calorie target
      setCalorieTarget: (calories: number) => {
        set((state) => ({
          profile: {
            ...state.profile,
            goals: { ...state.profile.goals, dailyCalorieTarget: calories },
          },
        }));
      },

      // Set selected date
      setSelectedDate: (date: string) => {
        set({ selectedDate: date });
      },

      // Set selected meal
      setSelectedMeal: (meal: MealType) => {
        set({ selectedMeal: meal });
      },

      // Get entries for a specific date
      getEntriesForDate: (date: string) => {
        return get().entries.filter((entry) => entry.date === date);
      },

      // Get entries for a specific meal
      getEntriesForMeal: (date: string, meal: MealType) => {
        return get().entries.filter(
          (entry) => entry.date === date && entry.meal === meal
        );
      },

      // Get daily summary
      getDailySummary: (date = getTodayDate()) => {
        const entries = get().getEntriesForDate(date);

        const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
        const totalProtein = Math.round(entries.reduce((sum, e) => sum + e.protein, 0) * 10) / 10;
        const totalCarbs = Math.round(entries.reduce((sum, e) => sum + e.carbs, 0) * 10) / 10;
        const totalFat = Math.round(entries.reduce((sum, e) => sum + e.fat, 0) * 10) / 10;
        const totalFiber = Math.round(entries.reduce((sum, e) => sum + e.fiber, 0) * 10) / 10;

        return {
          date,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          totalFiber,
          meals: {
            breakfast: entries.filter((e) => e.meal === 'breakfast'),
            lunch: entries.filter((e) => e.meal === 'lunch'),
            dinner: entries.filter((e) => e.meal === 'dinner'),
            snacks: entries.filter((e) => e.meal === 'snack'),
          },
        };
      },
    }),
    {
      name: 'food-calorie-tracker-storage',
      version: 1,
    }
  )
);
