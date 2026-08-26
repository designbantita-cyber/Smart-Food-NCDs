import React, { useState } from 'react';
import { UserAccount } from '../types';
import { IMAGES, DEMO_USERS } from '../mockData';
import { Logo } from './Logo';

interface RegisterScreenProps {
  onRegisterSuccess: (user: UserAccount) => void;
  onNavigateToLogin: () => void;
  onBackToHome: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onBackToHome,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState<number | string>(35);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('กรุณากรอกชื่อ-นามสกุลของคุณ');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('กรุณากรอกอีเมลที่ถูกต้อง');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    const numAge = Number(age);
    if (!numAge || numAge < 10 || numAge > 120) {
      setErrorMessage('กรุณากรอกอายุที่ถูกต้อง (10-120 ปี)');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        password: password,
        age: numAge,
        gender: gender,
        provider: 'email',
        avatarUrl: gender === 'male' ? IMAGES.avatarSummary : IMAGES.avatar,
        isLoggedIn: true,
        ncdRole: 'ผู้ใช้งานใหม่ (Day 1/14)',
        lastSyncedAt: 'ซิงค์ล่าสุดเมื่อสักครู่',
        createdAt: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setIsLoading(false);
      onRegisterSuccess(newUser);
    }, 600);
  };

  const handleQuickOAuthRegister = (demoUser: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess({
        ...demoUser,
        isLoggedIn: true,
        lastSyncedAt: 'ซิงค์ล่าสุดเมื่อสักครู่'
      });
    }, 500);
  };

  return (
    <div className="w-full max-w-[540px] mx-auto py-6 px-4">
      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="mb-4 text-slate-500 hover:text-slate-800 text-[13px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>กลับหน้าแรก</span>
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h1 className="text-[24px] font-bold text-slate-800 tracking-tight">
            สมัครสมาชิกใหม่
          </h1>
          <p className="text-[14px] text-slate-500">
            กรอกข้อมูลเพื่อสร้างบัญชีและรับคำแนะนำโภชนาการส่วนบุคคล
          </p>
        </div>

        {/* Quick OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleQuickOAuthRegister(DEMO_USERS[0])}
            className="w-full p-3 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-3 font-bold text-[13px] text-slate-700 shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>สมัครด่วนด้วย Google (Gmail)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickOAuthRegister(DEMO_USERS[1])}
            className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-center gap-3 font-bold text-[13px] shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.65-.79 1.09-1.89.97-2.99-.94.04-2.07.63-2.74 1.41-.59.68-1.11 1.8-1 2.89 1.05.08 2.12-.52 2.77-1.31z"/>
            </svg>
            <span>สมัครด่วนด้วย Apple (iCloud)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[12px] font-semibold text-slate-400 uppercase tracking-wider relative">
            หรือกรอกข้อมูลสมัครสมาชิก
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[13px] font-semibold text-slate-700" htmlFor="fullName">
              ชื่อ - นามสกุล <span className="text-rose-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="เช่น สมศรี ใจดี"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[13px] font-semibold text-slate-700" htmlFor="email">
              อีเมล (Email) <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="เช่น yourname@gmail.com หรือ @icloud.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-slate-700" htmlFor="password">
                รหัสผ่าน <span className="text-rose-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-slate-700" htmlFor="confirmPassword">
                ยืนยันรหัสผ่าน <span className="text-rose-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-slate-700" htmlFor="age">
                อายุ (ปี) <span className="text-rose-500">*</span>
              </label>
              <input
                id="age"
                type="number"
                required
                min="10"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="เช่น 35"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-slate-700">
                เพศ <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 rounded-xl text-[13px] font-bold border transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  หญิง
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 rounded-xl text-[13px] font-bold border transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ชาย
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="register-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-6 rounded-xl font-bold text-[15px] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>กำลังสร้างบัญชี...</span>
              </>
            ) : (
              <>
                <span>สร้างบัญชี (Create Account)</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer switch to Login */}
        <div className="text-center pt-2 text-[13px] text-slate-500">
          มีบัญชีผู้ใช้งานอยู่แล้ว?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-bold text-emerald-600 hover:underline cursor-pointer"
          >
            เข้าสู่ระบบที่นี่ (Login)
          </button>
        </div>
      </div>
    </div>
  );
};
