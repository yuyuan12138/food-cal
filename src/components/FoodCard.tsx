import { Food } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Drumstick, Wheat, Droplet } from 'lucide-react';

interface FoodCardProps {
  food: Food;
  onClick?: () => void;
}

export function FoodCard({ food, onClick }: FoodCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{food.name}</h3>
            <p className="text-sm text-gray-500">
              {food.servingSize} {food.servingUnit}
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            {food.calories} cal
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-gray-50 rounded-md p-2">
            <Flame className="h-4 w-4 mx-auto mb-1 text-accent" />
            <div className="text-xs text-gray-500">Calories</div>
            <div className="font-semibold text-sm">{food.calories}</div>
          </div>
          <div className="bg-gray-50 rounded-md p-2">
            <Drumstick className="h-4 w-4 mx-auto mb-1 text-secondary" />
            <div className="text-xs text-gray-500">Protein</div>
            <div className="font-semibold text-sm">{food.protein}g</div>
          </div>
          <div className="bg-gray-50 rounded-md p-2">
            <Wheat className="h-4 w-4 mx-auto mb-1 text-amber-600" />
            <div className="text-xs text-gray-500">Carbs</div>
            <div className="font-semibold text-sm">{food.carbs}g</div>
          </div>
          <div className="bg-gray-50 rounded-md p-2">
            <Droplet className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
            <div className="text-xs text-gray-500">Fat</div>
            <div className="font-semibold text-sm">{food.fat}g</div>
          </div>
        </div>

        {food.tags && food.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {food.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface FoodGridProps {
  foods: Food[];
  onSelectFood: (food: Food) => void;
}

export function FoodGrid({ foods, onSelectFood }: FoodGridProps) {
  if (foods.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No foods found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} onClick={() => onSelectFood(food)} />
      ))}
    </div>
  );
}
