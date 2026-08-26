export type ActiveView = 
  | 'landing' 
  | 'dashboard' 
  | 'initial_profile' 
  | 'meal_analysis' 
  | '14day_progress' 
  | 'profile' 
  | 'login' 
  | 'register';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: 'male' | 'female';
  provider: 'google' | 'apple' | 'email' | 'guest';
  avatarUrl: string;
  isLoggedIn: boolean;
  ncdRole?: string;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface HealthProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  diseases: string;
  medications: string;
  bmi: number;
  bmiStatus: 'น้ำหนักต่ำกว่าเกณฑ์' | 'น้ำหนักปกติ' | 'น้ำหนักเกิน (ท้วม)' | 'โรคอ้วนระดับ 1' | 'โรคอ้วนระดับ 2';
  bmiInterpretation: string;
  bmr: number;
  targetCalories: number;
  mealsPerDay: number;
  mealPlan: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack?: number;
  };
  healthAdvice: string;
  ncdSpecialNotes?: string[];
  initialWeight: number;
  initialBmi: number;
  registeredDate: string;
  currentDay: number; // 1 to 14
  lastAssessmentDate?: string;
}

export interface MealAnalysisResult {
  id: string;
  dishName: string;
  portionSize: string;
  imageUrl: string;
  confidence: 'ความแม่นยำสูง' | 'ความแม่นยำปานกลาง' | 'ระบุโดยผู้ใช้' | 'ไม่สามารถระบุได้' | string;
  isRecognized?: boolean;
  calories: number;
  recommendedMealCalories: number;
  mealPercentage: number;
  mealType: 'มื้อเช้า' | 'มื้อกลางวัน' | 'มื้อเย็น' | 'อาหารว่าง';
  suitability: 'appropriate' | 'slightly_high' | 'high' | 'low';
  suitabilityTitle: string;
  suitabilityDescription: string;
  isAppropriate: boolean;
  mainIngredients: string[];
  macros: {
    carbs: { value: number; target: number; status: 'normal' | 'high' | 'low'; note?: string };
    protein: { value: number; target: number; status: 'normal' | 'high' | 'low' };
    fat: { value: number; target: number; status: 'normal' | 'high' | 'low' };
    sodium?: { value: number; maxLimit: number; note: string };
    sugar?: { value: number; maxLimit: number; note: string };
  };
  aiSuggestions: Array<{
    icon: string;
    title: string;
    description: string;
    type?: 'warning' | 'tip' | 'success';
  }>;
  analyzedAt: string;
  ncdWarning?: string;
}

export interface Progress14DayData {
  day1: {
    weight: number;
    height: number;
    bmi: number;
    bmiStatus: string;
    date: string;
  };
  day14: {
    weight: number;
    height: number;
    bmi: number;
    bmiStatus: string;
    date: string;
  };
  weightChange: number;
  bmiChange: number;
  percentageChange: number;
  historyPoints: Array<{
    day: number;
    label: string;
    weight: number;
    bmi: number;
    date: string;
  }>;
  aiRecommendations: string[];
  hydrationStatus: string;
  lifestyleTips: string[];
  isCompleted: boolean;
}

export interface DailyHealthData {
  date: string;
  consumedCalories: number;
  targetCalories: number;
  remainingCalories: number;
  waterIntakeLiters: number;
  waterTargetLiters: number;
  sleepHours: number;
  sleepTargetHours: number;
  steps: number;
  stepsTarget: number;
  recentMeals: Array<{
    id: string;
    name: string;
    calories: number;
    tag: string;
    tagColor: 'primary' | 'secondary' | 'tertiary';
    time: string;
    imageUrl: string;
  }>;
}
