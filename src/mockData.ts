import { HealthProfile, MealAnalysisResult, Progress14DayData, DailyHealthData, UserAccount } from './types';

// Hotlinked high quality food photos
export const IMAGES = {
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdoAw6ZEK3fkczHguvYr92tHDnQspGiKmxgQQKUf81XbuR_MBovY-b_kTn3WWWBCZSiWOoZeqPA5omQ70jdN-0tyvU7yCot5_mCUVtTuVZqDT3cig4_UkH2bV3UjAEMPrDgvl5nw_60_czDB8YX5QwGq3oqpfkhO-7UjaLC7PGtWwFb57XcXCZ_2AvROIHGeyo1D-GXSKc5pwt0YqzactgUWFShpnBQFHk1EeMc2HPW46XRHNRohkU",
  avatarApple: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbDyaqEDxMjx0ZGpzaXXtFH1-q1cGXU0EORh1E170g6Ro4N5PVYxp4clkYC8PDz1MqkGVIpqw7yMFPmYJ_wrk3K_1mBh7AEOEIlzOY1v6_mgafnGe0xUwB7_C8BSuRU65oRepRPHysmhkYxdnY2A3Ks_jrhOhRAm50swlvtkV18eFVVwUcpK-1tHKLFqSa5MZEvJ3V9yXNUH9r-dfBivFAkfB740RKHAl9Z3u1cl8nLjoncG5FFN8L",
  avatarSummary: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdoAw6ZEK3fkczHguvYr92tHDnQspGiKmxgQQKUf81XbuR_MBovY-b_kTn3WWWBCZSiWOoZeqPA5omQ70jdN-0tyvU7yCot5_mCUVtTuVZqDT3cig4_UkH2bV3UjAEMPrDgvl5nw_60_czDB8YX5QwGq3oqpfkhO-7UjaLC7PGtWwFb57XcXCZ_2AvROIHGeyo1D-GXSKc5pwt0YqzactgUWFShpnBQFHk1EeMc2HPW46XRHNRohkU",
  padThai: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwzYX_A7YSkEuzIhvH3M4f7rfEncr26DoAsYlaAUnjNCkWpb489rds1FuoE8RjcFAO0dTf811wv8rDUYhkWvaMlnDdjyVT9gUiMZxKcy7f59T2pxnXdy1AvzhWYCZ03XIyc_TTNWycc8D8yHwccTWd9QCt1G-sdEQwavcn5y3zgu8kHjjoiIoKqi4yzieB_wgoQmCmakSvUVkVjHYqNbCcDNMY32ah_uwQymwdYl4AVsqTMu1YzOLM",
  greenCurry: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdBb06UPAWlZy0bW0oJ-7s53rbWX3BINT2U6t_1v_uwXo11BGToPV1D92lQJrUMo_J9zEupz9LH4dQwdpc-zAfdsd_kAkFQzLo4rFulnA6lBWt_0JNO80jbI3hwXXpFUvkqXV1EuUbDX1yTMX845kUopYhcgtzNhfye21HsVAhpZkKjdT4NogbY6zI_W1KbFdKarzSxf5r-OdT7th17cJnUpnaokSFERnAgiFYTpu41rh9HZ9X7AKb",
  chickenRice: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  salmonSalad: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  noodleSoup: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
};

export const DEFAULT_USER: UserAccount = {
  id: "user-default-1",
  name: "สมศรี ใจดี",
  email: "designbantita@gmail.com",
  age: 42,
  gender: "female",
  provider: "google",
  avatarUrl: IMAGES.avatar,
  isLoggedIn: true,
  ncdRole: "ผู้ดูแลสุขภาพ NCD (Day 7/14)",
  lastSyncedAt: "ซิงค์ล่าสุดเมื่อสักครู่",
  createdAt: "12 ส.ค. 2569"
};

export const DEMO_USERS: UserAccount[] = [
  {
    id: "user-gmail-1",
    name: "สมศรี ใจดี",
    email: "designbantita@gmail.com",
    age: 42,
    gender: "female",
    provider: "google",
    avatarUrl: IMAGES.avatar,
    isLoggedIn: true,
    ncdRole: "ผู้ดูแลสุขภาพ NCD (Day 7/14)",
    lastSyncedAt: "ซิงค์ล่าสุดเมื่อสักครู่",
    createdAt: "12 ส.ค. 2569"
  },
  {
    id: "user-icloud-1",
    name: "วรัญญา สุขสมบูรณ์",
    email: "bantita.health@icloud.com",
    age: 38,
    gender: "female",
    provider: "apple",
    avatarUrl: IMAGES.avatarApple,
    isLoggedIn: true,
    ncdRole: "ผู้ควบคุมเบาหวาน (Day 14/14)",
    lastSyncedAt: "ซิงค์ล่าสุดผ่าน iCloud",
    createdAt: "5 ส.ค. 2569"
  }
];

// Helper calculation functions
export function calculateHealthMetrics(
  weight: number,
  height: number,
  age: number = 40,
  gender: 'male' | 'female' = 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' = 'light',
  diseases: string = 'เบาหวาน, ความดันโลหิตสูง',
  medications: string = 'ยาลดน้ำตาล, ยาลดความดัน'
): Partial<HealthProfile> {
  const heightM = height / 100;
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

  let bmiStatus: HealthProfile['bmiStatus'] = 'น้ำหนักปกติ';
  let bmiInterpretation = 'ดัชนีมวลกายอยู่ในเกณฑ์มาตรฐานสมส่วน มีความเสี่ยงต่อโรค NCD ในระดับต่ำ';

  if (bmi < 18.5) {
    bmiStatus = 'น้ำหนักต่ำกว่าเกณฑ์';
    bmiInterpretation = 'น้ำหนักน้อยกว่าเกณฑ์มาตรฐาน แนะนำเพิ่มสารอาหารที่มีประโยชน์และโปรตีนเพื่อเสริมสร้างกล้ามเนื้อ';
  } else if (bmi < 23.0) {
    bmiStatus = 'น้ำหนักปกติ';
    bmiInterpretation = 'ดัชนีมวลกายอยู่ในเกณฑ์มาตรฐานสมส่วน แนะนำรักษาระดับการกินและกิจกรรมเพื่อสุขภาพที่ดี';
  } else if (bmi < 25.0) {
    bmiStatus = 'น้ำหนักเกิน (ท้วม)';
    bmiInterpretation = 'น้ำหนักเกินเกณฑ์มาตรฐานเล็กน้อย แนะนำควบคุมปริมาณคาร์โบไฮเดรตและไขมันเพื่อป้องกันภาวะเสี่ยง NCD';
  } else if (bmi < 30.0) {
    bmiStatus = 'โรคอ้วนระดับ 1';
    bmiInterpretation = 'มีภาวะน้ำหนักเกินระดับ 1 มีความเสี่ยงต่อโรคเบาหวาน ความดันโลหิตสูง และไขมันในเลือดสูง ควรควบคุมแคลอรี่อย่างต่อเนื่อง';
  } else {
    bmiStatus = 'โรคอ้วนระดับ 2';
    bmiInterpretation = 'มีภาวะอ้วนระดับ 2 มีความเสี่ยงสูงต่อโรคไม่ติดต่อเรื้อรัง ควรปรึกษาแพทย์และควบคุมโภชนาการอย่างเข้มงวด';
  }

  // Mifflin - St Jeor Equation
  const bmr = Math.round(
    10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)
  );

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };

  const tdee = Math.round((bmr * (multipliers[activityLevel] || 1.375)) / 50) * 50;
  const targetCalories = Math.max(1400, Math.min(2600, tdee));

  const breakfast = Math.round((targetCalories * 0.28) / 50) * 50;
  const lunch = Math.round((targetCalories * 0.38) / 50) * 50;
  const dinner = targetCalories - breakfast - lunch;

  return {
    weight,
    height,
    age,
    gender,
    activityLevel,
    diseases,
    medications,
    bmi,
    bmiStatus,
    bmiInterpretation,
    bmr,
    targetCalories,
    mealsPerDay: 3,
    mealPlan: {
      breakfast,
      lunch,
      dinner,
      snack: 0
    },
    healthAdvice: `เป้าหมายพลังงาน ${targetCalories} kcal/วัน ช่วยควบคุมน้ำหนักและรักษาระดับน้ำตาลให้คงที่ ป้องกันความเสี่ยงโรค NCD`,
    ncdSpecialNotes: [
      'ควบคุมคาร์โบไฮเดรตเชิงเดี่ยว เลือกข้าวไม่ขัดสี ลดน้ำตาลปรุงรส',
      'จำกัดโซเดียมไม่เกิน 2,000 มก./วัน เพื่อป้องกันความดันโลหิตสูง',
      'ดื่มน้ำเปล่าให้เพียงพอ 2-2.5 ลิตร/วัน และหลีกเลี่ยงเครื่องดื่มรสหวาน'
    ]
  };
}

export const INITIAL_HEALTH_PROFILE: HealthProfile = {
  weight: 65,
  height: 170,
  age: 42,
  gender: 'female',
  activityLevel: 'light',
  diseases: 'เบาหวาน, ความดันโลหิตสูง',
  medications: 'ยาลดน้ำตาล, ยาลดความดัน',
  bmi: 22.5,
  bmiStatus: 'น้ำหนักปกติ',
  bmiInterpretation: 'ดัชนีมวลกายอยู่ในเกณฑ์มาตรฐานสมส่วน มีความเสี่ยงต่อโรค NCD ในระดับต่ำ แนะนำรักษาสมดุลโภชนาการ',
  bmr: 1350,
  targetCalories: 2100,
  mealsPerDay: 3,
  mealPlan: {
    breakfast: 550,
    lunch: 800,
    dinner: 750,
    snack: 0
  },
  healthAdvice: 'เพื่อรักษาน้ำหนักและสุขภาพที่ดีในระดับปัจจุบัน พร้อมควบคุมระดับน้ำตาลและโซเดียมสำหรับผู้ป่วย NCD',
  ncdSpecialNotes: [
    'ควบคุมคาร์โบไฮเดรตเชิงเดี่ยว เพื่อรักษาระดับน้ำตาลในเลือดให้คงที่',
    'จำกัดปริมาณโซเดียมไม่เกิน 2,000 มก./วัน เพื่อป้องกันความดันโลหิตสูง',
    'แบ่งพลังงานออกเป็น 3 มื้อหลักที่สมดุล หลีกเลี่ยงของว่างรสหวานจัด'
  ],
  initialWeight: 66.8,
  initialBmi: 23.1,
  registeredDate: '12 ส.ค. 2569',
  currentDay: 7,
  lastAssessmentDate: '12 ส.ค. 2569'
};

export const INITIAL_DAILY_DATA: DailyHealthData = {
  date: "วันนี้ (มื้อกลางวัน)",
  consumedCalories: 1450,
  targetCalories: 2100,
  remainingCalories: 650,
  waterIntakeLiters: 1.8,
  waterTargetLiters: 2.5,
  sleepHours: 7.2,
  sleepTargetHours: 8.0,
  steps: 5420,
  stepsTarget: 8000,
  recentMeals: [
    {
      id: "meal-1",
      name: "ข้าวกล้อง + อกไก่ย่างสมุนไพร",
      calories: 450,
      tag: "โปรตีนสูง/โซเดียมต่ำ",
      tagColor: "primary",
      time: "07:30 น.",
      imageUrl: IMAGES.salmonSalad
    },
    {
      id: "meal-2",
      name: "ผัดไทยกุ้งสด (ไม่หวาน)",
      calories: 550,
      tag: "คาร์บสมดุล",
      tagColor: "secondary",
      time: "12:15 น.",
      imageUrl: IMAGES.padThai
    },
    {
      id: "meal-3",
      name: "สลัดอกไก่ไข่ต้มน้ำสลัดงา",
      calories: 450,
      tag: "ไฟเบอร์สูง",
      tagColor: "primary",
      time: "18:00 น.",
      imageUrl: IMAGES.chickenRice
    }
  ]
};

export const INITIAL_14DAY_PROGRESS: Progress14DayData = {
  day1: {
    weight: 70.2,
    height: 170,
    bmi: 24.3,
    bmiStatus: "น้ำหนักเกิน (ท้วม)",
    date: "Day 1 (12 ส.ค.)"
  },
  day14: {
    weight: 68.5,
    height: 170,
    bmi: 23.7,
    bmiStatus: "น้ำหนักเกิน (ท้วม)",
    date: "Day 14 (วันนี้)"
  },
  weightChange: -1.7,
  bmiChange: -0.6,
  percentageChange: -2.4,
  historyPoints: [
    { day: 1, label: "Day 1", weight: 70.2, bmi: 24.3, date: "12 ส.ค." },
    { day: 3, label: "Day 3", weight: 69.8, bmi: 24.1, date: "14 ส.ค." },
    { day: 6, label: "Day 6", weight: 69.4, bmi: 24.0, date: "17 ส.ค." },
    { day: 9, label: "Day 9", weight: 69.0, bmi: 23.9, date: "20 ส.ค." },
    { day: 12, label: "Day 12", weight: 68.7, bmi: 23.8, date: "23 ส.ค." },
    { day: 14, label: "Day 14", weight: 68.5, bmi: 23.7, date: "25 ส.ค." }
  ],
  aiRecommendations: [
    "น้ำหนักของคุณลดลงอย่างต่อเนื่อง -1.7 กก. อยู่ในอัตราปลอดภัย (0.5-1 กก./สัปดาห์)",
    "รักษาปริมาณโปรตีนให้เพียงพอ (~70-80 กรัม/วัน) เพื่อรักษามวลกล้ามเนื้อและอัตราการเผาผลาญ",
    "ช่วยควบคุมความดันโลหิตและระดับน้ำตาลสะสม (HbA1c) ได้ดีขึ้นอย่างมีนัยสำคัญ"
  ],
  hydrationStatus: "ดื่มน้ำเฉลี่ย 2.1 ลิตร/วัน (บรรลุ 84% ของเป้าหมาย)",
  lifestyleTips: [
    "ดื่มน้ำ 1 แก้วก่อนมื้ออาหารเพื่อช่วยควบคุมความอยากอาหาร",
    "เดินเร็วเบาๆ 15-20 นาทีหลังมื้ออาหารเพื่อช่วยลดระดับน้ำตาลพุ่งสูง",
    "นอนหลับให้สนิท 7-8 ชั่วโมงเพื่อช่วยฮอร์โมนควบคุมความอิ่ม (Leptin)"
  ],
  isCompleted: true
};

export const INITIAL_MEAL_ANALYSIS: MealAnalysisResult = {
  id: "meal-default-padthai",
  dishName: "ผัดไทยกุ้งสด",
  portionSize: "1 จานมาตรฐาน (~350 กรัม)",
  imageUrl: IMAGES.padThai,
  confidence: "ความแม่นยำสูง",
  calories: 550,
  recommendedMealCalories: 800,
  mealPercentage: 69,
  mealType: "มื้อกลางวัน",
  suitability: "appropriate",
  suitabilityTitle: "เหมาะสมกับแผนการกินของคุณ",
  suitabilityDescription: "มื้อนี้อยู่ในเกณฑ์ปริมาณแคลอรี่ที่กำหนดไว้สำหรับมื้อกลางวัน (800 kcal) แต่มีสัดส่วนคาร์โบไฮเดรตและโซเดียมค่อนข้างสูงเล็กน้อย",
  isAppropriate: true,
  mainIngredients: ["เส้นจันทน์/ก๋วยเตี๋ยว", "กุ้งสด", "เต้าหู้เหลือง", "ถั่วงอก/กุยช่าย", "ไข่ไก่", "น้ำซอสปรุงรส"],
  macros: {
    carbs: {
      value: 65,
      target: 70,
      status: "high",
      note: "สูงกว่าเป้าหมายเล็กน้อย"
    },
    protein: {
      value: 25,
      target: 30,
      status: "normal"
    },
    fat: {
      value: 22,
      target: 20,
      status: "normal"
    },
    sodium: {
      value: 680,
      maxLimit: 700,
      note: "อยู่ในเกณฑ์ควบคุม"
    },
    sugar: {
      value: 12,
      maxLimit: 15,
      note: "ระวังน้ำตาลปรุงรส"
    }
  },
  aiSuggestions: [
    {
      icon: "restaurant_menu",
      title: "ลดปริมาณเส้น (คาร์โบไฮเดรต)",
      description: "เนื่องจากคาร์โบไฮเดรตเกินเป้าหมาย แนะนำให้ลดปริมาณเส้นลงประมาณ 1/4 ของจานในครั้งหน้า",
      type: "warning"
    },
    {
      icon: "local_florist",
      title: "เพิ่มผักสด เช่น ถั่วงอกดิบ ใบบัวบก",
      description: "เพิ่มใยอาหารและช่วยชะลอการดูดซึมน้ำตาลเข้าสู่กระแสเลือด เหมาะกับผู้ป่วยเบาหวาน",
      type: "tip"
    },
    {
      icon: "soup_kitchen",
      title: "หลีกเลี่ยงการเติมน้ำตาลและน้ำปลาพริกเพิ่ม",
      description: "ตัวซอสผัดไทยมีโซเดียมและน้ำตาลปรุงรสอยู่แล้ว การไม่เติมเพิ่มช่วยคุมความดันโลหิตได้ดีเยี่ยม",
      type: "tip"
    }
  ],
  analyzedAt: "วันนี้, 12:15 น.",
  ncdWarning: "สำหรับผู้ป่วยโรคไตหรือความดันโลหิตสูง ควรลดการทานน้ำซอสผัดไทยที่ก้นจานเพื่อลดปริมาณโซเดียมสะสม"
};

export const SAMPLE_PADTHAI_ANALYSIS: MealAnalysisResult = INITIAL_MEAL_ANALYSIS;

export const PRESET_SAMPLE_MEALS = [
  {
    name: 'ผัดไทยกุ้งสด',
    category: 'อาหารจานเดียว',
    calories: 550,
    imageUrl: IMAGES.padThai,
    data: INITIAL_MEAL_ANALYSIS,
  },
  {
    name: 'สลัดแซลมอนย่าง',
    category: 'อาหารสุขภาพ / คาร์บต่ำ',
    calories: 420,
    imageUrl: IMAGES.salmonSalad,
    data: {
      ...INITIAL_MEAL_ANALYSIS,
      id: 'meal-salmon-salad',
      dishName: 'สลัดแซลมอนย่างอะโวคาโด',
      portionSize: '1 จานสลัด (~300 กรัม)',
      imageUrl: IMAGES.salmonSalad,
      calories: 420,
      confidence: 'ความแม่นยำสูง' as const,
      mainIngredients: ['เนื้อปลาแซลมอนย่าง', 'ผักสลัดไฮโดรโปนิกส์', 'อะโวคาโด', 'น้ำสลัดงาญี่ปุ่นโฮมเมด'],
      macros: {
        carbs: { value: 18, target: 70, status: 'low' as const, note: 'คาร์โบไฮเดรตต่ำ ดีต่อการคุมน้ำตาล' },
        protein: { value: 34, target: 30, status: 'normal' as const },
        fat: { value: 24, target: 20, status: 'normal' as const },
        sodium: { value: 380, maxLimit: 700, note: 'โซเดียมต่ำ ปลอดภัยต่อความดัน' },
        sugar: { value: 4, maxLimit: 15, note: 'น้ำตาลต่ำมาก' },
      },
      suitabilityTitle: 'ยอดเยี่ยมสำหรับผู้ป่วย NCDs',
      suitabilityDescription: 'ให้กรดไขมันดี โอเมก้า-3 จากปลาแซลมอน และใยอาหารสูง เหมาะอย่างยิ่งสำหรับผู้เป็นเบาหวานและความดันโลหิตสูง',
    },
  },
  {
    name: 'ข้าวมันไก่ตอน',
    category: 'อาหารจานเดียว / พลังงานสูง',
    calories: 620,
    imageUrl: IMAGES.chickenRice,
    data: {
      ...INITIAL_MEAL_ANALYSIS,
      id: 'meal-chicken-rice',
      dishName: 'ข้าวมันไก่ตอน (พร้อมน้ำจิ้มและน้ำซุป)',
      portionSize: '1 จานปกติ (~350 กรัม)',
      imageUrl: IMAGES.chickenRice,
      calories: 620,
      confidence: 'ความแม่นยำสูง' as const,
      mainIngredients: ['ข้าวมันหุงน้ำซุปไก่', 'เนื้อไก่ตอนต้ม', 'แตงกวา', 'น้ำจิ้มเต้าเจี้ยว', 'น้ำซุปฟัก'],
      macros: {
        carbs: { value: 68, target: 70, status: 'normal' as const },
        protein: { value: 26, target: 30, status: 'normal' as const },
        fat: { value: 28, target: 20, status: 'high' as const, note: 'ไขมันจากหนังไก่และข้าวมันค่อนข้างสูง' },
        sodium: { value: 890, maxLimit: 700, note: 'โซเดียมสูงจากน้ำจิ้มและน้ำซุป' },
        sugar: { value: 9, maxLimit: 15, note: 'น้ำตาลปานกลาง' },
      },
      suitabilityTitle: 'พลังงานและไขมันค่อนข้างสูง',
      suitabilityDescription: 'แนะนำให้สั่งเป็น "ข้าวสวยธรรมดา" แทนข้าวมัน และเลือก "เนื้อไก่ไม่เอาหนัง" เพื่อลดไขมันอิ่มตัวและพลังงานลงประมาณ 180 kcal',
    },
  },
  {
    name: 'แกงจืดเต้าหู้หมูสับ',
    category: 'ซุป / โซเดียมต่ำ',
    calories: 220,
    imageUrl: IMAGES.soup,
    data: {
      ...INITIAL_MEAL_ANALYSIS,
      id: 'meal-clear-soup',
      dishName: 'แกงจืดเต้าหู้ไข่หมูสับผักกาดขาว',
      portionSize: '1 ถ้วยแกง (~280 กรัม)',
      imageUrl: IMAGES.soup,
      calories: 220,
      confidence: 'ความแม่นยำสูง' as const,
      mainIngredients: ['เต้าหู้ไข่', 'หมูสับไม่ติดมัน', 'ผักกาดขาว/คื่นช่าย', 'สาหร่ายวากาเมะ'],
      macros: {
        carbs: { value: 12, target: 70, status: 'low' as const },
        protein: { value: 18, target: 30, status: 'normal' as const },
        fat: { value: 11, target: 20, status: 'normal' as const },
        sodium: { value: 450, maxLimit: 700, note: 'ควรซดน้ำซุปแต่น้อย' },
        sugar: { value: 3, maxLimit: 15, note: 'น้ำตาลต่ำมาก' },
      },
      suitabilityTitle: 'แคลอรี่ต่ำ ย่อยง่าย สบายท้อง',
      suitabilityDescription: 'เหมาะเป็นเมนูเสริมหรือมื้อเย็นที่ต้องการควบคุมแคลอรี่ เพิ่มผักกาดขาวได้ไม่อั้นเพื่อเพิ่มใยอาหาร',
    },
  },
];

