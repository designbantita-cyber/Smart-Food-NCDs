import React, { useState } from 'react';
import { Progress14DayData, HealthProfile } from '../types';
import { INITIAL_14DAY_PROGRESS } from '../mockData';

interface Progress14DayScreenProps {
  progressData: Progress14DayData;
  profile: HealthProfile;
  onUpdateProgress: (data: Progress14DayData) => void;
  onBackToDashboard: () => void;
}

export const Progress14DayScreen: React.FC<Progress14DayScreenProps> = ({
  progressData = INITIAL_14DAY_PROGRESS,
  profile,
  onUpdateProgress,
  onBackToDashboard,
}) => {
  const [currentWeight, setCurrentWeight] = useState<number | string>(progressData.day14.weight || 68.5);
  const [currentHeight, setCurrentHeight] = useState<number | string>(progressData.day14.height || profile.height || 170);
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState<Progress14DayData>(progressData);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const numWeight = parseFloat(String(currentWeight)) || 68.5;
    const numHeight = parseFloat(String(currentHeight)) || 170;

    try {
      const response = await fetch('/api/14day-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day1Weight: data.day1.weight,
          currentWeight: numWeight,
          height: numHeight,
          userProfile: profile,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        onUpdateProgress(result);
      } else {
        throw new Error('Fallback local update');
      }
    } catch {
      // Local calculation
      const hM = numHeight / 100;
      const currentBmi = parseFloat((numWeight / (hM * hM)).toFixed(1));
      const weightDiff = parseFloat((numWeight - data.day1.weight).toFixed(1));
      const bmiDiff = parseFloat((currentBmi - data.day1.bmi).toFixed(1));

      let status = 'น้ำหนักปกติ';
      if (currentBmi < 18.5) status = 'น้ำหนักต่ำกว่าเกณฑ์';
      else if (currentBmi < 23.0) status = 'น้ำหนักปกติ';
      else if (currentBmi < 25.0) status = 'น้ำหนักเกิน (ท้วม)';
      else if (currentBmi < 30.0) status = 'โรคอ้วนระดับ 1';
      else status = 'โรคอ้วนระดับ 2';

      const updated: Progress14DayData = {
        ...data,
        day14: {
          ...data.day14,
          weight: numWeight,
          height: numHeight,
          bmi: currentBmi,
          bmiStatus: status,
        },
        weightChange: weightDiff,
        bmiChange: bmiDiff,
        summaryText: `คุณสามารถลดน้ำหนักได้ ${Math.abs(weightDiff)} กก. และค่า BMI ลดลง ${Math.abs(bmiDiff)} จุด ในช่วง 14 วันที่ผ่านมา พร้อมบันทึกอาหารอย่างสม่ำเสมอ`,
      };
      setData(updated);
      onUpdateProgress(updated);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = () => {
    window.print();
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  // SVG Line Chart coordinates math
  const points = data.historyPoints || [
    { day: 1, weight: 70.2, label: 'วันที่ 1' },
    { day: 4, weight: 69.8, label: 'วันที่ 4' },
    { day: 7, weight: 69.2, label: 'วันที่ 7' },
    { day: 11, weight: 68.9, label: 'วันที่ 11' },
    { day: 14, weight: 68.5, label: 'วันที่ 14' },
  ];
  const weights = points.map((p) => p.weight);
  const minW = Math.min(...weights) - 0.8;
  const maxW = Math.max(...weights) + 0.8;
  const range = maxW - minW || 1;

  const svgPoints = points.map((p, index) => {
    const x = 40 + (index / (points.length - 1)) * 420;
    const y = 140 - ((p.weight - minW) / range) * 100;
    return { x, y, point: p };
  });

  const pathD = svgPoints.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${svgPoints[svgPoints.length - 1].x} 165 L ${svgPoints[0].x} 165 Z`;

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-[13px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>กลับสู่หน้าแดชบอร์ด</span>
          </button>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-slate-800 tracking-tight">
            การประเมินผลและติดตามสุขภาพ 14 วัน
          </h1>
          <p className="text-[14px] text-slate-500 font-medium">
            เปรียบเทียบผลลัพธ์สุขภาพ (Day 1 vs Day 14) พร้อมคำแนะนำปรับพฤติกรรมเฉพาะบุคคล
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-2xl text-[13px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>พิมพ์ / บันทึกรายงาน</span>
          </button>

          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-2xl text-[13px] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>ครบ 14 วัน</span>
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Personal Recommendations (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Re-submission Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  อัปเดตข้อมูลเพื่อประเมินซ้ำ
                </span>
                <h3 className="text-[18px] font-bold text-slate-800">
                  กรอกข้อมูลสุขภาพล่าสุด (Day 14)
                </h3>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700" htmlFor="day14-weight">
                    น้ำหนักล่าสุด (กก.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="day14-weight"
                    type="number"
                    step="0.1"
                    required
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700" htmlFor="day14-height">
                    ส่วนสูงล่าสุด (ซม.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="day14-height"
                    type="number"
                    step="0.1"
                    required
                    value={currentHeight}
                    onChange={(e) => setCurrentHeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <button
                id="submit-14day-btn"
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-6 rounded-2xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isUpdating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>กำลังประเมินผลลัพธ์...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">analytics</span>
                    <span>คำนวณและประเมินผล 14 วัน</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Personalized Recommendations Categorized */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-[17px] font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">psychology</span>
              <span>คำแนะนำเฉพาะบุคคลสำหรับระยะถัดไป</span>
            </h3>

            {/* Diet Adjustments */}
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-1">
              <span className="text-[12px] font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">restaurant</span>
                <span>1. การปรับโภชนาการ (Diet Adjustments)</span>
              </span>
              <p className="text-[12px] text-emerald-800 leading-relaxed pl-5">
                รักษาขนาดส่วนบริโภคที่เหมาะสม ลดคาร์โบไฮเดรตเชิงเดี่ยวและน้ำตาลปรุงแต่งในอาหารทุกมื้อ
              </p>
            </div>

            {/* Activity Suggestions */}
            <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-1">
              <span className="text-[12px] font-bold text-blue-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">directions_run</span>
                <span>2. กิจกรรมทางกาย (Activity Suggestions)</span>
              </span>
              <p className="text-[12px] text-blue-800 leading-relaxed pl-5">
                เพิ่มการเดินสะสมให้ถึง 8,000-10,000 ก้าว/วัน ร่วมกับการออกกำลังกายสร้างกล้ามเนื้อเบาๆ 3 วัน/สัปดาห์
              </p>
            </div>

            {/* Continuous Health Monitoring */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-2xl space-y-1">
              <span className="text-[12px] font-bold text-amber-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-600">monitor_heart</span>
                <span>3. การเฝ้าระวังต่อเนื่อง (Continuous Monitoring)</span>
              </span>
              <p className="text-[12px] text-amber-800 leading-relaxed pl-5">
                บันทึกภาพอาหารด้วย AI สม่ำเสมอ และชั่งน้ำหนักในเวลาเดียวกันสัปดาห์ละ 1-2 ครั้ง
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Comparison Table, Metrics & SVG Trend Chart (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Day 1 vs Day 14 Comparison Matrix */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-[17px] font-bold text-slate-800">
              เปรียบเทียบผลลัพธ์สุขภาพ (Day 1 vs Day 14 Comparison)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Weight Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-bold text-slate-700">น้ำหนักตัว (Weight)</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[12px] font-black px-2.5 py-0.5 rounded-full">
                    {data.weightChange <= 0 ? `${data.weightChange} กก.` : `+${data.weightChange} กก.`}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">วันแรก (Day 1)</span>
                    <span className="text-[18px] font-bold text-slate-600">{data.day1.weight} กก.</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
                  <div className="text-right">
                    <span className="text-[11px] text-emerald-700 font-bold block">วันที่ 14</span>
                    <span className="text-[26px] font-black text-emerald-700 leading-none">{data.day14.weight} กก.</span>
                  </div>
                </div>
              </div>

              {/* BMI Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-bold text-slate-700">ดัชนีมวลกาย (BMI)</span>
                  <span className="bg-blue-100 text-blue-800 text-[12px] font-black px-2.5 py-0.5 rounded-full">
                    {data.bmiChange <= 0 ? `${data.bmiChange}` : `+${data.bmiChange}`}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">วันแรก (Day 1)</span>
                    <span className="text-[18px] font-bold text-slate-600">{data.day1.bmi}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
                  <div className="text-right">
                    <span className="text-[11px] text-blue-700 font-bold block">วันที่ 14</span>
                    <span className="text-[26px] font-black text-blue-700 leading-none">{data.day14.bmi}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Text Box */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-[13px] text-emerald-900 leading-relaxed">
              <strong className="block font-bold mb-1">สรุปความก้าวหน้า (Progress Summary):</strong>
              <p>{data.summaryText || 'ผลการปรับพฤติกรรมโภชนาการ 14 วัน ประสบความสำเร็จอย่างดีเยี่ยม น้ำหนักและดัชนีมวลกายลดลงอย่างปลอดภัย'}</p>
            </div>
          </div>

          {/* 14-Day Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[16px] font-bold text-slate-800">
                กราฟแนวโน้มน้ำหนักตัวตลอด 14 วัน
              </h3>
              <span className="text-[12px] text-slate-400">วัดผลเป็นระยะ</span>
            </div>

            <div className="relative w-full h-44 select-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 170">
                <defs>
                  <linearGradient id="chartGrad14" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="30" y1="35" x2="470" y2="35" stroke="#F1F5F9" />
                <line x1="30" y1="85" x2="470" y2="85" stroke="#F1F5F9" strokeDasharray="3,3" />
                <line x1="30" y1="140" x2="470" y2="140" stroke="#E2E8F0" />

                <path d={areaD} fill="url(#chartGrad14)" />
                <path d={pathD} fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />

                {svgPoints.map((pt, i) => (
                  <g key={i} className="cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredPoint === i ? 7 : 5}
                      fill="#ffffff"
                      stroke="#10B981"
                      strokeWidth={hoveredPoint === i ? 3.5 : 2.5}
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="transition-all duration-200"
                    />
                    <text x={pt.x} y="160" textAnchor="middle" fontSize="11" fill="#64748B" fontWeight="500">
                      {pt.point.label}
                    </text>
                    <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#10B981">
                      {pt.point.weight} kg
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Medical Disclaimer Box */}
          <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl text-[12px] text-amber-900 leading-relaxed flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-amber-600 shrink-0 mt-0.5">
              health_and_safety
            </span>
            <div>
              <strong className="font-bold block mb-0.5">ข้อควรระวังทางการแพทย์ (Medical Disclaimer):</strong>
              ระบบ AI นี้มีวัตถุประสงค์เพื่อส่งเสริมสุขภาวะและให้ข้อมูลด้านโภชนาการเท่านั้น ไม่ใช่การวินิจฉัยโรคทางการแพทย์ และห้ามใช้ทดแทนคำแนะนำของแพทย์ ห้ามปรับเปลี่ยนหรือหยุดยาประจำตัวด้วยตนเองเด็ดขาด
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
