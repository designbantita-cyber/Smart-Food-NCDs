import React, { useState, useEffect } from 'react';
import { HealthProfile, DailyHealthData, Progress14DayData, MealAnalysisResult, UserAccount } from './types';
import { INITIAL_HEALTH_PROFILE, INITIAL_DAILY_DATA, INITIAL_14DAY_PROGRESS, DEFAULT_USER } from './mockData';
import { Navigation, ActiveTab } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { RegisterScreen } from './components/RegisterScreen';
import { LoginScreen } from './components/LoginScreen';
import { InitialProfileScreen } from './components/InitialProfileScreen';
import { DailyDashboardScreen } from './components/DailyDashboardScreen';
import { MealAnalysisScreen } from './components/MealAnalysisScreen';
import { Progress14DayScreen } from './components/Progress14DayScreen';
import { AuthModal } from './components/AuthModal';
import { HelpModal } from './components/HelpModal';

const USER_STORAGE_KEY = 'smart_food_ncd_user';
const PROFILE_STORAGE_KEY = 'smart_food_ncd_profile';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [profile, setProfile] = useState<HealthProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_HEALTH_PROFILE;
  });
  const [dailyData, setDailyData] = useState<DailyHealthData>(INITIAL_DAILY_DATA);
  const [progress14Day, setProgress14Day] = useState<Progress14DayData>(INITIAL_14DAY_PROGRESS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Account State
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch {
      // Ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    showToast(`ยินดีต้อนรับคุณ ${user.name} (${user.provider === 'google' ? 'Gmail' : user.provider === 'apple' ? 'iCloud' : 'Email'})`);
    // Direct user to Health Profile (or Dashboard if already setup)
    setActiveTab('initial_profile');
  };

  const handleRegisterSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    showToast(`สมัครสมาชิกสำเร็จ ยินดีต้อนรับคุณ ${user.name}`);
    // Step 2: direct to Health Profile Page to fill in BMI info
    setActiveTab('initial_profile');
  };

  const handleLogout = () => {
    setCurrentUser({
      id: 'guest',
      name: 'ผู้เยี่ยมชม',
      email: '',
      provider: 'guest',
      avatarUrl: DEFAULT_USER.avatarUrl,
      isLoggedIn: false,
    });
    showToast('ออกจากระบบเรียบร้อยแล้ว');
    setActiveTab('landing');
  };

  // Handle saving profile from Onboarding/Initial Screen
  const handleSaveProfile = (newProfile: HealthProfile) => {
    setProfile(newProfile);
    setDailyData((prev) => ({
      ...prev,
      targetCalories: newProfile.targetCalories,
      remainingCalories: Math.max(0, newProfile.targetCalories - prev.consumedCalories),
    }));
    showToast('บันทึกข้อมูลสุขภาพเรียบร้อยแล้ว');
  };

  // Handle saving analyzed meal into daily log
  const handleSaveMealToLog = (meal: MealAnalysisResult) => {
    const newConsumed = dailyData.consumedCalories + meal.calories;
    const newRemaining = Math.max(0, (profile.targetCalories || 2100) - newConsumed);

    const newMealItem = {
      id: meal.id,
      name: meal.dishName,
      calories: meal.calories,
      tag: meal.macros.carbs.status === 'high' ? 'คาร์บสูง' : 'โภชนาการสมดุล',
      tagColor: (meal.macros.carbs.status === 'high' ? 'tertiary' : 'primary') as 'primary' | 'secondary' | 'tertiary',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      imageUrl: meal.imageUrl,
    };

    setDailyData((prev) => ({
      ...prev,
      consumedCalories: newConsumed,
      remainingCalories: newRemaining,
      recentMeals: [newMealItem, ...prev.recentMeals],
    }));
    showToast(`บันทึก "${meal.dishName}" (${meal.calories} kcal) สำเร็จ`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col antialiased">
      {/* Top Header & Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Guest Notice banner if on internal pages and not logged in */}
      {!currentUser.isLoggedIn && activeTab !== 'landing' && activeTab !== 'login' && activeTab !== 'register' && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2.5">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px]">
            <div className="flex items-center gap-2 text-emerald-800">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">info</span>
              <span>คุณกำลังใช้งานในโหมดทดลอง เข้าสู่ระบบด้วย Gmail หรือ iCloud เพื่อบันทึกข้อมูลถาวร</span>
            </div>
            <button
              onClick={() => setActiveTab('login')}
              className="font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              เข้าสู่ระบบด้วย Gmail / iCloud
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
        {/* 1. Landing Page View */}
        {activeTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setActiveTab('register')}
            onLogin={() => setActiveTab('login')}
            onRegister={() => setActiveTab('register')}
            onDirectExplore={() => setActiveTab('dashboard')}
          />
        )}

        {/* 2. Registration View */}
        {activeTab === 'register' && (
          <RegisterScreen
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => setActiveTab('login')}
            onBackToHome={() => setActiveTab('landing')}
          />
        )}

        {/* 3. Login View */}
        {activeTab === 'login' && (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setActiveTab('register')}
            onBackToHome={() => setActiveTab('landing')}
          />
        )}

        {/* 4. Health Profile Page (BMI & Initial Assessment) */}
        {activeTab === 'initial_profile' && (
          <InitialProfileScreen
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* 5. Daily Dashboard View */}
        {activeTab === 'dashboard' && (
          <DailyDashboardScreen
            dailyData={dailyData}
            profile={profile}
            onNavigateToMealAnalysis={() => setActiveTab('meal_analysis')}
            onNavigateTo14Day={() => setActiveTab('14day_progress')}
            onNavigateToHealthProfile={() => setActiveTab('initial_profile')}
            onUpdateDailyData={setDailyData}
            onUpdateProfile={setProfile}
          />
        )}

        {/* 6. Food Photo Analysis Page */}
        {activeTab === 'meal_analysis' && (
          <MealAnalysisScreen
            profile={profile}
            onSaveMealToLog={handleSaveMealToLog}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* 7. 14-Day Progress Evaluation View */}
        {activeTab === '14day_progress' && (
          <Progress14DayScreen
            progressData={progress14Day}
            profile={profile}
            onUpdateProgress={setProgress14Day}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-[14px] font-medium animate-fadeIn border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 px-4 text-[12px] text-slate-500 mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-600">Smart Food NCD</span>
            <span>• เว็บแอปพลิเคชัน AI วิเคราะห์โภชนาการสำหรับโรคไม่ติดต่อเรื้อรัง</span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser.isLoggedIn ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <span>บัญชี: {currentUser.email}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold uppercase">
                  {currentUser.provider}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="text-emerald-600 hover:underline font-semibold cursor-pointer"
              >
                เข้าสู่ระบบ (Gmail / iCloud)
              </button>
            )}
            <span>•</span>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              เกณฑ์สุขภาพ NCD
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Google Gmail & Apple iCloud) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Help & Guide Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default App;
