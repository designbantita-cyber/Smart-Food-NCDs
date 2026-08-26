import React from 'react';
import { Logo } from './Logo';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-[640px] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-[#10B981] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <h2 className="font-bold text-[18px]">คู่มือและข้อมูลสุขภาพ NCD</h2>
              <p className="text-[12px] text-white/90">Smart Food NCD - AI Nutrition Guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-[18px] cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-[14px]">
          <div>
            <h3 className="font-bold text-[16px] text-emerald-600 flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <span>1. เกณฑ์ดัชนีมวลกาย (BMI) สำหรับคนเอเชีย</span>
            </h3>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-700">น้อยกว่า 18.5</span>
                <span className="font-semibold text-blue-600">ผอม / น้ำหนักต่ำกว่าเกณฑ์</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-700">18.5 - 22.9</span>
                <span className="font-semibold text-emerald-600">น้ำหนักปกติ (สมส่วน)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-700">23.0 - 24.9</span>
                <span className="font-semibold text-amber-600">น้ำหนักเกิน / ท้วม</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">25.0 ขึ้นไป</span>
                <span className="font-semibold text-rose-600">โรคอ้วน (เสี่ยง NCD สูง)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[16px] text-emerald-600 flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px]">nutrition</span>
              <span>2. หลักโภชนาการสำหรับกลุ่มโรค NCDs</span>
            </h3>
            <ul className="space-y-2 text-[13px] text-slate-600 list-disc pl-5">
              <li>
                <strong className="text-slate-800">ผู้ป่วยเบาหวาน:</strong> ควบคุมคาร์โบไฮเดรต เลือกข้าวกล้อง/ธัญพืชไม่ขัดสี ลดน้ำตาลปรุงรส
              </li>
              <li>
                <strong className="text-slate-800">ผู้ป่วยความดันโลหิตสูง:</strong> จำกัดโซเดียมไม่เกิน 2,000 มก./วัน ลดซดน้ำซุป น้ำแกง และน้ำจิ้ม
              </li>
              <li>
                <strong className="text-slate-800">ผู้ป่วยไขมันในเลือดสูง:</strong> หลีกเลี่ยงของทอด กะทิข้น เน้นต้ม นึ่ง อบ และไขมันดี เช่น ปลา อะโวคาโด
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[16px] text-emerald-600 flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
              <span>3. เข้าใช้งานผ่านเว็บได้ทันที (รองรับ Gmail และ iCloud)</span>
            </h3>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              คุณสามารถเปิดใช้งานผ่านเว็บบราวเซอร์บนมือถือ แท็บเล็ต หรือคอมพิวเตอร์ได้ทันทีเพียงกดลิงก์ และเข้าสู่ระบบด้วยบัญชี Google (Gmail) หรือ Apple (iCloud) เพื่อซิงค์บันทึกมื้ออาหาร การประเมินสุขภาพ 14 วัน และผลวิเคราะห์โภชนาการ AI ข้ามทุกอุปกรณ์อย่างปลอดภัย
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] transition-colors cursor-pointer shadow-xs"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
