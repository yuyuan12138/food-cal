import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calculator, Calendar } from 'lucide-react';
import { useDailyLogStore } from '@/store/dailyLogStore';
import { CalorieProgress } from '@/components/CalorieProgress';
import { MealSection } from '@/components/MealSection';
import { CalculatorModal } from '@/components/CalculatorModal';
import { FoodModal } from '@/components/FoodModal';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Food, MealType, formatDate, getTodayDate } from '@/types';
import { foods } from '@/data/foods';

export function Dashboard() {
  const {
    selectedDate,
    setSelectedDate,
    selectedMeal,
    setSelectedMeal,
    getDailySummary,
    deleteEntry,
    addEntry,
    profile,
  } = useDailyLogStore();

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const summary = getDailySummary(selectedDate);

  const handleDateChange = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleAddClick = (meal: MealType) => {
    setSelectedMeal(meal);
    // Scroll to search bar
    document.getElementById('food-search')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setIsFoodModalOpen(true);
  };

  const handleAddFood = (food: Food, meal: MealType, servings: number) => {
    addEntry(food, meal, servings, selectedDate);
    setIsFoodModalOpen(false);
  };

  const handleAddRecent = (query: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daily Dashboard</h1>
              <p className="text-sm text-gray-500">Track your nutrition</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsCalculatorOpen(true)}
              className="gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calculator
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Date Navigator */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDateChange(-1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-lg font-semibold">
                  {formatDate(selectedDate)}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDateChange(1)}
                disabled={selectedDate === getTodayDate()}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calorie Progress */}
        <CalorieProgress
          summary={summary}
          target={profile.goals.dailyCalorieTarget}
        />

        {/* Food Search */}
        <div id="food-search">
          <SearchBar
            foods={foods}
            onSelectFood={handleSelectFood}
            recentSearches={recentSearches}
            onAddRecent={handleAddRecent}
          />
          {selectedMeal && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Adding to: <span className="font-medium">{selectedMeal}</span>
            </p>
          )}
        </div>

        {/* Meal Sections */}
        <div className="space-y-4">
          <MealSection
            type="breakfast"
            entries={summary.meals.breakfast}
            onAddClick={handleAddClick}
            onDeleteEntry={deleteEntry}
          />
          <MealSection
            type="lunch"
            entries={summary.meals.lunch}
            onAddClick={handleAddClick}
            onDeleteEntry={deleteEntry}
          />
          <MealSection
            type="dinner"
            entries={summary.meals.dinner}
            onAddClick={handleAddClick}
            onDeleteEntry={deleteEntry}
          />
          <MealSection
            type="snack"
            entries={summary.meals.snacks}
            onAddClick={handleAddClick}
            onDeleteEntry={deleteEntry}
          />
        </div>
      </div>

      {/* Modals */}
      <CalculatorModal
        open={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
      <FoodModal
        food={selectedFood}
        open={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onAdd={handleAddFood}
      />
    </div>
  );
}
