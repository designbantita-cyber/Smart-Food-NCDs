import React, { useState } from 'react';
import { UserAccount } from '../types';
import { DEMO_USERS, IMAGES } from '../mockData';
import { Logo } from './Logo';

interface LoginScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  onNavigateToRegister: () => void;
  onBackToHome: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onBackToHome,
}) => {
  const [email, setEmail] = useState('designbantita@gmail.com');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSentMessage, setResetSentMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }
    if (!password) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find demo user or generate logged-in session
      const matchedDemo = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      const user: UserAccount = matchedDemo || {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim(),
        age: 40,
        gender: 'female',
        provider: email.includes('gmail') ? 'google' : email.includes('icloud') ? 'apple' : 'email',
        avatarUrl: email.includes('icloud') ? IMAGES.avatarApple : IMAGES.avatar,
        isLoggedIn: true,
        ncdRole: 'ผู้ดูแลสุขภาพ NCD (Day 7/14)',
        lastSyncedAt: 'ซิงค์ล่าสุดเมื่อสักครู่',
        createdAt: '12 ส.ค. 2569'
      };

      setIsLoading(false);
      onLoginSuccess(user);
    }, 600);
  };

  const handleQuickOAuthLogin = (demoUser: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...demoUser,
        isLoggedIn: true,
        lastSyncedAt: 'ซิงค์ล่าสุดเมื่อสักครู่'
      });
    }, 500);
  };

  const handleSendResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      return;
    }
    setResetSentMessage(`ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${resetEmail} เรียบร้อยแล้ว โปรดตรวจสอบกล่องข้อความ`);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setResetSentMessage(null);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="w-full max-w-[500px] mx-auto py-6 px-4">
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
            เข้าสู่ระบบ (Login)
          </h1>
          <p className="text-[14px] text-slate-500">
            เข้าถึงแดชบอร์ดสุขภาพ บันทึกอาหาร และผลติดตาม 14 วันของคุณ
          </p>
        </div>

        {/* Quick OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleQuickOAuthLogin(DEMO_USERS[0])}
            className="w-full p-3 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-3 font-bold text-[13px] text-slate-700 shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>เข้าสู่ระบบด้วย Google (Gmail)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickOAuthLogin(DEMO_USERS[1])}
            className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-center gap-3 font-bold text-[13px] shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.65-.79 1.09-1.89.97-2.99-.94.04-2.07.63-2.74 1.41-.59.68-1.11 1.8-1 2.89 1.05.08 2.12-.52 2.77-1.31z"/>
            </svg>
            <span>เข้าสู่ระบบด้วย Apple (iCloud)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[12px] font-semibold text-slate-400 uppercase tracking-wider relative">
            หรือเข้าสู่ระบบด้วยอีเมล
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
          <div className="space-y-1">
            <label className="text-[13px] font-semibold text-slate-700" htmlFor="loginEmail">
              อีเมล (Email)
            </label>
            <input
              id="loginEmail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700" htmlFor="loginPassword">
                รหัสผ่าน (Password)
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowForgotPasswordModal(true);
                }}
                className="text-[12px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                ลืมรหัสผ่าน? (Forgot Password)
              </button>
            </div>
            <input
              id="loginPassword"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-6 rounded-xl font-bold text-[15px] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              <>
                <span>เข้าสู่ระบบ (Login)</span>
                <span className="material-symbols-outlined text-[18px]">login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer switch to Register */}
        <div className="text-center pt-2 text-[13px] text-slate-500">
          ยังไม่มีบัญชีผู้ใช้งาน?{' '}
          <button
            onClick={onNavigateToRegister}
            className="font-bold text-emerald-600 hover:underline cursor-pointer"
          >
            สร้างบัญชีใหม่ (Create Account)
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-[420px] w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-slate-800">ลืมรหัสผ่าน</h2>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-slate-600">
              กรอกอีเมลของคุณ ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลที่ระบุ
            </p>

            {resetSentMessage ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[13px] border border-emerald-200">
                {resetSentMessage}
              </div>
            ) : (
              <form onSubmit={handleSendResetPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer text-[14px]"
                >
                  ส่งลิงก์รีเซ็ตรหัสผ่าน
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
