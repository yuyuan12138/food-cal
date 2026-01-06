import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Activity, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { CalorieNeeds, calculateBMR, calculateTDEE, calculateMacros } from '@/types';
import { useDailyLogStore } from '@/store/dailyLogStore';

interface CalculatorModalProps {
  open: boolean;
  onClose: () => void;
}

export function CalculatorModal({ open, onClose }: CalculatorModalProps) {
  const { profile, updateProfile, setCalorieTarget } = useDailyLogStore();

  const [weight, setWeight] = useState(profile.weight?.toString() || '');
  const [height, setHeight] = useState(profile.height?.toString() || '');
  const [age, setAge] = useState(profile.age?.toString() || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(profile.gender || 'male');
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel);
  const [calculatedNeeds, setCalculatedNeeds] = useState<CalorieNeeds | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    // Clear any previous error
    setErrorMessage('');

    // Validate inputs - use default values if not provided
    const finalWeight = w || 70; // Default 70kg
    const finalHeight = h || 170; // Default 170cm
    const finalAge = a || 30; // Default 30 years

    // Show warning if using defaults
    if (!w || !h || !a) {
      setErrorMessage('Some fields were empty. Using default values: 70kg, 170cm, 30 years.');
    }

    const bmr = calculateBMR(finalWeight, finalHeight, finalAge, gender);
    const tdee = calculateTDEE(bmr, activityLevel);

    // Recommended daily intake: TDEE for maintenance, or TDEE - 500 for weight loss
    const recommended = tdee;

    setCalculatedNeeds({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      recommended: Math.round(recommended),
      macros: calculateMacros(recommended),
    });

    // Update input fields with used values (defaults or actual)
    if (!w) setWeight(finalWeight.toString());
    if (!h) setHeight(finalHeight.toString());
    if (!a) setAge(finalAge.toString());
  };

  const handleApplyRecommendation = () => {
    if (calculatedNeeds) {
      setCalorieTarget(calculatedNeeds.recommended);
      updateProfile({
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseFloat(age),
        gender,
        activityLevel,
        goals: {
          dailyCalorieTarget: calculatedNeeds.recommended,
          proteinTarget: calculatedNeeds.macros?.protein.grams,
          carbsTarget: calculatedNeeds.macros?.carbs.grams,
          fatTarget: calculatedNeeds.macros?.fat.grams,
        },
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Calorie Calculator</DialogTitle>
          <p className="text-sm text-gray-500">
            Calculate your daily calorie needs based on your body and activity level
          </p>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="manual">Manual Target</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Age (years)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female' | 'other')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">
                    Sedentary (little or no exercise)
                  </SelectItem>
                  <SelectItem value="light">
                    Lightly active (1-3 days/week)
                  </SelectItem>
                  <SelectItem value="moderate">
                    Moderately active (3-5 days/week)
                  </SelectItem>
                  <SelectItem value="active">
                    Very active (6-7 days/week)
                  </SelectItem>
                  <SelectItem value="very-active">
                    Extra active (very hard exercise & physical job)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            <Button onClick={handleCalculate} className="w-full" size="lg">
              Calculate My Needs
            </Button>

            {calculatedNeeds && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-lg">Your Results</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <div className="text-xs text-gray-500 mb-1">BMR</div>
                    <div className="font-bold text-lg">{calculatedNeeds.bmr}</div>
                    <div className="text-xs text-gray-400">cal/day</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-xs text-gray-500 mb-1">TDEE</div>
                    <div className="font-bold text-lg text-primary">{calculatedNeeds.tdee}</div>
                    <div className="text-xs text-gray-400">cal/day</div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-xs text-gray-500 mb-1">Recommended</div>
                    <div className="font-bold text-lg text-primary">{calculatedNeeds.recommended}</div>
                    <div className="text-xs text-gray-400">cal/day</div>
                  </div>
                </div>

                {calculatedNeeds.macros && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-3">
                      Suggested Macro Distribution
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Protein (30%)</div>
                        <div className="font-semibold text-secondary">
                          {calculatedNeeds.macros.protein.grams}g
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Carbs (40%)</div>
                        <div className="font-semibold text-amber-600">
                          {calculatedNeeds.macros.carbs.grams}g
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Fat (30%)</div>
                        <div className="font-semibold text-yellow-500">
                          {calculatedNeeds.macros.fat.grams}g
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Target: {profile.goals.dailyCalorieTarget} calories</Label>
                <Input
                  type="number"
                  placeholder="2000"
                  defaultValue={profile.goals.dailyCalorieTarget}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value && value > 0) {
                      setCalorieTarget(value);
                    }
                  }}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">
                  Quick Set Presets
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1500, 1800, 2000, 2200, 2500, 3000].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => setCalorieTarget(preset)}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {calculatedNeeds ? (
            <Button onClick={handleApplyRecommendation}>
              Apply {calculatedNeeds.recommended} Cal Target
            </Button>
          ) : (
            <Button onClick={onClose}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
