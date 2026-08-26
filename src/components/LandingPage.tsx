import React from 'react';
import { Logo } from './Logo';
import { IMAGES } from '../mockData';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onDirectExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onRegister,
  onDirectExplore,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-[1280px] mx-auto py-8 md:py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-bold">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">health_and_safety</span>
              <span>AI Health & Nutrition Assistant</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Logo size="lg" />
              </div>
              <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] font-black text-slate-800 tracking-tight leading-[1.15]">
                ผู้ช่วยโภชนาการและสุขภาพ AI <br className="hidden sm:inline" />
                <span className="text-emerald-600">ดูแลโรค NCDs อย่างมั่นใจ</span>
              </h1>
              <p className="text-[16px] sm:text-[18px] text-slate-600 leading-relaxed max-w-[620px]">
                ระบบช่วยคุณประเมินค่าดัชนีมวลกาย (BMI), คำนวณความต้องการพลังงานต่อวัน (TDEE), วิเคราะห์ภาพถ่ายอาหารด้วย AI เพื่อประเมินแคลอรี่และสารอาหาร พร้อมระบบติดตามผลสุขภาพ 14 วัน
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="landing-get-started-btn"
                onClick={onGetStarted}
                className="bg-[#10B981] hover:bg-[#059669] text-white px-7 py-3.5 rounded-2xl font-bold text-[16px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>เริ่มใช้งานทันที (Get Started)</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <button
                id="landing-register-btn"
                onClick={onRegister}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-2xl font-bold text-[15px] transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-500">person_add</span>
                <span>สมัครสมาชิก (Register)</span>
              </button>

              <button
                id="landing-login-btn"
                onClick={onLogin}
                className="text-slate-600 hover:text-emerald-700 px-4 py-3.5 font-bold text-[15px] transition-colors cursor-pointer"
              >
                เข้าสู่ระบบ (Login)
              </button>
            </div>

            {/* Fast direct test link */}
            <div className="pt-2 flex items-center gap-2 text-[13px] text-slate-500">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>ใช้งานผ่านเว็บบราวเซอร์ได้ทันที ไม่ต้องติดตั้งแอป • รองรับการซิงค์ด้วย Gmail & iCloud</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Card (Interactive Preview Bento) */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5 overflow-hidden">
              {/* Header card preview */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <span className="material-symbols-outlined text-[24px]">restaurant</span>
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-800">วิเคราะห์อาหารด้วย AI</h2>
                    <p className="text-[12px] text-slate-500">สแกนภาพถ่ายและประเมินสารอาหารทันที</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  AI พร้อมใช้งาน
                </span>
              </div>

              {/* Image & Scan preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200/80">
                <img
                  src={IMAGES.padThai}
                  alt="อาหารตัวอย่าง"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">ตรวจพบเมนู</p>
                      <h3 className="text-[17px] font-bold">ผัดไทยกุ้งสด</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[20px] font-black text-emerald-400 leading-none">550</p>
                      <p className="text-[10px] text-white/80">kcal</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Macronutrient preview */}
              <div className="grid grid-cols-3 gap-2 text-center text-[12px]">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 font-medium">คาร์บ</p>
                  <p className="font-bold text-slate-800 text-[14px]">65g</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 font-medium">โปรตีน</p>
                  <p className="font-bold text-slate-800 text-[14px]">25g</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-500 font-medium">ไขมัน</p>
                  <p className="font-bold text-slate-800 text-[14px]">22g</p>
                </div>
              </div>

              <button
                onClick={onDirectExplore}
                className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>ทดลองใช้งานระบบโดยตรง (Explore Demo)</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="w-full bg-white border-y border-slate-200 py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="text-center max-w-[700px] mx-auto space-y-2">
            <h2 className="text-[26px] md:text-[32px] font-bold text-slate-800">
              ฟังก์ชันหลักเพื่อการดูแลสุขภาพที่ครบวงจร
            </h2>
            <p className="text-[15px] text-slate-500">
              ออกแบบขึ้นตามหลักโภชนาการสำหรับโรคไม่ติดต่อเรื้อรัง (NCDs) ให้คุณทานอาหารได้อย่างมั่นใจ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">monitor_weight</span>
              </div>
              <h3 className="text-[17px] font-bold text-slate-800">1. คำนวณ BMI & TDEE</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                ประเมินดัชนีมวลกายและความต้องการพลังงานต่อวันส่วนบุคคล พร้อมแบ่งสัดส่วนแคลอรี่ 3 มื้อที่เหมาะสม
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">camera_enhance</span>
              </div>
              <h3 className="text-[17px] font-bold text-slate-800">2. ถ่ายรูปวิเคราะห์อาหาร AI</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                ถ่ายรูปหรืออัปโหลดภาพอาหาร AI จะประเมินแคลอรี่ คาร์โบไฮเดรต โปรตีน ไขมัน โซเดียม และน้ำตาลทันที
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">monitoring</span>
              </div>
              <h3 className="text-[17px] font-bold text-slate-800">3. ติดตามผลสุขภาพ 14 วัน</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                บันทึกและเปรียบเทียบการเปลี่ยนแปลงของน้ำหนักและค่า BMI ต่อเนื่อง 14 วัน พร้อมกราฟแสดงแนวโน้ม
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">medical_services</span>
              </div>
              <h3 className="text-[17px] font-bold text-slate-800">4. คำแนะนำสำหรับ NCDs</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                คำแนะนำที่สอดคล้องกับโรคประจำตัว (เบาหวาน ความดัน ไขมัน โรคไต) เพื่อการควบคุมอาหารที่ปลอดภัย
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Medical Disclaimer Banner */}
      <section className="w-full max-w-[1280px] mx-auto py-10 px-4 md:px-8">
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div className="space-y-1 text-[13px] text-amber-900 leading-relaxed">
            <p className="font-bold text-[14px]">ข้อตกลงและคำชี้แจงความปลอดภัยทางการแพทย์ (AI Medical Safety)</p>
            <p>
              Smart Food NCD จัดทำขึ้นเพื่อเป็นผู้ช่วยแนะนำโภชนาการเบื้องต้นเท่านั้น มิใช่การวินิจฉัยโรค สั่งยา หรือปรับเปลี่ยนยาตามที่แพทย์สั่ง โปรดปฏิบัติตามคำสั่งแพทย์อย่างเคร่งครัด หากมีอาการผิดปกติหรือเจ็บป่วยรุนแรงควรปรึกษาแพทย์หรือบุคลากรทางการแพทย์โดยตรง
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
