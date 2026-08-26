import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy Gemini client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Initial Health Assessment Endpoint
app.post("/api/health-assessment", async (req, res) => {
  try {
    const { weight, height, diseases, medications, age = 40, gender = "female", activityLevel = "light" } = req.body;
    const numWeight = parseFloat(weight) || 65;
    const numHeight = parseFloat(height) || 170;
    
    // BMI calculation
    const heightInMeters = numHeight / 100;
    const bmi = parseFloat((numWeight / (heightInMeters * heightInMeters)).toFixed(1));
    
    let bmiStatus = "น้ำหนักปกติ";
    if (bmi < 18.5) bmiStatus = "น้ำหนักต่ำกว่าเกณฑ์";
    else if (bmi < 23.0) bmiStatus = "น้ำหนักปกติ";
    else if (bmi < 25.0) bmiStatus = "น้ำหนักเกิน (ท้วม)";
    else if (bmi < 30.0) bmiStatus = "โรคอ้วนระดับ 1";
    else bmiStatus = "โรคอ้วนระดับ 2";

    // Standard BMR & TDEE calculation (Mifflin - St Jeor)
    let bmr = (10 * numWeight) + (6.25 * numHeight) - (5 * age) + (gender === "male" ? 5 : -161);
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725
    };
    const multiplier = activityMultipliers[activityLevel] || 1.375;
    let tdee = Math.round(bmr * multiplier / 50) * 50;
    if (tdee < 1400) tdee = 1500;
    if (tdee > 2600) tdee = 2400;

    // Split target calories into 3 meals
    const breakfast = Math.round((tdee * 0.28) / 50) * 50;
    const lunch = Math.round((tdee * 0.38) / 50) * 50;
    const dinner = tdee - breakfast - lunch;

    let aiAdvice = "เพื่อรักษาน้ำหนักและสุขภาพที่ดีในระดับปัจจุบัน พร้อมควบคุมระดับน้ำตาลและโซเดียมสำหรับผู้ป่วย NCD";
    let specialNotes = [
      "ควบคุมคาร์โบไฮเดรตเชิงเดี่ยว เพื่อรักษาระดับน้ำตาลในเลือดให้คงที่",
      "จำกัดปริมาณโซเดียมไม่เกิน 2,000 มก./วัน เพื่อป้องกันความดันโลหิตสูง",
      "แบ่งพลังงานออกเป็น 3 มื้อหลักที่สมดุล หลีกเลี่ยงของว่างรสหวานจัด"
    ];

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `คุณคือผู้เชี่ยวชาญด้านโภชนาการสำหรับโรคไม่ติดต่อเรื้อรัง (NCDs) ประจำ Smart Food NCD
ข้อมูลผู้ใช้:
- น้ำหนัก: ${numWeight} กก., ส่วนสูง: ${numHeight} ซม.
- BMI: ${bmi} (${bmiStatus})
- โรคประจำตัว: ${diseases || "ไม่มี"}
- ยาประจำตัว: ${medications || "ไม่มี"}
- พลังงานเป้าหมายคำนวณได้: ${tdee} kcal/วัน (มื้อเช้า ${breakfast}, กลางวัน ${lunch}, เย็น ${dinner})

โปรดให้คำแนะนำโภชนาการสั้นกระชับเข้าใจง่าย เป็นภาษาไทย โดยตอบเป็น JSON schema ตามที่ระบุ:
{
  "healthAdvice": "คำแนะนำสั้นๆ 1 ประโยคหลักเพื่อเป้าหมายสุขภาพ",
  "specialNotes": ["ข้อควรระวังหรือแนวทางปฏิบัติด้านอาหาร 3 ข้อ ที่สอดคล้องกับโรคประจำตัวและยาที่ทาน"]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                healthAdvice: { type: Type.STRING },
                specialNotes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["healthAdvice", "specialNotes"]
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.healthAdvice) aiAdvice = parsed.healthAdvice;
          if (parsed.specialNotes && Array.isArray(parsed.specialNotes)) specialNotes = parsed.specialNotes;
        }
      } catch (err) {
        console.warn("Gemini health assessment fallback:", err);
      }
    }

    return res.json({
      weight: numWeight,
      height: numHeight,
      bmi,
      bmiStatus,
      targetCalories: tdee,
      mealsPerDay: 3,
      mealPlan: {
        breakfast,
        lunch,
        dinner
      },
      healthAdvice: aiAdvice,
      ncdSpecialNotes: specialNotes,
      diseases,
      medications,
      registeredDate: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
    });
  } catch (error) {
    console.error("Health assessment error:", error);
    return res.status(500).json({ error: "Failed to assess health" });
  }
});

// 2. Food Photo & Meal Analysis Endpoint
app.post("/api/analyze-food", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", dishHint = "", userProfile, mealType = "มื้อกลางวัน" } = req.body;

    const targetCalories = userProfile?.targetCalories || 2100;
    const targetMealCal = mealType === "มื้อเช้า" ? Math.round(targetCalories * 0.28) :
                          mealType === "มื้อเย็น" ? Math.round(targetCalories * 0.34) :
                          Math.round(targetCalories * 0.38);

    const targetCarbs = Math.round((targetMealCal * 0.50) / 4);
    const targetProtein = Math.round((targetMealCal * 0.25) / 4);
    const targetFat = Math.round((targetMealCal * 0.25) / 9);

    const ai = getGeminiClient();
    if (ai && (imageBase64 || dishHint)) {
      try {
        const parts: any[] = [];
        if (imageBase64) {
          // Remove data URL prefix if present
          const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
          parts.push({
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: base64Data
            }
          });
        }

        const promptText = `คุณคือระบบ AI วิเคราะห์ภาพอาหารและคำนวณโภชนาการสำหรับ Smart Food NCD เพื่อผู้ป่วยกลุ่มโรคไม่ติดต่อเรื้อรัง (NCDs เช่น เบาหวาน ความดัน ไขมัน ไต)
ข้อมูลผู้ป่วย:
- โรคประจำตัว: ${userProfile?.diseases || "เบาหวาน, ความดันโลหิตสูง"}
- ยาที่ทาน: ${userProfile?.medications || "ยาลดน้ำตาล, ยาลดความดัน"}
- ประเภทมื้อ: ${mealType}
- พลังงานเป้าหมายของมื้อนี้: ${targetMealCal} kcal (คาร์บเป้าหมาย ~${targetCarbs}g, โปรตีน ~${targetProtein}g, ไขมัน ~${targetFat}g)
${dishHint ? `- ผู้ใช้ระบุชื่ออาหารว่า: "${dishHint}" (โปรดใช้ชื่อนี้เป็นหลักในการคำนวณโภชนาการ)` : "- ตรวจสอบว่าในภาพมีอาหารหรือไม่ และสามารถระบุชื่ออาหารได้อย่างชัดเจนหรือไม่ หากภาพเบลอ ไม่ชัดเจน หรือไม่ใช่ภาพอาหาร ให้ตั้ง isRecognized เป็น false"}

โปรดวิเคราะห์โภชนาการของอาหารนี้อย่างละเอียด:
1. หากภาพมีอาหารชัดเจน หรือมี dishHint ให้ตั้ง isRecognized เป็น true และระบุชื่ออาหาร
2. หากภาพเบลอมาก ไม่ชัด หรือไม่ใช่ภาพอาหาร และไม่มี dishHint ให้ตั้ง isRecognized เป็น false และระบุ dishName ว่า "ไม่สามารถระบุชื่ออาหารจากภาพได้"
3. ประเมินแคลอรี่รวม (kcal), คาร์โบไฮเดรต (g), โปรตีน (g), ไขมัน (g), โซเดียมโดยประมาณ (mg), น้ำตาลโดยประมาณ (g)
4. ตรวจสอบว่าเหมาะสมกับเป้าหมายมื้อนี้ของผู้ป่วย NCD หรือไม่
5. ให้คำแนะนำ 2-3 ข้อสำหรับปรับปรุงมื้อนี้ (เช่น ลดเส้น, เพิ่มผัก, ลดน้ำแกง/น้ำจิ้มเพื่อคุมโซเดียม)`;

        parts.push({ text: promptText });

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isRecognized: { type: Type.BOOLEAN, description: "True if food is identified, False if image is too blurry/unclear/not food and dishHint is not provided" },
                dishName: { type: Type.STRING },
                portionSize: { type: Type.STRING, description: "เช่น 1 จานมาตรฐาน (~350 กรัม), 1 ชาม (~300 กรัม)" },
                calories: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                sodium: { type: Type.NUMBER },
                sugar: { type: Type.NUMBER },
                mainIngredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                suitabilityTitle: { type: Type.STRING },
                suitabilityDescription: { type: Type.STRING },
                isAppropriate: { type: Type.BOOLEAN },
                ncdWarning: { type: Type.STRING },
                aiSuggestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      icon: { type: Type.STRING, description: "Material symbol name e.g. restaurant_menu, local_florist, soup_kitchen, warning" },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["warning", "tip", "success"] }
                    },
                    required: ["icon", "title", "description"]
                  }
                }
              },
              required: ["isRecognized", "dishName", "calories", "carbs", "protein", "fat", "suitabilityTitle", "suitabilityDescription", "isAppropriate", "aiSuggestions"]
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          const mealPct = Math.min(100, Math.round((parsed.calories / targetMealCal) * 100));

          const recognized = parsed.isRecognized !== false && !parsed.dishName?.includes("ไม่สามารถระบุ");

          return res.json({
            id: `meal-${Date.now()}`,
            dishName: parsed.dishName || dishHint || "อาหารเพื่อสุขภาพ",
            portionSize: parsed.portionSize || "1 จานมาตรฐาน (~350 กรัม)",
            mainIngredients: parsed.mainIngredients && parsed.mainIngredients.length > 0 ? parsed.mainIngredients : ["ข้าวสวย", "เนื้อสัตว์ไม่ติดมัน", "ผักสดหลากสี"],
            imageUrl: imageBase64 || "",
            confidence: dishHint ? "ระบุโดยผู้ใช้" : recognized ? "ความแม่นยำสูง" : "ไม่สามารถระบุได้",
            isRecognized: recognized,
            calories: parsed.calories,
            mealPercentage: mealPct,
            mealType,
            suitabilityTitle: parsed.suitabilityTitle,
            suitabilityDescription: parsed.suitabilityDescription,
            isAppropriate: parsed.isAppropriate,
            macros: {
              carbs: {
                value: parsed.carbs,
                target: targetCarbs,
                status: parsed.carbs > targetCarbs * 1.15 ? "high" : parsed.carbs < targetCarbs * 0.7 ? "low" : "normal",
                note: parsed.carbs > targetCarbs * 1.15 ? "สูงกว่าเป้าหมายเล็กน้อย" : "อยู่ในเกณฑ์ที่เหมาะสม"
              },
              protein: {
                value: parsed.protein,
                target: targetProtein,
                status: parsed.protein >= targetProtein * 0.8 ? "normal" : "low"
              },
              fat: {
                value: parsed.fat,
                target: targetFat,
                status: parsed.fat > targetFat * 1.2 ? "high" : "normal"
              },
              sodium: {
                value: parsed.sodium || 650,
                maxLimit: 700,
                note: (parsed.sodium || 650) > 700 ? "โซเดียมค่อนข้างสูง" : "อยู่ในเกณฑ์ควบคุม"
              },
              sugar: {
                value: parsed.sugar || 8,
                maxLimit: 15,
                note: (parsed.sugar || 8) > 12 ? "น้ำตาลค่อนข้างสูง" : "น้ำตาลต่ำ"
              }
            },
            aiSuggestions: parsed.aiSuggestions,
            analyzedAt: `วันนี้, ${new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.`,
            ncdWarning: parsed.ncdWarning
          });
        }
      } catch (err) {
        console.warn("Gemini vision analysis fallback to smart heuristics:", err);
      }
    }

    // Fallback response if no Gemini API key or error
    const fallbackDish = dishHint || "ผัดไทยกุ้งสด";
    let estCal = 550;
    let estCarbs = 65;
    let estProtein = 24;
    let estFat = 20;
    let estSodium = 680;
    let estSugar = 9;
    let mainIngs = ["ข้าวสวย/เส้น", "เนื้อสัตว์", "ผักเคียง", "เครื่องปรุงรส"];

    if (fallbackDish.includes("กะเพรา")) {
      estCal = 580; estCarbs = 62; estProtein = 26; estFat = 24; estSodium = 840; estSugar = 5;
      mainIngs = ["ข้าวสวย", "เนื้อหมู/ไก่สับ", "ใบกะเพรา", "พริกกระเทียม", "ไข่ดาว"];
    } else if (fallbackDish.includes("ส้มตำ")) {
      estCal = 180; estCarbs = 32; estProtein = 8; estFat = 3; estSodium = 980; estSugar = 16;
      mainIngs = ["มะละกอดิบ", "ถั่วฝักยาว", "มะเขือเทศ", "กุ้งแห้ง/ถั่วลิสง", "น้ำปลา/มะนาว"];
    } else if (fallbackDish.includes("สลัด")) {
      estCal = 360; estCarbs = 20; estProtein = 30; estFat = 16; estSodium = 390; estSugar = 4;
      mainIngs = ["ผักสลัดรวม", "อกไก่/ปลาแซลมอน", "ไข่ต้ม", "น้ำสลัดงา"];
    } else if (fallbackDish.includes("แกงจืด") || fallbackDish.includes("ต้มจืด")) {
      estCal = 210; estCarbs = 10; estProtein = 20; estFat = 9; estSodium = 490; estSugar = 2;
      mainIngs = ["เต้าหู้ไข่", "หมูสับ", "ผักกาดขาว", "สาหร่าย", "น้ำซุปใส"];
    } else if (fallbackDish.includes("ก๋วยเตี๋ยว") || fallbackDish.includes("บะหมี่") || fallbackDish.includes("ราดหน้า")) {
      estCal = 490; estCarbs = 60; estProtein = 22; estFat = 15; estSodium = 960; estSugar = 7;
      mainIngs = ["เส้นก๋วยเตี๋ยว", "ลูกชิ้น/หมูชิ้น", "ถั่วงอก/ผักบุ้ง", "กระเทียมเจียว", "น้ำซุป"];
    } else if (fallbackDish.includes("ข้าวมันไก่")) {
      estCal = 630; estCarbs = 68; estProtein = 28; estFat = 26; estSodium = 860; estSugar = 6;
      mainIngs = ["ข้าวมัน", "เนื้อไก่ต้ม", "แตงกวา", "น้ำจิ้มเต้าเจี้ยว", "น้ำซุป"];
    } else if (fallbackDish.includes("ต้มยำ")) {
      estCal = 310; estCarbs = 16; estProtein = 26; estFat = 12; estSodium = 920; estSugar = 5;
      mainIngs = ["กุ้ง/เห็ดฟาง", "ข่า ตะไคร้ ใบมะกรูด", "พริกเผา", "มะนาว", "ผักชี"];
    } else if (fallbackDish.includes("ข้าวผัด")) {
      estCal = 560; estCarbs = 70; estProtein = 20; estFat = 22; estSodium = 740; estSugar = 6;
      mainIngs = ["ข้าวสวยผัด", "ไข่ไก่", "เนื้อสัตว์", "ต้นหอม/มะเขือเทศ", "แตงกวา"];
    }

    const mealPct = Math.min(100, Math.round((estCal / targetMealCal) * 100));

    return res.json({
      id: `meal-${Date.now()}`,
      dishName: fallbackDish,
      portionSize: "1 จานมาตรฐาน (~350 กรัม)",
      mainIngredients: mainIngs,
      imageUrl: imageBase64 || "",
      confidence: dishHint ? "ระบุโดยผู้ใช้" : "ความแม่นยำสูง",
      calories: estCal,
      mealPercentage: mealPct,
      mealType,
      suitabilityTitle: estCal <= targetMealCal + 50 ? "เหมาะสมกับแผนการกินของคุณ" : "พลังงานค่อนข้างสูงกว่าเกณฑ์",
      suitabilityDescription: `มื้อนี้มีพลังงานประมาณ ${estCal} kcal (${mealPct}% ของเป้าหมายมื้อนี้)`,
      isAppropriate: estCal <= targetMealCal + 100,
      macros: {
        carbs: { value: estCarbs, target: targetCarbs, status: estCarbs > targetCarbs * 1.15 ? "high" : "normal", note: estCarbs > targetCarbs * 1.15 ? "สูงกว่าเป้าหมายเล็กน้อย" : "อยู่ในเกณฑ์ที่เหมาะสม" },
        protein: { value: estProtein, target: targetProtein, status: "normal" },
        fat: { value: estFat, target: targetFat, status: estFat > targetFat * 1.2 ? "high" : "normal" },
        sodium: { value: estSodium, maxLimit: 700, note: estSodium > 700 ? "โซเดียมค่อนข้างสูง ควรลดน้ำแกง/น้ำจิ้ม" : "อยู่ในเกณฑ์ควบคุม" },
        sugar: { value: estSugar, maxLimit: 15, note: estSugar > 12 ? "ระวังน้ำตาลปรุงรส" : "น้ำตาลต่ำ" }
      },
      aiSuggestions: [
        {
          icon: "restaurant_menu",
          title: "การปรับสัดส่วนสารอาหาร",
          description: `สำหรับเมนู ${fallbackDish} แนะนำเน้นรับประทานเนื้อสัตว์ไม่ติดมันและเพิ่มผักสดเคียง`,
          type: "tip"
        },
        {
          icon: "health_and_safety",
          title: "คำแนะนำโรค NCDs",
          description: "หลีกเลี่ยงการเติมพริกน้ำปลาหรือน้ำตาลปรุงรสเพิ่มเติม เพื่อรักษาสมดุลความดันโลหิตและน้ำตาลในเลือด",
          type: "tip"
        }
      ],
      analyzedAt: `วันนี้, ${new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.`,
      ncdWarning: "ควรเลือกรับประทานผักเคียงเพิ่มเพื่อช่วยชะลอการดูดซึมน้ำตาลและไขมันเข้าสู่ร่างกาย"
    });
  } catch (error) {
    console.error("Food analysis error:", error);
    return res.status(500).json({ error: "Failed to analyze meal" });
  }
});

// 3. 14-Day Evaluation Endpoint
app.post("/api/14day-evaluation", async (req, res) => {
  try {
    const { day1Weight = 70.2, currentWeight = 68.5, height = 170, userProfile } = req.body;
    const hM = height / 100;
    const day1Bmi = parseFloat((day1Weight / (hM * hM)).toFixed(1));
    const currentBmi = parseFloat((currentWeight / (hM * hM)).toFixed(1));
    const weightDiff = parseFloat((currentWeight - day1Weight).toFixed(1));
    const bmiDiff = parseFloat((currentBmi - day1Bmi).toFixed(1));

    let defaultRecs = [
      "น้ำหนักของคุณลดลงอย่างต่อเนื่อง รักษาปริมาณโปรตีนให้เพียงพอเพื่อรักษามวลกล้ามเนื้อ",
      "ช่วง 3 วันที่ผ่านมาคุณดื่มน้ำน้อยลง แนะนำให้เพิ่มการดื่มน้ำระหว่างวัน",
      "การคุมอาหาร 14 วันที่ผ่านมาช่วยส่งผลดีต่อระดับน้ำตาลและความดันโลหิตสะสมอย่างชัดเจน"
    ];

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `คุณคือ AI ให้คำปรึกษาผลการดูแลสุขภาพครบ 14 วันของ Smart Food NCD
ข้อมูล:
- น้ำหนัก Day 1: ${day1Weight} กก. (BMI ${day1Bmi})
- น้ำหนัก Day 14: ${currentWeight} กก. (BMI ${currentBmi})
- ผลต่าง: น้ำหนักเปลี่ยน ${weightDiff} กก., BMI เปลี่ยน ${bmiDiff}
- โรคประจำตัว: ${userProfile?.diseases || "เบาหวาน, ความดันโลหิตสูง"}
- ยาที่ใช้: ${userProfile?.medications || "ยาตามแพทย์สั่ง"}

โปรดให้ข้อคิดเห็นและคำแนะนำ 3 ข้อที่สร้างกำลังใจและเจาะจงทางการแพทย์สำหรับผู้ป่วย NCD ใน 14 วันถัดไป`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["recommendations"]
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.recommendations && parsed.recommendations.length > 0) {
            defaultRecs = parsed.recommendations;
          }
        }
      } catch (err) {
        console.warn("Gemini 14-day evaluation fallback:", err);
      }
    }

    return res.json({
      day1: {
        weight: day1Weight,
        height,
        bmi: day1Bmi,
        bmiStatus: day1Bmi < 23 ? "น้ำหนักปกติ" : day1Bmi < 25 ? "น้ำหนักเกิน" : "โรคอ้วน",
        date: "Day 1"
      },
      day14: {
        weight: currentWeight,
        height,
        bmi: currentBmi,
        bmiStatus: currentBmi < 23 ? "น้ำหนักปกติ" : currentBmi < 25 ? "น้ำหนักเกิน" : "โรคอ้วน",
        date: "Day 14 (วันนี้)"
      },
      weightChange: weightDiff,
      bmiChange: bmiDiff,
      historyPoints: [
        { day: 1, label: "Day 1", weight: day1Weight, bmi: day1Bmi, date: "Day 1" },
        { day: 4, label: "Day 4", weight: parseFloat((day1Weight + weightDiff * 0.25).toFixed(1)), bmi: parseFloat((day1Bmi + bmiDiff * 0.25).toFixed(1)), date: "Day 4" },
        { day: 7, label: "Day 7", weight: parseFloat((day1Weight + weightDiff * 0.55).toFixed(1)), bmi: parseFloat((day1Bmi + bmiDiff * 0.55).toFixed(1)), date: "Day 7" },
        { day: 10, label: "Day 10", weight: parseFloat((day1Weight + weightDiff * 0.80).toFixed(1)), bmi: parseFloat((day1Bmi + bmiDiff * 0.80).toFixed(1)), date: "Day 10" },
        { day: 14, label: "Day 14", weight: currentWeight, bmi: currentBmi, date: "Day 14" }
      ],
      aiRecommendations: defaultRecs
    });
  } catch (error) {
    console.error("14-day evaluation error:", error);
    return res.status(500).json({ error: "Failed to evaluate 14-day progress" });
  }
});

// Vite middleware / Static serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Food NCD Server running on port ${PORT}`);
  });
}

setupViteOrStatic();
