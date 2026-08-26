import React, { useState } from 'react';
import { DailyHealthData, HealthProfile } from '../types';
import { IMAGES } from '../mockData';

interface DailyDashboardScreenProps {
  dailyData: DailyHealthData;
  profile: HealthProfile;
  onNavigateToMealAnalysis: () => void;
  onNavigateTo14Day: () => void;
  onNavigateToHealthProfile: () => void;
  onUpdateDailyData: (data: DailyHealthData) => void;
  onUpdateProfile: (profile: HealthProfile) => void;
}

export const DailyDashboardScreen: React.FC<DailyDashboardScreenProps> = ({
  dailyData,
  profile,
  onNavigateToMealAnalysis,
  onNavigateTo14Day,
  onNavigateToHealthProfile,
  onUpdateDailyData,
  onUpdateProfile,
}) => {
  const [water, setWater] = useState(dailyData.waterIntakeLiters || 1.8);
  const [currentDay, setCurrentDay] = useState(profile.currentDay || 7);

  const targetCalories = profile.targetCalories || 2100;
  const consumed = dailyData.consumedCalories || 1450;
  const remaining = Math.max(0, targetCalories - consumed);
  const progressPercent = Math.min(100, Math.round((consumed / targetCalories) * 100));

  // Calculations for Health Progress
  const initialWeight = profile.initialWeight || 70.2;
  const currentWeight = profile.weight || 68.5;
  const weightChange = parseFloat((currentWeight - initialWeight).toFixed(1));

  const initialBmi = profile.initialBmi || 24.3;
  const currentBmi = profile.bmi || 23.7;
  const bmiChange = parseFloat((currentBmi - initialBmi).toFixed(1));

  // Circular progress math (radius = 40)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  const handleAddWater = (delta: number) => {
    const newWater = parseFloat(Math.max(0, water + delta).toFixed(1));
    setWater(newWater);
    onUpdateDailyData({ ...dailyData, waterIntakeLiters: newWater });
  };

  const handleSelectDay = (day: number) => {
    setCurrentDay(day);
    onUpdateProfile({ ...profile, currentDay: day });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      {/* Top Welcome & Analyze Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
              Personal Health Dashboard
            </span>
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-slate-800 tracking-tight mt-0.5">
            ภาพรวมสุขภาพและการบริโภค
          </h1>
          <p className="text-[13px] text-slate-500 font-medium">
            {dailyData.date} • ติดตามการดูแลสุขภาพรายวันสำหรับโรค NCD
          </p>
        </div>

        {/* B. Food Analysis Primary CTA Button */}
        <div className="flex items-center gap-3">
          <button
            id="dashboard-analyze-food-btn"
            onClick={onNavigateToMealAnalysis}
            className="bg-[#10B981] text-white hover:bg-[#059669] px-6 py-3.5 rounded-2xl text-[15px] font-bold shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">camera_enhance</span>
            <span>วิเคราะห์มื้ออาหารของฉัน (Analyze My Food)</span>
          </button>
        </div>
      </div>

      {/* Grid: Health Summary (A) + Health Progress (C) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Health Summary Bento (Col 7) */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">vital_signs</span>
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-slate-800">A. สรุปข้อมูลสุขภาพ (Health Summary)</h2>
                <p className="text-[12px] text-slate-500">เกณฑ์สุขภาพและแคลอรี่เป้าหมายประจำวัน</p>
              </div>
            </div>
            <button
              onClick={onNavigateToHealthProfile}
              className="text-[12px] font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>แก้ไขข้อมูล</span>
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </button>
          </div>

          {/* 4-Stat Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Weight */}
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase">น้ำหนักปัจจุบัน</span>
              <p className="text-[22px] font-black text-slate-800 mt-1">{currentWeight} <span className="text-[12px] font-normal text-slate-500">กก.</span></p>
            </div>

            {/* Height */}
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase">ส่วนสูง</span>
              <p className="text-[22px] font-black text-slate-800 mt-1">{profile.height} <span className="text-[12px] font-normal text-slate-500">ซม.</span></p>
            </div>

            {/* BMI */}
            <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">ค่า BMI</span>
              <p className="text-[22px] font-black text-emerald-700 mt-1">{currentBmi}</p>
            </div>

            {/* BMI Category */}
            <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">สถานะเกณฑ์</span>
              <p className="text-[13px] font-bold text-emerald-800 truncate mt-1">{profile.bmiStatus}</p>
            </div>
          </div>

          {/* Calorie Goals Breakdown (Daily & Per Meal) */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-500">local_fire_department</span>
                <span className="text-[13px] font-bold text-slate-700">พลังงานแนะนำต่อวัน</span>
              </div>
              <span className="text-[18px] font-black text-slate-800">{targetCalories.toLocaleString()} <span className="text-[12px] font-normal text-slate-500">kcal/วัน</span></span>
            </div>

            {/* Approximate calories per meal */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-center">
                <span className="text-[11px] font-semibold text-blue-700 block">มื้อเช้า</span>
                <span className="text-[15px] font-bold text-slate-800">{profile.mealPlan.breakfast}</span>
                <span className="text-[10px] text-slate-400 block">kcal</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-center">
                <span className="text-[11px] font-semibold text-emerald-700 block">มื้อกลางวัน</span>
                <span className="text-[15px] font-bold text-slate-800">{profile.mealPlan.lunch}</span>
                <span className="text-[10px] text-slate-400 block">kcal</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-center">
                <span className="text-[11px] font-semibold text-amber-700 block">มื้อเย็น</span>
                <span className="text-[15px] font-bold text-slate-800">{profile.mealPlan.dinner}</span>
                <span className="text-[10px] text-slate-400 block">kcal</span>
              </div>
            </div>
          </div>
        </section>

        {/* C. Health Progress Bento (Col 5) */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-slate-800">C. ความก้าวหน้าสุขภาพ (Health Progress)</h2>
                <p className="text-[12px] text-slate-500">เปรียบเทียบน้ำหนัก & ค่า BMI ตั้งแต่วันแรก</p>
              </div>
            </div>
          </div>

          {/* Weight Comparison */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">น้ำหนักเริ่มต้น</span>
              <span className="text-[17px] font-bold text-slate-700 mt-0.5 block">{initialWeight} กก.</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">น้ำหนักปัจจุบัน</span>
              <span className="text-[17px] font-bold text-slate-800 mt-0.5 block">{currentWeight} กก.</span>
            </div>

            <div className={`p-3 rounded-2xl border ${weightChange <= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              <span className="text-[11px] font-medium block">การเปลี่ยนแปลง</span>
              <span className="text-[17px] font-black mt-0.5 block">
                {weightChange > 0 ? `+${weightChange}` : weightChange} กก.
              </span>
            </div>
          </div>

          {/* BMI Comparison */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">BMI เริ่มต้น</span>
              <span className="text-[17px] font-bold text-slate-700 mt-0.5 block">{initialBmi}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">BMI ปัจจุบัน</span>
              <span className="text-[17px] font-bold text-slate-800 mt-0.5 block">{currentBmi}</span>
            </div>

            <div className={`p-3 rounded-2xl border ${bmiChange <= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              <span className="text-[11px] font-medium block">BMI เปลี่ยนไป</span>
              <span className="text-[17px] font-black mt-0.5 block">
                {bmiChange > 0 ? `+${bmiChange}` : bmiChange}
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-[12px] text-emerald-900 leading-relaxed flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
            <span>ความก้าวหน้าของคุณอยู่ในเกณฑ์ดีต่อเนื่อง ช่วยลดความเสี่ยงภาวะแทรกซ้อน NCDs</span>
          </div>
        </section>
      </div>

      {/* D. 14-Day Progress Tracker Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-800">
                D. การติดตามสุขภาพ 14 วัน (14-Day Progress Tracker)
              </h2>
              <p className="text-[12px] text-slate-500">
                ระบบนับวันอัตโนมัตินับจากวันที่บันทึกข้อมูลสุขภาพเริ่มต้น
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[13px] font-bold">
              วันที่ {currentDay} จาก 14 วัน (Day {currentDay} of 14)
            </span>
            <button
              onClick={onNavigateTo14Day}
              className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-[13px] font-bold transition-all cursor-pointer"
            >
              ดูรายงาน 14 วัน
            </button>
          </div>
        </div>

        {/* 14-Day Interactive Node Strip */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[12px] font-medium text-slate-500">
            <span>เริ่มต้น (Day 1)</span>
            <span className="font-bold text-amber-700">ความคืบหน้า {Math.round((currentDay / 14) * 100)}%</span>
            <span>ครบกำหนดประเมิน (Day 14)</span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentDay / 14) * 100}%` }}
            ></div>
          </div>

          {/* Days pill buttons */}
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pt-2">
            {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`py-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                  day === currentDay
                    ? 'bg-amber-500 text-white shadow-xs scale-105'
                    : day < currentDay
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
                }`}
                title={`วันที่ ${day} จาก 14`}
              >
                D{day}
              </button>
            ))}
          </div>
        </div>

        {/* Day 14 Follow-up prompt banner if on Day 14 */}
        {currentDay >= 14 && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-[26px]">celebration</span>
              <div>
                <p className="font-bold text-emerald-900 text-[14px]">ครบกำหนดตรวจติดตามสุขภาพ 14 วันแล้ว!</p>
                <p className="text-[12px] text-emerald-700">คลิกเพื่อกรอกน้ำหนักล่าสุดและรับรายงานเปรียบเทียบผลลัพธ์</p>
              </div>
            </div>
            <button
              onClick={onNavigateTo14Day}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-[13px] shadow-xs cursor-pointer shrink-0"
            >
              เปิดหน้าประเมิน 14 วัน
            </button>
          </div>
        )}
      </section>

      {/* Daily Nutrition Balance & Calorie Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calorie Ring */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-between shadow-sm">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-slate-800">การบริโภคแคลอรี่วันนี้</h3>
            <span className="text-[12px] font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
              {progressPercent}% ของเป้าหมาย
            </span>
          </div>

          <div className="relative w-44 h-44 my-4 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-slate-100 stroke-current"
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                strokeWidth="8"
              />
              <circle
                className="text-[#10B981] stroke-current"
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-[34px] font-black text-slate-800 leading-none">
                {consumed.toLocaleString()}
              </span>
              <span className="text-[12px] font-medium text-slate-500 mt-1">kcal ที่ทานไป</span>
            </div>
          </div>

          <div className="flex justify-between w-full pt-3 border-t border-slate-100 px-4">
            <div className="text-center">
              <span className="text-[11px] font-medium text-slate-400">เป้าหมาย</span>
              <p className="text-[16px] font-bold text-slate-800">{targetCalories.toLocaleString()} kcal</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
              <span className="text-[11px] font-medium text-slate-400">คงเหลือ</span>
              <p className="text-[16px] font-bold text-emerald-600">{remaining.toLocaleString()} kcal</p>
            </div>
          </div>
        </section>

        {/* Water & Habits */}
        <section className="lg:col-span-6 grid grid-cols-2 gap-4">
          {/* Water */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">water_drop</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAddWater(-0.25)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => handleAddWater(0.25)}
                  className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">ดื่มน้ำวันนี้</span>
              <p className="text-[24px] font-black text-slate-800 mt-0.5">{water} <span className="text-[13px] font-normal text-slate-500">ลิตร</span></p>
              <span className="text-[11px] text-blue-600 font-medium">เป้าหมาย 2.5 ลิตร</span>
            </div>
          </div>

          {/* Activity / Steps */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">directions_walk</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">กิจกรรมการเดิน</span>
              <p className="text-[24px] font-black text-slate-800 mt-0.5">{dailyData.steps.toLocaleString()} <span className="text-[13px] font-normal text-slate-500">ก้าว</span></p>
              <span className="text-[11px] text-emerald-600 font-medium">เป้าหมาย 8,000 ก้าว</span>
            </div>
          </div>

          {/* Quick food scan card */}
          <div className="col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <h4 className="font-bold text-[16px]">บันทึกมื้ออาหารวันนี้</h4>
              <p className="text-[12px] text-white/85 mt-0.5">ถ่ายภาพหรืออัปโหลดให้อาหาร AI วิเคราะห์แคลอรี่</p>
            </div>
            <button
              onClick={onNavigateToMealAnalysis}
              className="bg-white text-emerald-800 font-bold px-4 py-2.5 rounded-xl text-[13px] hover:bg-emerald-50 transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
              <span>ถ่ายรูปอาหาร</span>
            </button>
          </div>
        </section>
      </div>

      {/* Logged Meals List */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-[17px] font-bold text-slate-800">รายการอาหารที่บันทึกวันนี้</h3>
          <button
            onClick={onNavigateToMealAnalysis}
            className="text-[13px] font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ วิเคราะห์เพิ่ม</span>
          </button>
        </div>

        {dailyData.recentMeals && dailyData.recentMeals.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {dailyData.recentMeals.map((meal) => (
              <div key={meal.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={meal.imageUrl || IMAGES.padThai}
                    alt={meal.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-[15px] text-slate-800">{meal.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-slate-500 font-medium">{meal.time}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                        {meal.tag}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-black text-slate-800">{meal.calories}</span>
                  <span className="text-[11px] text-slate-400 block">kcal</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">restaurant</span>
            </div>
            <div className="space-y-1">
              <p className="text-[14px] font-bold text-slate-700">ยังไม่มีรายการอาหารที่บันทึกสำหรับวันนี้</p>
              <p className="text-[12px] text-slate-500 max-w-[360px] mx-auto">
                ถ่ายรูปอาหารหรือพิมพ์ชื่ออาหารเพื่อวิเคราะห์แคลอรี่และสารอาหารสำหรับมื้อแรกของคุณ
              </p>
            </div>
            <button
              onClick={onNavigateToMealAnalysis}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] shadow-2xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
              <span>บันทึกอาหารมื้อแรก</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
