import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get today's date as YYYY-MM-DD
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === getTodayDate()) {
    return 'Today';
  } else if (dateStr === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

// Calculate BMR using Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number,  // kg
  height: number,  // cm
  age: number,     // years
  gender: 'male' | 'female' | 'other'
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Calculate TDEE based on activity level
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9,
  };

  return bmr * (multipliers[activityLevel] || 1.2);
}

// Calculate macro distribution (40% carbs, 30% protein, 30% fat)
export function calculateMacros(calories: number) {
  return {
    protein: {
      grams: Math.round((calories * 0.30) / 4),
      calories: Math.round(calories * 0.30),
    },
    carbs: {
      grams: Math.round((calories * 0.40) / 4),
      calories: Math.round(calories * 0.40),
    },
    fat: {
      grams: Math.round((calories * 0.30) / 9),
      calories: Math.round(calories * 0.30),
    },
  };
}

// Parse search query for advanced filtering
export function parseSearchQuery(query: string): { terms: string[]; filters: Record<string, string> } {
  const terms: string[] = [];
  const filters: Record<string, string> = {};

  const words = query.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (word.includes(':')) {
      const [key, value] = word.split(':');
      filters[key] = value;
    } else if (word.length > 0) {
      terms.push(word);
    }
  }

  return { terms, filters };
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
