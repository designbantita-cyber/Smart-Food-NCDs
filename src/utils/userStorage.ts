import { UserAccount, HealthProfile, DailyHealthData, Progress14DayData, MealAnalysisResult } from '../types';
import { calculateHealthMetrics, IMAGES } from '../mockData';

export interface UserAccountData {
  user: UserAccount;
  profile: HealthProfile;
  dailyData: DailyHealthData;
  progress14Day: Progress14DayData;
  mealsHistory: MealAnalysisResult[];
}

const STORAGE_ACTIVE_USER_ID = 'smart_food_ncd_active_user_id';
const STORAGE_ACCOUNTS_LIST = 'smart_food_ncd_registered_accounts';
const STORAGE_USER_DATA_PREFIX = 'smart_food_ncd_data_';

export const GUEST_USER: UserAccount = {
  id: 'guest',
  name: 'ผู้เยี่ยมชม',
  email: '',
  provider: 'guest',
  avatarUrl: IMAGES.avatar,
  isLoggedIn: false,
};

export function createFreshUserProfile(overrides?: Partial<HealthProfile>): HealthProfile {
  const weight = overrides?.weight || 0;
  const height = overrides?.height || 0;
  const age = overrides?.age || 35;
  const gender = overrides?.gender || 'female';
  const activityLevel = overrides?.activityLevel || 'light';
  const diseases = overrides?.diseases || '';
  const medications = overrides?.medications || '';

  if (weight > 0 && height > 0) {
    const metrics = calculateHealthMetrics(weight, height, age, gender, activityLevel, diseases, medications);
    return {
      weight,
      height,
      age,
      gender,
      activityLevel,
      diseases,
      medications,
      bmi: metrics.bmi || 0,
      bmiStatus: metrics.bmiStatus || 'ยังไม่ได้ระบุ',
      bmiInterpretation: metrics.bmiInterpretation || 'กรุณากรอกน้ำหนักและส่วนสูงเพื่อประเมินค่า BMI',
      bmr: metrics.bmr || 0,
      targetCalories: metrics.targetCalories || 2000,
      mealsPerDay: 3,
      mealPlan: metrics.mealPlan || { breakfast: 550, lunch: 750, dinner: 700, snack: 0 },
      healthAdvice: metrics.healthAdvice || 'กรอกข้อมูลสุขภาพเพื่อรับคำแนะนำเฉพาะโรค NCD',
      ncdSpecialNotes: metrics.ncdSpecialNotes || [],
      initialWeight: weight,
      initialBmi: metrics.bmi || 0,
      registeredDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      currentDay: 1,
      lastAssessmentDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...overrides,
    };
  }

  return {
    weight: 0,
    height: 0,
    age: 35,
    gender: 'female',
    activityLevel: 'light',
    diseases: '',
    medications: '',
    bmi: 0,
    bmiStatus: 'ยังไม่ได้บันทึกข้อมูล',
    bmiInterpretation: 'กรุณากรอกข้อมูลสุขภาพเพื่อคำนวณ BMI และวางแผนโภชนาการ NCD',
    bmr: 0,
    targetCalories: 2000,
    mealsPerDay: 3,
    mealPlan: { breakfast: 550, lunch: 750, dinner: 700, snack: 0 },
    healthAdvice: 'กรอกข้อมูลสุขภาพเพื่อรับคำแนะนำเฉพาะบุคคลสำหรับโรค NCD',
    ncdSpecialNotes: [
      'ควบคุมคาร์โบไฮเดรตเชิงเดี่ยว เพื่อรักษาระดับน้ำตาลในเลือดให้คงที่',
      'จำกัดปริมาณโซเดียมไม่เกิน 2,000 มก./วัน เพื่อป้องกันความดันโลหิตสูง',
      'ดื่มน้ำเปล่าให้เพียงพอ 2-2.5 ลิตร/วัน',
    ],
    initialWeight: 0,
    initialBmi: 0,
    registeredDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
    currentDay: 1,
    lastAssessmentDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
    ...overrides,
  };
}

export function createFreshDailyData(targetCalories: number = 2000): DailyHealthData {
  return {
    date: new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' }),
    consumedCalories: 0,
    targetCalories: targetCalories || 2000,
    remainingCalories: targetCalories || 2000,
    waterIntakeLiters: 0,
    waterTargetLiters: 2.5,
    sleepHours: 0,
    sleepTargetHours: 8.0,
    steps: 0,
    stepsTarget: 8000,
    recentMeals: [],
  };
}

export function createFresh14DayProgress(profile?: HealthProfile): Progress14DayData {
  const w = profile?.weight || 0;
  const h = profile?.height || 0;
  const bmi = profile?.bmi || 0;
  const bmiStatus = profile?.bmiStatus || 'ยังไม่ได้บันทึก';

  return {
    day1: {
      weight: w,
      height: h,
      bmi: bmi,
      bmiStatus: bmiStatus,
      date: 'Day 1 (เริ่มต้น)',
    },
    day14: {
      weight: w,
      height: h,
      bmi: bmi,
      bmiStatus: bmiStatus,
      date: 'Day 14 (เป้าหมาย)',
    },
    weightChange: 0,
    bmiChange: 0,
    percentageChange: 0,
    historyPoints: w > 0 ? [{ day: 1, label: 'Day 1', weight: w, bmi: bmi, date: 'Day 1' }] : [],
    aiRecommendations: [
      'เริ่มต้นบันทึกอาหารมื้อแรกเพื่อติดตามปริมาณแคลอรี่และสารอาหาร',
      'ดื่มน้ำให้เพียงพออย่างน้อย 2-2.5 ลิตรต่อวัน',
      'หลีกเลี่ยงอาหารรสหวานจัด เค็มจัด และไขมันสูง เพื่อควบคุม NCD',
    ],
    hydrationStatus: 'ยังไม่มีข้อมูลการดื่มน้ำวันนี้',
    lifestyleTips: [
      'ถ่ายรูปอาหารทุกมื้อเพื่อรับการประเมินโภชนาการแบบเรียลไทม์',
      'ชั่งน้ำหนักในเวลาเดียวกันของทุกวัน (แนะนำช่วงเช้าหลังตื่นนอน)',
      'ขยับร่างกายหรือเดินเบาๆ หลังมื้ออาหาร',
    ],
  };
}

// Get all registered accounts list
export function getRegisteredAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_LIST);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore error
  }
  return [];
}

// Save or update account in accounts list
export function saveAccountToList(user: UserAccount): void {
  try {
    const accounts = getRegisteredAccounts();
    const index = accounts.findIndex((a) => a.id === user.id || a.email.toLowerCase() === user.email.toLowerCase());
    if (index >= 0) {
      accounts[index] = { ...accounts[index], ...user };
    } else {
      accounts.push(user);
    }
    localStorage.setItem(STORAGE_ACCOUNTS_LIST, JSON.stringify(accounts));
  } catch {
    // Ignore error
  }
}

// Find user by email
export function findAccountByEmail(email: string): UserAccount | null {
  const accounts = getRegisteredAccounts();
  const normalized = email.trim().toLowerCase();
  return accounts.find((a) => a.email.toLowerCase() === normalized) || null;
}

// Get Active Session User
export function getActiveSessionUser(): UserAccount | null {
  try {
    const userId = localStorage.getItem(STORAGE_ACTIVE_USER_ID);
    if (!userId || userId === 'guest') return null;

    const accounts = getRegisteredAccounts();
    const found = accounts.find((a) => a.id === userId);
    if (found) {
      return { ...found, isLoggedIn: true };
    }
  } catch {
    // Ignore error
  }
  return null;
}

// Set Active Session User
export function setActiveSessionUser(user: UserAccount | null): void {
  try {
    if (user && user.isLoggedIn && user.id !== 'guest') {
      localStorage.setItem(STORAGE_ACTIVE_USER_ID, user.id);
      saveAccountToList(user);
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_USER_ID);
    }
  } catch {
    // Ignore error
  }
}

// Get User's Personal Data (Profile, Daily Data, 14-Day Progress)
export function getUserData(userId: string): UserAccountData | null {
  if (!userId || userId === 'guest') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_USER_DATA_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore error
  }
  return null;
}

// Save User's Personal Data
export function saveUserData(
  userId: string,
  data: {
    user: UserAccount;
    profile: HealthProfile;
    dailyData: DailyHealthData;
    progress14Day: Progress14DayData;
    mealsHistory?: MealAnalysisResult[];
  }
): void {
  if (!userId || userId === 'guest') return;
  try {
    const existing = getUserData(userId);
    const updated: UserAccountData = {
      user: data.user,
      profile: data.profile,
      dailyData: data.dailyData,
      progress14Day: data.progress14Day,
      mealsHistory: data.mealsHistory || existing?.mealsHistory || [],
    };
    localStorage.setItem(`${STORAGE_USER_DATA_PREFIX}${userId}`, JSON.stringify(updated));
    saveAccountToList(data.user);
  } catch {
    // Ignore error
  }
}
