import { LogEntry, MealType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MealSectionProps {
  type: MealType;
  entries: LogEntry[];
  onAddClick: (meal: MealType) => void;
  onDeleteEntry: (id: string) => void;
}

const mealConfig = {
  breakfast: {
    title: 'Breakfast',
    icon: '🌅',
    color: 'bg-orange-50 border-orange-200',
  },
  lunch: {
    title: 'Lunch',
    icon: '☀️',
    color: 'bg-blue-50 border-blue-200',
  },
  dinner: {
    title: 'Dinner',
    icon: '🌙',
    color: 'bg-purple-50 border-purple-200',
  },
  snack: {
    title: 'Snacks',
    icon: '🍎',
    color: 'bg-green-50 border-green-200',
  },
};

export function MealSection({
  type,
  entries,
  onAddClick,
  onDeleteEntry,
}: MealSectionProps) {
  const config = mealConfig[type];
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <Card className={cn('border-2', config.color)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <CardTitle className="text-lg">{config.title}</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              {entries.length > 0 ? `${totalCalories} cal` : 'No entries'}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddClick(type)}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="py-6 text-center text-gray-400 text-sm">
            Click "Add" to log food for {config.title.toLowerCase()}
          </div>
        ) : (
          <ScrollArea className="max-h-48">
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-white rounded-md border hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{entry.foodName}</div>
                    <div className="text-sm text-gray-500">
                      {entry.servings}x {entry.servingSize} {entry.servingUnit}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-primary">{entry.calories} cal</div>
                      <div className="text-xs text-gray-400">
                        P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteEntry(entry.id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
