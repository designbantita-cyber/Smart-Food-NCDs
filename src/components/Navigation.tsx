import React, { useState } from 'react';
import { Logo } from './Logo';
import { UserAccount } from '../types';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'meal_analysis'
  | '14day_progress'
  | 'initial_profile'
  | 'login'
  | 'register';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenHelp: () => void;
  currentUser: UserAccount;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenHelp,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      {/* Top App Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-3 cursor-pointer text-left group"
            title="กลับสู่หน้าแรก Smart Food NCD"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Action Buttons & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
          {/* Direct Link Share Button */}
          <button
            id="copy-link-btn"
            onClick={handleCopyLink}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-semibold transition-all cursor-pointer shadow-2xs"
            title="คัดลอกลิงก์เว็บเพื่อเปิดบนมือถือหรือคอมพิวเตอร์เครื่องอื่น"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">
              {copiedLink ? 'check' : 'link'}
            </span>
            <span>{copiedLink ? 'คัดลอกลิงก์แล้ว!' : 'คัดลอกลิงก์เว็บ'}</span>
          </button>

          {/* Help Button */}
          <button
            id="help-modal-btn"
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="เกณฑ์สุขภาพ NCD และคำแนะนำ"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>

          {/* User Account / Sign in Button */}
          {currentUser.isLoggedIn ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer"
                title="จัดการบัญชี Google / iCloud"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/30 bg-slate-100">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-xs flex items-center justify-center border border-slate-200">
                    {currentUser.provider === 'google' ? (
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    ) : currentUser.provider === 'apple' ? (
                      <svg className="w-2.5 h-2.5 fill-slate-800" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.65-.79 1.09-1.89.97-2.99-.94.04-2.07.63-2.74 1.41-.59.68-1.11 1.8-1 2.89 1.05.08 2.12-.52 2.77-1.31z"/>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined text-[10px] text-emerald-600">mail</span>
                    )}
                  </div>
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[13px] font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {currentUser.email}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 hidden sm:inline">
                  expand_more
                </span>
              </button>

              {/* User dropdown menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 z-50 animate-fadeIn">
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <p className="text-[13px] font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {currentUser.provider === 'google' ? 'Google Account' : currentUser.provider === 'apple' ? 'Apple iCloud' : 'Email Account'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onSelectTab('initial_profile');
                    }}
                    className="w-full text-left px-3 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">person</span>
                    <span>แก้ไขข้อมูลสุขภาพ</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-login-btn"
                onClick={() => onSelectTab('login')}
                className="text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-full text-[13px] font-bold cursor-pointer transition-colors"
              >
                เข้าสู่ระบบ
              </button>
              <button
                id="nav-register-btn"
                onClick={() => onSelectTab('register')}
                className="flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white px-3.5 py-1.5 rounded-full text-[13px] font-bold shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>สมัครสมาชิก</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Tab Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-2 overflow-x-auto no-scrollbar sticky top-[57px] z-20 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2">
          <button
            id="tab-landing-btn"
            onClick={() => onSelectTab('landing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] md:text-[14px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'landing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>หน้าแรก (Home)</span>
          </button>

          <button
            id="tab-dashboard-btn"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] md:text-[14px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>แดชบอร์ดสุขภาพรายวัน</span>
          </button>

          <button
            id="tab-meal-analysis-btn"
            onClick={() => onSelectTab('meal_analysis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] md:text-[14px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'meal_analysis'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">camera_enhance</span>
            <span>วิเคราะห์มื้ออาหาร AI</span>
          </button>

          <button
            id="tab-14day-progress-btn"
            onClick={() => onSelectTab('14day_progress')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] md:text-[14px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === '14day_progress'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">monitoring</span>
            <span>สรุปผลสุขภาพ 14 วัน</span>
          </button>

          <button
            id="tab-initial-profile-btn"
            onClick={() => onSelectTab('initial_profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] md:text-[14px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'initial_profile'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
            <span>ข้อมูลสุขภาพ & คำนวณ BMI</span>
          </button>
        </div>
      </nav>
    </>
  );
};
