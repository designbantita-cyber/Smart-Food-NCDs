import React, { useState } from 'react';
import { UserAccount } from '../types';
import { IMAGES, DEMO_USERS } from '../mockData';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'apple'>('google');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (demoUser: UserAccount) => {
    setIsLoading(true);
    setStatusMessage(`กำลังเชื่อมต่อบัญชี ${demoUser.provider === 'google' ? 'Google (Gmail)' : 'Apple (iCloud)'}...`);
    
    setTimeout(() => {
      onLogin({
        ...demoUser,
        isLoggedIn: true,
        lastSyncedAt: 'ซิงค์ล่าสุดเมื่อสักครู่'
      });
      setIsLoading(false);
      setStatusMessage(null);
      onClose();
    }, 600);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    setIsLoading(true);
    const provider = authMethod;
    const fallbackName = customName.trim() || (customEmail.split('@')[0] || 'ผู้ใช้งาน NCD');
    
    setStatusMessage(`กำลังยืนยันตัวตนผ่าน ${provider === 'google' ? 'Google Account' : 'Apple ID'}...`);

    setTimeout(() => {
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: fallbackName,
        email: customEmail.trim(),
        age: 35,
        gender: 'female',
        provider: provider,
        avatarUrl: provider === 'google' ? IMAGES.avatar : IMAGES.avatarApple,
        isLoggedIn: true,
        ncdRole: 'ผู้ใช้งาน NCD',
        lastSyncedAt: 'ซิงค์ล่าสุดเมื่อสักครู่',
        createdAt: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      };

      onLogin(newUser);
      setIsLoading(false);
      setStatusMessage(null);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-[500px] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-[16px] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {currentUser.isLoggedIn ? (
            /* Logged in state: Account Details & Switch Account */
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-emerald-500 bg-slate-100">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center border border-slate-200">
                    {currentUser.provider === 'google' ? (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 fill-slate-800" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.65-.79 1.09-1.89.97-2.99-.94.04-2.07.63-2.74 1.41-.59.68-1.11 1.8-1 2.89 1.05.08 2.12-.52 2.77-1.31z"/>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[16px] font-bold text-slate-800 truncate">{currentUser.name}</h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      เชื่อมต่อแล้ว
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-500 truncate">{currentUser.email}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-emerald-600">cloud_done</span>
                    <span>{currentUser.lastSyncedAt || 'ซิงค์ข้อมูลกับคลาวด์อัตโนมัติ'}</span>
                  </p>
                </div>
              </div>

              {/* Quick Switch to other accounts */}
              <div>
                <p className="text-[13px] font-bold text-slate-700 mb-2">สลับบัญชีใช้งาน:</p>
                <div className="grid grid-cols-1 gap-2">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleQuickLogin(user)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        currentUser.email === user.email
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-800 leading-tight">{user.name}</p>
                          <p className="text-[11px] text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <span className="text-[12px] font-bold text-emerald-600">
                        {currentUser.email === user.email ? '✓ กำลังใช้งาน' : 'สลับบัญชี'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Log out button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-[13px] transition-colors cursor-pointer"
                >
                  ออกจากระบบ
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[13px] transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          ) : (
            /* Not logged in state: Gmail / iCloud sign in */
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-[20px] font-bold text-slate-800">เข้าสู่ระบบเพื่อบันทึกสุขภาพ</h3>
                <p className="text-[13px] text-slate-500">
                  เข้าใช้งานผ่านเว็บบราวเซอร์ได้ทันที ไม่ต้องติดตั้งแอป ซิงค์ข้อมูลข้ามอุปกรณ์อัตโนมัติ
                </p>
              </div>

              {/* Provider Fast Login Buttons */}
              <div className="space-y-2.5">
                {/* Google / Gmail */}
                <button
                  onClick={() => handleQuickLogin(DEMO_USERS[0])}
                  disabled={isLoading}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-3 font-bold text-[14px] text-slate-700 shadow-2xs transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>เข้าสู่ระบบด้วย Google (Gmail)</span>
                </button>

                {/* Apple / iCloud */}
                <button
                  onClick={() => handleQuickLogin(DEMO_USERS[1])}
                  disabled={isLoading}
                  className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-center gap-3 font-bold text-[14px] shadow-2xs transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.65-.79 1.09-1.89.97-2.99-.94.04-2.07.63-2.74 1.41-.59.68-1.11 1.8-1 2.89 1.05.08 2.12-.52 2.77-1.31z"/>
                  </svg>
                  <span>เข้าสู่ระบบด้วย Apple (iCloud)</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[12px] font-semibold text-slate-400 uppercase tracking-wider relative">
                  หรือกรอกอีเมลของคุณ
                </span>
              </div>

              {/* Custom Email Form */}
              <form onSubmit={handleCustomLogin} className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('google')}
                    className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                      authMethod === 'google'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Gmail
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('apple')}
                    className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                      authMethod === 'apple'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    iCloud Mail
                  </button>
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder={authMethod === 'google' ? 'เช่น yourname@gmail.com' : 'เช่น yourname@icloud.com'}
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="ชื่อผู้ใช้งาน (ตัวเลือก)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !customEmail}
                  className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl text-[14px] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบและเริ่มใช้งาน'}
                </button>
              </form>

              {statusMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-[12px] flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
