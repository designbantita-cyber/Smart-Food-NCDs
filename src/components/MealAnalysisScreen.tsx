import React, { useState, useRef } from 'react';
import { MealAnalysisResult, HealthProfile } from '../types';
import { SAMPLE_PADTHAI_ANALYSIS, PRESET_SAMPLE_MEALS, IMAGES } from '../mockData';

const POPULAR_THAI_DISHES = [
  'ผัดกะเพราอกไก่ไข่ดาว',
  'ส้มตำไทย (หวานน้อย)',
  'แกงจืดเต้าหู้หมูสับ',
  'ต้มยำกุ้งน้ำใส',
  'สลัดอกไก่ย่าง',
  'ก๋วยเตี๋ยวน้ำใส',
  'ข้าวมันไก่เนื้อล้วน',
  'ข้าวผัดไข่ใส่ผัก',
];

interface MealAnalysisScreenProps {
  profile: HealthProfile;
  onSaveMealToLog: (meal: MealAnalysisResult) => void;
  onBackToDashboard: () => void;
}

export const MealAnalysisScreen: React.FC<MealAnalysisScreenProps> = ({
  profile,
  onSaveMealToLog,
  onBackToDashboard,
}) => {
  const [analysisResult, setAnalysisResult] = useState<MealAnalysisResult>(SAMPLE_PADTHAI_ANALYSIS);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'มื้อเช้า' | 'มื้อกลางวัน' | 'มื้อเย็น'>('มื้อกลางวัน');
  const [portionSize, setPortionSize] = useState('1 จานปกติ (~350 กรัม)');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Manual food name input states
  const [customFoodInput, setCustomFoodInput] = useState('');
  const [isEditingDishName, setIsEditingDishName] = useState(false);
  const [editedDishName, setEditedDishName] = useState('');
  const [inputError, setInputError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);

  // Recommended calories for current selected meal
  const recommendedMealCalories =
    selectedMealType === 'มื้อเช้า'
      ? profile.mealPlan?.breakfast || 550
      : selectedMealType === 'มื้อกลางวัน'
      ? profile.mealPlan?.lunch || 750
      : profile.mealPlan?.dinner || 650;

  // Evaluation status compared to recommended calories
  const getEvaluationStatus = (cal: number, target: number) => {
    const diff = cal - target;
    if (diff < -150) {
      return {
        label: 'ต่ำกว่าเกณฑ์ (Low)',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        color: 'text-blue-600',
      };
    }
    if (diff <= 80) {
      return {
        label: 'เหมาะสม (Appropriate)',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        color: 'text-emerald-600',
      };
    }
    if (diff <= 200) {
      return {
        label: 'สูงกว่าเกณฑ์เล็กน้อย (Slightly High)',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        color: 'text-amber-600',
      };
    }
    return {
      label: 'สูงเกินเกณฑ์ (High)',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      color: 'text-rose-600',
    };
  };

  const currentEval = getEvaluationStatus(analysisResult.calories, recommendedMealCalories);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await runAIAnalysis(base64, file.type, customFoodInput.trim() || undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (preset: typeof PRESET_SAMPLE_MEALS[0]) => {
    setIsScanning(true);
    setShowPresets(false);
    setCustomFoodInput(preset.name);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishHint: preset.name,
          userProfile: profile,
          mealType: selectedMealType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        data.imageUrl = preset.imageUrl;
        data.dishName = preset.name;
        setAnalysisResult(data);
      } else {
        throw new Error('Fallback to preset');
      }
    } catch {
      // Local preset fallback
      const updated: MealAnalysisResult = {
        ...preset.data,
        mealType: selectedMealType,
        recommendedMealCalories: recommendedMealCalories,
        mealPercentage: Math.round((preset.calories / recommendedMealCalories) * 100),
        analyzedAt: `วันนี้, ${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
      };
      setAnalysisResult(updated);
    } finally {
      setIsScanning(false);
    }
  };

  const runAIAnalysis = async (imageBase64?: string, mimeType?: string, nameHint?: string) => {
    setIsScanning(true);
    setSavedSuccess(false);
    setInputError('');

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64 || (nameHint ? analysisResult.imageUrl : analysisResult.imageUrl),
          mimeType: mimeType || 'image/jpeg',
          dishHint: nameHint || customFoodInput.trim() || analysisResult.dishName,
          userProfile: profile,
          mealType: selectedMealType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (imageBase64) data.imageUrl = imageBase64;
        setAnalysisResult(data);
        if (nameHint) {
          setCustomFoodInput(nameHint);
        }
      }
    } catch {
      // Retain state
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = customFoodInput.trim();
    if (!query) {
      setInputError('กรุณาพิมพ์ชื่ออาหารที่ต้องการวิเคราะห์');
      manualInputRef.current?.focus();
      return;
    }
    setInputError('');
    await runAIAnalysis(undefined, undefined, query);
  };

  const handleApplyInlineEdit = async () => {
    const newName = editedDishName.trim();
    if (!newName) {
      setIsEditingDishName(false);
      return;
    }
    setIsEditingDishName(false);
    setCustomFoodInput(newName);
    await runAIAnalysis(undefined, undefined, newName);
  };

  const handleSaveMeal = () => {
    onSaveMealToLog(analysisResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isUnrecognized = 
    analysisResult.isRecognized === false || 
    analysisResult.confidence === 'ไม่สามารถระบุได้' || 
    analysisResult.dishName?.includes('ไม่สามารถระบุ');

  const scrollToManualInput = () => {
    manualInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    manualInputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      {/* Hidden file & camera inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Top Header & Navigation */}
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
            วิเคราะห์มื้ออาหารด้วยภาพถ่าย AI
          </h1>
          <p className="text-[14px] text-slate-500 font-medium">
            AI ประเมินแคลอรี่ สารอาหารหลัก และความเหมาะสมตามเป้าหมายสุขภาพเฉพาะบุคคล
          </p>
        </div>

        {/* Meal Type Pills & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-full flex text-[13px] font-semibold text-slate-600">
            {(['มื้อเช้า', 'มื้อกลางวัน', 'มื้อเย็น'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMealType(type)}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedMealType === type
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            id="camera-capture-btn"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white px-3.5 py-2 rounded-xl transition-all text-[13px] font-bold cursor-pointer shadow-xs"
            title="ถ่ายภาพด้วยกล้อง"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            <span className="hidden sm:inline">ถ่ายรูปกล้อง</span>
          </button>

          <button
            id="upload-photo-btn"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-xl transition-all text-[13px] font-bold cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            <span>อัปโหลดรูป</span>
          </button>

          <button
            onClick={() => setShowPresets(!showPresets)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-all text-[13px] font-semibold cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
            <span>ตัวอย่างอาหาร</span>
          </button>
        </div>
      </div>

      {/* Preset Foods Sample Tray */}
      {showPresets && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-slate-800">
              เลือกตัวอย่างอาหารไทยเพื่อทดสอบการวิเคราะห์:
            </h3>
            <button
              onClick={() => setShowPresets(false)}
              className="text-slate-400 hover:text-slate-700 text-[18px] cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {PRESET_SAMPLE_MEALS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className="flex flex-col items-center p-2.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all text-center cursor-pointer group shadow-2xs"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 bg-slate-100">
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[12px] font-bold text-slate-800 line-clamp-1">{preset.name}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">{preset.calories} kcal</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drag and Drop Zone if active or empty */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-4 text-center transition-all ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/60'
            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <p className="text-[13px] text-slate-600 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-slate-400">cloud_upload</span>
          <span>ลากรูปภาพอาหารมาวางที่นี่ หรือคลิกปุ่มด้านบนเพื่อเลือกไฟล์ / ถ่ายรูป</span>
        </p>
      </div>

      {/* Manual Food Name Input Box (หาก AI ไม่สามารถวิเคราะห์ภาพได้ หรือต้องการระบุชื่ออาหารเอง) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </span>
            <div>
              <h3 className="text-[14px] font-bold text-slate-800">
                ระบุชื่ออาหารด้วยตนเอง (หากภาพไม่ชัด หรือ AI วิเคราะห์ไม่ตรง)
              </h3>
              <p className="text-[12px] text-slate-500">
                พิมพ์ชื่อเมนูอาหารที่รับประทานเพื่อให้ AI คำนวณแคลอรี่และโภชนาการสำหรับโรค NCD โดยเฉพาะ
              </p>
            </div>
          </div>
        </div>

        {/* Input Field & Submit Button */}
        <form onSubmit={handleManualAnalyze} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              ref={manualInputRef}
              type="text"
              value={customFoodInput}
              onChange={(e) => {
                setCustomFoodInput(e.target.value);
                if (inputError) setInputError('');
              }}
              placeholder="พิมพ์ชื่ออาหาร เช่น ข้าวผัดกะเพราอกไก่ไข่ดาว, ส้มตำไทย, ต้มยำกุ้งน้ำใส, แกงจืดเต้าหู้..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                inputError
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
              }`}
            />
            {customFoodInput && (
              <button
                type="button"
                onClick={() => setCustomFoodInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[16px] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="bg-[#10B981] hover:bg-[#059669] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            {isScanning ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>กำลังวิเคราะห์...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">magic_button</span>
                <span>วิเคราะห์ด้วยชื่อนี้</span>
              </>
            )}
          </button>
        </form>

        {inputError && (
          <p className="text-[12px] text-rose-600 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>{inputError}</span>
          </p>
        )}

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-slate-400">เมนูยอดนิยม:</span>
          {POPULAR_THAI_DISHES.map((dish) => (
            <button
              key={dish}
              type="button"
              onClick={() => {
                setCustomFoodInput(dish);
                runAIAnalysis(undefined, undefined, dish);
              }}
              className="text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
            >
              {dish}
            </button>
          ))}
        </div>
      </div>

      {/* If AI could not identify the food from image, show high-visibility fallback prompt */}
      {isUnrecognized && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">no_meals</span>
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-amber-950">
                  AI ไม่สามารถระบุเมนูอาหารจากภาพนี้ได้ชัดเจน
                </h3>
                <span className="text-[11px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                  พิมพ์ชื่อเพื่อคำนวณต่อ
                </span>
              </div>
              <p className="text-[13px] text-amber-900/80 mt-1 leading-relaxed">
                เนื่องจากมุมกล้อง แสง หรือความคมชัดของภาพไม่เพียงพอ <strong className="text-amber-950">กรุณาพิมพ์บอกชื่ออาหารที่คุณรับประทานด้านล่างนี้</strong> เพื่อให้ AI ช่วยคำนวณแคลอรี่และวิเคราะห์สารอาหารเฉพาะโรค NCD ให้คุณได้อย่างแม่นยำ
              </p>
            </div>
          </div>

          <form onSubmit={handleManualAnalyze} className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 text-[18px]">
                edit
              </span>
              <input
                type="text"
                value={customFoodInput}
                onChange={(e) => setCustomFoodInput(e.target.value)}
                placeholder="พิมพ์ชื่ออาหารที่ทาน เช่น ข้าวผัดกะเพราอกไก่, ส้มตำไทย, ต้มยำกุ้ง, แกงจืดเต้าหู้..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border-2 border-amber-300 text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 transition-all shadow-2xs"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">calculate</span>
              <span>คำนวณโภชนาการทันที</span>
            </button>
          </form>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-amber-900">กดเลือกชื่ออาหารด่วน:</span>
            {POPULAR_THAI_DISHES.map((dish) => (
              <button
                key={dish}
                type="button"
                onClick={() => {
                  setCustomFoodInput(dish);
                  runAIAnalysis(undefined, undefined, dish);
                }}
                className="text-[11px] font-semibold bg-white hover:bg-amber-100 text-amber-950 px-2.5 py-1 rounded-xl border border-amber-300 shadow-2xs hover:border-amber-500 transition-all cursor-pointer"
              >
                {dish}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Photo & Food Identification (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4">
          <div className="relative h-64 md:h-72 w-full bg-slate-100 group overflow-hidden">
            <img
              src={analysisResult.imageUrl || IMAGES.padThai}
              alt={analysisResult.dishName}
              className="w-full h-full object-cover"
            />

            {/* Scanning indicator */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white z-20">
                <span className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2"></span>
                <p className="text-[14px] font-bold">AI กำลังวิเคราะห์รูปภาพอาหาร...</p>
              </div>
            )}
          </div>

          <div className="p-6 pt-0 space-y-4">
            {/* Dish Identification */}
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ชื่อเมนูอาหาร ({analysisResult.mealType || selectedMealType})
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {analysisResult.confidence || 'ความแม่นยำสูง'}
                  </span>
                  <button
                    onClick={() => {
                      setIsEditingDishName(!isEditingDishName);
                      setEditedDishName(analysisResult.dishName);
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded-md border border-slate-200 transition-all flex items-center gap-0.5 cursor-pointer"
                    title="แก้ไขชื่ออาหารเพื่อคำนวณใหม่"
                  >
                    <span className="material-symbols-outlined text-[13px]">edit</span>
                    <span>แก้ไข</span>
                  </button>
                </div>
              </div>

              {/* Inline Dish Name Editor */}
              {isEditingDishName ? (
                <div className="mt-2 space-y-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    แก้ไขชื่ออาหารเพื่อคำนวณโภชนาการใหม่:
                  </span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={editedDishName}
                      onChange={(e) => setEditedDishName(e.target.value)}
                      placeholder="ระบุชื่ออาหารที่ถูกต้อง..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-[13px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      autoFocus
                    />
                    <button
                      onClick={handleApplyInlineEdit}
                      disabled={isScanning}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold shrink-0 cursor-pointer"
                    >
                      คำนวณใหม่
                    </button>
                    <button
                      onClick={() => setIsEditingDishName(false)}
                      className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg text-[12px] hover:bg-slate-50 shrink-0 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <h2 className="text-[22px] font-bold text-slate-800 mt-1">{analysisResult.dishName}</h2>
              )}

              <p className="text-[13px] text-slate-500 mt-0.5">
                ขนาดส่วนบริโภคโดยประมาณ: <span className="font-semibold text-slate-700">{portionSize}</span>
              </p>
            </div>

            {/* Main Ingredients */}
            <div className="space-y-2">
              <span className="text-[12px] font-bold text-slate-700 block">
                ส่วนประกอบหลักที่ตรวจพบ (Main Ingredients):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(
                  analysisResult.mainIngredients || [
                    'เส้นก๋วยเตี๋ยว',
                    'กุ้งสด',
                    'เต้าหู้เหลือง',
                    'ถั่วงอก',
                    'ไข่ไก่',
                  ]
                ).map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-[12px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                  >
                    • {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick trigger to type dish name */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-[12px]">
              <span className="text-slate-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">help</span>
                <span>ภาพไม่ตรงหรือไม่สามารถวิเคราะห์ได้?</span>
              </span>
              <button
                type="button"
                onClick={scrollToManualInput}
                className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
              >
                พิมพ์บอกชื่ออาหารเอง
              </button>
            </div>

            {/* Save to Daily Log Button */}
            <div className="pt-2">
              <button
                id="save-meal-log-btn"
                onClick={handleSaveMeal}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-6 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>{savedSuccess ? 'บันทึกลงแดชบอร์ดเรียบร้อยแล้ว!' : 'บันทึกมื้ออาหารนี้ (Save to Daily Log)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Calories Comparison, Evaluation Badge, & Macronutrients (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Calorie Comparison & Evaluation Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  การเปรียบเทียบแคลอรี่ประจำมื้อ
                </span>
                <h3 className="text-[18px] font-bold text-slate-800 mt-0.5">
                  ผลการประเมินพลังงาน ({selectedMealType})
                </h3>
              </div>

              {/* Evaluation Result Badge */}
              <div className={`px-4 py-1.5 rounded-full border text-[13px] font-black shrink-0 flex items-center gap-1.5 ${currentEval.badgeClass}`}>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{currentEval.label}</span>
              </div>
            </div>

            {/* Calories Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Estimated Calories */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-[12px] font-bold text-slate-500 block">
                  แคลอรี่ที่ประเมินจากภาพ (Estimated Calories)
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[36px] font-black text-slate-800 leading-none">
                    {analysisResult.calories}
                  </span>
                  <span className="text-[14px] text-slate-500 font-medium">kcal</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">คิดเป็นสัดส่วนของจานอาหารจริง</span>
              </div>

              {/* Recommended Calories for This Meal */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl">
                <span className="text-[12px] font-bold text-emerald-800 block">
                  แคลอรี่ที่แนะนำสำหรับมื้อนี้ (Recommended for This Meal)
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[36px] font-black text-emerald-700 leading-none">
                    {recommendedMealCalories}
                  </span>
                  <span className="text-[14px] text-emerald-800 font-medium">kcal</span>
                </div>
                <span className="text-[11px] text-emerald-700 block mt-1">
                  คำนวณจากความต้องการพลังงานต่อวัน ({profile.targetCalories} kcal)
                </span>
              </div>
            </div>

            {/* Suitability Explanation */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[13px] text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-800 mb-1">{analysisResult.suitabilityTitle}</p>
              <p>{analysisResult.suitabilityDescription}</p>
            </div>
          </div>

          {/* Macronutrients Breakdown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-[16px] font-bold text-slate-800">
              สัดส่วนสารอาหารหลักและเกณฑ์เฝ้าระวัง (Nutrient Breakdown)
            </h4>

            <div className="space-y-4">
              {/* Carbs */}
              <div>
                <div className="flex justify-between text-[13px] font-medium mb-1">
                  <span className="text-slate-800 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> คาร์โบไฮเดรต (Carbohydrates)
                  </span>
                  <span className="font-bold text-slate-800">
                    {analysisResult.macros.carbs.value}g{' '}
                    <span className="text-slate-400 font-normal">/ เป้าหมาย {analysisResult.macros.carbs.target}g</span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${analysisResult.macros.carbs.status === 'high' ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (analysisResult.macros.carbs.value / analysisResult.macros.carbs.target) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Protein */}
              <div>
                <div className="flex justify-between text-[13px] font-medium mb-1">
                  <span className="text-slate-800 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> โปรตีน (Protein)
                  </span>
                  <span className="font-bold text-slate-800">
                    {analysisResult.macros.protein.value}g{' '}
                    <span className="text-slate-400 font-normal">/ เป้าหมาย {analysisResult.macros.protein.target}g</span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${Math.min(100, (analysisResult.macros.protein.value / analysisResult.macros.protein.target) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between text-[13px] font-medium mb-1">
                  <span className="text-slate-800 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> ไขมัน (Fat)
                  </span>
                  <span className="font-bold text-slate-800">
                    {analysisResult.macros.fat.value}g{' '}
                    <span className="text-slate-400 font-normal">/ เป้าหมาย {analysisResult.macros.fat.target}g</span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${Math.min(100, (analysisResult.macros.fat.value / analysisResult.macros.fat.target) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Sodium & Sugar for NCD monitoring */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-500 block">โซเดียม (Sodium)</span>
                  <span className="text-[17px] font-black text-slate-800">
                    {analysisResult.macros.sodium?.value || 680} <span className="text-[12px] font-normal text-slate-500">mg</span>
                  </span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5">
                    {analysisResult.macros.sodium?.note || 'อยู่ในเกณฑ์ควบคุม'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-500 block">น้ำตาล (Sugar)</span>
                  <span className="text-[17px] font-black text-slate-800">
                    {analysisResult.macros.sugar?.value || 12} <span className="text-[12px] font-normal text-slate-500">g</span>
                  </span>
                  <span className="text-[11px] text-amber-700 block mt-0.5">
                    {analysisResult.macros.sugar?.note || 'ระวังน้ำตาลปรุงรส'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions for Meal Improvement */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">tips_and_updates</span>
              <span>คำแนะนำจาก AI ในการปรับปรุงมื้ออาหาร (Suggestions for Improving Meal)</span>
            </h4>

            <div className="space-y-2">
              {analysisResult.aiSuggestions.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
                    {item.icon || 'check_circle'}
                  </span>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-800">{item.title}</h5>
                    <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explicit Image Estimation Disclaimer Note */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] text-slate-600 leading-relaxed flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-slate-400 shrink-0 mt-0.5">info</span>
            <div>
              <strong className="text-slate-800 block mb-0.5">ข้อจำกัดความรับผิดชอบ (Disclaimer):</strong>
              การประมาณการแคลอรี่จากภาพถ่ายเป็นการประมาณการเบื้องต้นเท่านั้น เนื่องจากขนาดส่วนบริโภค ปริมาณน้ำมัน และส่วนผสมเครื่องปรุงจริงอาจแตกต่างกันไปตามสูตรอาหาร
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
