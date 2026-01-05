import { useState, useEffect } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { useDailyLogStore } from '@/store/dailyLogStore';
import { SearchBar } from '@/components/SearchBar';
import { FoodModal } from '@/components/FoodModal';
import { FoodGrid } from '@/components/FoodCard';
import { Food, MealType, getTodayDate } from '@/types';
import { foods } from '@/data/foods';

export function HomePage() {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAddedFood, setLastAddedFood] = useState<string>('');

  const { addEntry } = useDailyLogStore();

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setIsFoodModalOpen(true);
  };

  const handleAddRecent = (query: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  const handleAddFood = (food: Food, meal: MealType, servings: number) => {
    // Add food to the log for today's date
    addEntry(food, meal, servings, getTodayDate());
    setLastAddedFood(food.name);
    setShowSuccess(true);
    setIsFoodModalOpen(false);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Clear success message when changing views
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  // Show popular foods on initial load
  const popularFoods = foods.filter((f) =>
    f.tags?.includes('snack') || f.tags?.includes('breakfast')
  ).slice(0, 9);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
          <div className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              Added <strong>{lastAddedFood}</strong> to your log!
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Food Calorie Lookup
            </h1>
            <p className="text-gray-600 mb-6">
              Search our database of foods to find nutrition facts and calorie information.
            </p>
            <SearchBar
              foods={foods}
              onSelectFood={handleSelectFood}
              recentSearches={recentSearches}
              onAddRecent={handleAddRecent}
            />
          </div>
        </div>
      </div>

      {/* Popular Foods */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Popular Foods
          </h2>
        </div>
        <FoodGrid foods={popularFoods} onSelectFood={handleSelectFood} />
      </div>

      {/* Features Section */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Search Foods</h3>
              <p className="text-gray-600 text-sm">
                Browse our extensive database of common foods with detailed nutritional information
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">View Nutrition</h3>
              <p className="text-gray-600 text-sm">
                See calories, protein, carbs, fat, and fiber for each food with adjustable servings
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Track Daily</h3>
              <p className="text-gray-600 text-sm">
                Add foods to your daily log and monitor your calorie intake with the Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Food Detail Modal */}
      <FoodModal
        food={selectedFood}
        open={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onAdd={handleAddFood}
      />
    </div>
  );
}
