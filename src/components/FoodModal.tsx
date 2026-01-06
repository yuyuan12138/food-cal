import { useState, useEffect } from 'react';
import { Food, MealType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Flame, Drumstick, Wheat, Droplet, Leaf } from 'lucide-react';
import { useDailyLogStore } from '@/store/dailyLogStore';

interface FoodModalProps {
  food: Food | null;
  open: boolean;
  onClose: () => void;
  onAdd: (food: Food, meal: MealType, servings: number) => void;
}

export function FoodModal({ food, open, onClose, onAdd }: FoodModalProps) {
  const { selectedMeal: storeSelectedMeal } = useDailyLogStore();
  const [servings, setServings] = useState(1);
  const [selectedMeal, setSelectedMeal] = useState<MealType>(storeSelectedMeal || 'snack');

  // Reset form when food changes, using store's selectedMeal as default
  useEffect(() => {
    setServings(1);
    setSelectedMeal(storeSelectedMeal || 'snack');
  }, [food, storeSelectedMeal]);

  if (!food) return null;

  const adjustedCalories = Math.round(food.calories * servings);
  const adjustedProtein = Math.round(food.protein * servings * 10) / 10;
  const adjustedCarbs = Math.round(food.carbs * servings * 10) / 10;
  const adjustedFat = Math.round(food.fat * servings * 10) / 10;
  const adjustedFiber = Math.round((food.fiber || 0) * servings * 10) / 10;

  const handleAdd = () => {
    onAdd(food, selectedMeal, servings);
    // Reset form
    setServings(1);
    setSelectedMeal('snack');
    onClose();
  };

  const handleClose = () => {
    setServings(1);
    setSelectedMeal('snack');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{food.name}</DialogTitle>
          <p className="text-sm text-gray-500">
            Base: {food.servingSize} {food.servingUnit} • {food.calories} calories
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Serving size slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Servings</Label>
              <span className="text-sm font-medium text-primary">
                {servings}x ({food.servingSize * servings} {food.servingUnit})
              </span>
            </div>
            <Slider
              value={servings}
              onChange={(value) => setServings(value)}
              min={0.25}
              max={5}
              step={0.25}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0.25x</span>
              <span>1x</span>
              <span>2x</span>
              <span>3x</span>
              <span>4x</span>
              <span>5x</span>
            </div>
          </div>

          {/* Meal selection */}
          <div className="space-y-2">
            <Label>Add to meal</Label>
            <Select value={selectedMeal} onValueChange={(value) => setSelectedMeal(value as MealType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nutrition breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-accent" />
                <span className="text-sm">Calories</span>
              </div>
              <span className="font-bold text-lg">{adjustedCalories}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Drumstick className="h-4 w-4 text-secondary" />
                  <span className="text-xs text-gray-600">Protein</span>
                </div>
                <span className="font-semibold text-sm">{adjustedProtein}g</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wheat className="h-4 w-4 text-amber-600" />
                  <span className="text-xs text-gray-600">Carbs</span>
                </div>
                <span className="font-semibold text-sm">{adjustedCarbs}g</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-gray-600">Fat</span>
                </div>
                <span className="font-semibold text-sm">{adjustedFat}g</span>
              </div>

              {food.fiber !== undefined && food.fiber > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-600">Fiber</span>
                  </div>
                  <span className="font-semibold text-sm">{adjustedFiber}g</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {food.tags && food.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {food.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} className="min-w-[120px]">
            Add {adjustedCalories} cal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
