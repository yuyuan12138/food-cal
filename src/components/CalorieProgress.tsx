import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Target } from 'lucide-react';
import { DailySummary } from '@/types';
import { cn } from '@/lib/utils';

interface CalorieProgressProps {
  summary: DailySummary;
  target: number;
}

export function CalorieProgress({ summary, target }: CalorieProgressProps) {
  const remaining = target - summary.totalCalories;
  const percentage = Math.min((summary.totalCalories / target) * 100, 100);
  const isOver = remaining < 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className={cn(
              'h-5 w-5',
              isOver ? 'text-red-500' : 'text-primary'
            )} />
            <h3 className="font-semibold text-lg">Daily Calories</h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Target className="h-4 w-4" />
            Goal: {target}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Consumed</span>
              <span className="font-semibold text-lg">
                {summary.totalCalories}
                <span className="text-sm text-gray-500 font-normal"> / {target} cal</span>
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <div className="flex items-center justify-center py-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className={cn(
                'text-3xl font-bold',
                isOver ? 'text-red-500' : 'text-primary'
              )}>
                {isOver ? '+' : ''}{remaining}
              </div>
              <div className="text-sm text-gray-500">
                {isOver ? 'calories over' : 'calories remaining'}
              </div>
            </div>
          </div>

          {/* Macro breakdown */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Protein</div>
              <div className="font-semibold text-secondary">{summary.totalProtein}g</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Carbs</div>
              <div className="font-semibold text-amber-600">{summary.totalCarbs}g</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Fat</div>
              <div className="font-semibold text-yellow-500">{summary.totalFat}g</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CircularCalorieProgressProps {
  current: number;
  target: number;
  size?: number;
}

export function CircularCalorieProgress({
  current,
  target,
  size = 120,
}: CircularCalorieProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = target - current;
  const isOver = remaining < 0;
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            fill="none"
            stroke={isOver ? '#ef4444' : '#10b981'}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Flame className={cn(
            'h-5 w-5 mb-1',
            isOver ? 'text-red-500' : 'text-primary'
          )} />
          <div className={cn(
            'text-2xl font-bold',
            isOver ? 'text-red-500' : 'text-gray-900'
          )}>
            {current}
          </div>
          <div className="text-xs text-gray-500">of {target}</div>
        </div>
      </div>
      <div className={cn(
        'mt-2 text-sm font-medium',
        isOver ? 'text-red-500' : 'text-primary'
      )}>
        {isOver ? `+${Math.abs(remaining)} over` : `${remaining} left`}
      </div>
    </div>
  );
}
