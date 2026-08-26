import React, { useState } from 'react';
import { HealthProfile } from '../types';
import { calculateHealthMetrics } from '../mockData';
import { Logo } from './Logo';

interface InitialProfileScreenProps {
  profile: HealthProfile;
  onSaveProfile: (profile: HealthProfile) => void;
  onNavigateToDashboard: () => void;
}

export const InitialProfileScreen: React.FC<InitialProfileScreenProps> = ({
  profile,
  onSaveProfile,
  onNavigateToDashboard,
}) => {
  const [weight, setWeight] = useState<number | string>(profile.weight && profile.weight > 0 ? profile.weight : '');
  const [height, setHeight] = useState<number | string>(profile.height && profile.height > 0 ? profile.height : '');
  const [age, setAge] = useState<number | string>(profile.age || 35);
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender || 'female');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active'>(
    profile.activityLevel || 'light'
  );
  const [diseases, setDiseases] = useState<string>(profile.diseases || '');
  const [medications, setMedications] = useState<string>(profile.medications || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState<HealthProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when profile changes
  React.useEffect(() => {
    setWeight(profile.weight && profile.weight > 0 ? profile.weight : '');
    setHeight(profile.height && profile.height > 0 ? profile.height : '');
    setAge(profile.age || 35);
    setGender(profile.gender || 'female');
    setActivityLevel(profile.activityLevel || 'light');
    setDiseases(profile.diseases || '');
    setMedications(profile.medications || '');
    setCalculatedResult(profile);
  }, [profile]);

  const handleSaveAndCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setSaveSuccess(false);

    const numWeight = parseFloat(String(weight)) || 65;
    const numHeight = parseFloat(String(height)) || 170;
    const numAge = parseInt(String(age), 10) || 40;

    try {
      const response = await fetch('/api/health-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: numWeight,
          height: numHeight,
          age: numAge,
          gender,
          activityLevel,
          diseases,
          medications,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updated: HealthProfile = {
          ...profile,
          ...data,
          age: numAge,
          gender,
          activityLevel,
          initialWeight: profile.initialWeight || numWeight,
          initialBmi: profile.initialBmi || data.bmi,
        };
        setCalculatedResult(updated);
        onSaveProfile(updated);
      } else {
        throw new Error('Fallback calculation');
      }
    } catch {
      // Local fallback calculation
      const metrics = calculateHealthMetrics(
        numWeight,
        numHeight,
        numAge,
        gender,
        activityLevel,
        diseases,
        medications
      );
      const updated: HealthProfile = {
        ...profile,
        ...metrics as HealthProfile,
        initialWeight: profile.initialWeight || numWeight,
        initialBmi: profile.initialBmi || (metrics.bmi || 22.5),
      };
      setCalculatedResult(updated);
      onSaveProfile(updated);
    } finally {
      setIsAnalyzing(false);
      setSaveSuccess(true);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto py-6 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Health Information Form */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Logo size="md" />
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                Health Assessment
              </span>
            </div>
            <h1 className="text-[26px] sm:text-[32px] font-bold text-slate-800 tracking-tight">
              ข้อมูลสุขภาพและคำนวณ BMI
            </h1>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              กรอกข้อมูลสุขภาพเพื่อคำนวณดัชนีมวลกาย (BMI) และประมาณการความต้องการพลังงานต่อวัน (TDEE) เฉพาะบุคคล
            </p>
          </div>

          <form
            onSubmit={handleSaveAndCalculate}
            className="space-y-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm"
          >
            {/* Weight and Height */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700" htmlFor="prof-weight">
                  น้ำหนัก (กก.) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    monitor_weight
                  </span>
                  <input
                    id="prof-weight"
                    type="number"
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="เช่น 65"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700" htmlFor="prof-height">
                  ส่วนสูง (ซม.) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    height
                  </span>
                  <input
                    id="prof-height"
                    type="number"
                    step="0.1"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="เช่น 170"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700" htmlFor="prof-age">
                  อายุ (ปี) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    cake
                  </span>
                  <input
                    id="prof-age"
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="เช่น 40"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
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

            {/* Daily Activity Level */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700">
                ระดับกิจกรรมในแต่ละวัน (Activity Level)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'sedentary', label: 'นั่งทำงานอยู่กับที่', desc: 'ไม่ออกกำลังกาย', icon: 'weekend' },
                  { id: 'light', label: 'กิจกรรมเบาๆ', desc: 'เดิน/ขยับตัวบ้าง 1-3 วัน/สัปดาห์', icon: 'directions_walk' },
                  { id: 'moderate', label: 'ปานกลาง', desc: 'ออกกำลังกาย 3-5 วัน/สัปดาห์', icon: 'fitness_center' },
                  { id: 'active', label: 'หนัก / ใช้แรงงาน', desc: 'ออกกำลังกาย 6-7 วัน/สัปดาห์', icon: 'sprint' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivityLevel(act.id as any)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      activityLevel === act.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-emerald-600 shrink-0">
                      {act.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold truncate">{act.label}</p>
                      <p className="text-[10px] text-slate-500 truncate">{act.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Underlying Diseases */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700" htmlFor="prof-diseases">
                โรคประจำตัว (Underlying Diseases)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-[20px]">
                  medical_information
                </span>
                <textarea
                  id="prof-diseases"
                  rows={2}
                  value={diseases}
                  onChange={(e) => setDiseases(e.target.value)}
                  placeholder="เช่น เบาหวานชนิดที่ 2, ความดันโลหิตสูง, ไขมันในเลือดสูง หรือ ไม่มี"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['เบาหวาน', 'ความดันโลหิตสูง', 'ไขมันสูง', 'โรคไต', 'ไม่มีโรคประจำตัว'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (tag === 'ไม่มีโรคประจำตัว') {
                        setDiseases('ไม่มี');
                      } else if (!diseases.includes(tag)) {
                        setDiseases(diseases && diseases !== 'ไม่มี' ? `${diseases}, ${tag}` : tag);
                      }
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Regular Medications */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-700" htmlFor="prof-meds">
                ยาที่ใช้ประจำ (Regular Medications)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-[20px]">
                  vaccines
                </span>
                <textarea
                  id="prof-meds"
                  rows={2}
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="เช่น ยาลดน้ำตาล Metformin, ยาลดความดัน Amlodipine หรือ ไม่มี"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Action Save Button */}
            <button
              id="save-health-info-btn"
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-6 rounded-xl font-bold text-[15px] transition-all duration-300 mt-4 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>กำลังคำนวณและบันทึกข้อมูล...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  <span>บันทึกข้อมูลสุขภาพ (Save Health Information)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Calculated Results & Personal Calorie Goals */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main BMI Result Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                  ผลการคำนวณ BMI
                </span>
                <h2 className="text-[20px] font-bold text-slate-800">
                  ดัชนีมวลกาย (Body Mass Index)
                </h2>
              </div>
              <div className="bg-emerald-500 text-white font-bold px-3 py-1 rounded-full text-[12px] flex items-center gap-1.5 shadow-2xs">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{calculatedResult.bmiStatus}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-[48px] font-black text-emerald-600 tracking-tight leading-none">
                {calculatedResult.bmi}
              </span>
              <span className="text-[16px] text-slate-500 font-medium">kg/m²</span>
            </div>

            {/* Scale visual bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-400" style={{ width: '22%' }} title="ผอม (<18.5)"></div>
                <div className="h-full bg-emerald-500" style={{ width: '28%' }} title="ปกติ (18.5-22.9)"></div>
                <div className="h-full bg-amber-400" style={{ width: '20%' }} title="ท้วม (23-24.9)"></div>
                <div className="h-full bg-rose-500" style={{ width: '30%' }} title="อ้วน (≥25)"></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>&lt; 18.5 ผอม</span>
                <span className="text-emerald-700 font-bold">18.5 - 22.9 ปกติ</span>
                <span>23 - 24.9 ท้วม</span>
                <span>&ge; 25 อ้วน</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[13px] text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">health_and_safety</span>
                <span>การแปลผลสุขภาพ (Health Interpretation)</span>
              </p>
              <p>{calculatedResult.bmiInterpretation || 'ดัชนีมวลกายอยู่ในเกณฑ์มาตรฐานสมส่วน มีความเสี่ยงต่อโรค NCD ในระดับต่ำ'}</p>
            </div>
          </div>

          {/* Daily Energy Requirement (TDEE & Meal Breakdown) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                  พลังงานที่แนะนำต่อวัน (TDEE)
                </span>
                <h3 className="text-[18px] font-bold text-slate-800">
                  เป้าหมายแคลอรี่และสัดส่วนต่อมื้อ
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[28px] font-black text-slate-800 leading-none">
                  {calculatedResult.targetCalories.toLocaleString()}
                </span>
                <span className="text-[12px] text-slate-500 block">kcal / วัน</span>
              </div>
            </div>

            {/* Meals breakdown: 3 meals */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[11px] font-bold text-blue-800 uppercase">มื้อเช้า (~28%)</span>
                <p className="text-[20px] font-black text-blue-900">{calculatedResult.mealPlan.breakfast}</p>
                <span className="text-[11px] text-slate-500">kcal</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase">มื้อกลางวัน (~38%)</span>
                <p className="text-[20px] font-black text-emerald-900">{calculatedResult.mealPlan.lunch}</p>
                <span className="text-[11px] text-slate-500">kcal</span>
              </div>

              <div className="bg-amber-50/70 border border-amber-100 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[11px] font-bold text-amber-800 uppercase">มื้อเย็น (~34%)</span>
                <p className="text-[20px] font-black text-amber-900">{calculatedResult.mealPlan.dinner}</p>
                <span className="text-[11px] text-slate-500">kcal</span>
              </div>
            </div>

            {/* Special NCD Guidance Notes */}
            <div className="space-y-2 pt-1">
              <p className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">tips_and_updates</span>
                <span>คำแนะนำเฉพาะบุคคลสำหรับโรคไม่ติดต่อเรื้อรัง (NCDs)</span>
              </p>
              <ul className="space-y-1.5 text-[12px] text-slate-600">
                {(calculatedResult.ncdSpecialNotes || [
                  'ควบคุมคาร์โบไฮเดรตเชิงเดี่ยว เพื่อรักษาระดับน้ำตาลในเลือดให้คงที่',
                  'จำกัดปริมาณโซเดียมไม่เกิน 2,000 มก./วัน เพื่อป้องกันความดันโลหิตสูง',
                  'แบ่งพลังงานออกเป็น 3 มื้อหลักที่สมดุล หลีกเลี่ยงของว่างรสหวานจัด'
                ]).map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-500 shrink-0 mt-0.5">
                      check
                    </span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Medical Disclaimer Banner */}
            <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0 mt-0.5">
                warning
              </span>
              <span>
                <strong>ข้อควรระวัง:</strong> คำแนะนำนี้เป็นข้อมูลด้านโภชนาการเบื้องต้นเท่านั้น ห้ามปรับหรือหยุดยาที่แพทย์สั่งเองโดยเด็ดขาด หากมีข้อสงสัยโปรดปรึกษาแพทย์ประจำตัว
              </span>
            </div>

            {/* Proceed to Dashboard CTA */}
            <button
              id="proceed-to-dashboard-btn"
              onClick={onNavigateToDashboard}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-6 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>ไปที่แดชบอร์ดสุขภาพ (Go to Dashboard)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
