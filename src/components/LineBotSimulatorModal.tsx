import React, { useState, useRef, useEffect } from 'react';
import { HealthProfile } from '../types';
import { IMAGES } from '../mockData';
import { Logo } from './Logo';

interface LineBotSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HealthProfile;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  type: 'text' | 'image' | 'flex_health' | 'flex_meal' | 'flex_reminder';
  text?: string;
  imageUrl?: string;
  data?: any;
  time: string;
}

export const LineBotSimulatorModal: React.FC<LineBotSimulatorModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      type: 'text',
      text: 'สวัสดีครับ ยินดีต้อนรับสู่ LINE Official Account: Smart Food NCD 🥗\nระบบ AI ผู้ช่วยโภชนาการและการควบคุมโรคไม่ติดต่อเรื้อรัง (NCDs)',
      time: '12:00',
    },
    {
      id: '2',
      sender: 'bot',
      type: 'flex_health',
      data: profile,
      time: '12:00',
    },
    {
      id: '3',
      sender: 'bot',
      type: 'text',
      text: '📸 คุณสามารถถ่ายรูปหรือส่งรูปอาหารที่คุณกำลังจะรับประทานเข้ามาได้เลยครับ AI จะช่วยวิเคราะห์แคลอรี่ สารอาหาร และข้อควรระวังให้ทันที!',
      time: '12:01',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendText = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      type: 'text',
      text,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply: ChatMessage;

      if (text.includes('14') || text.includes('สรุป') || text.includes('ติดตาม')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'bot',
          type: 'flex_reminder',
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (text.includes('แคลอรี่') || text.includes('กิน') || text.includes('มื้อ')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'bot',
          type: 'text',
          text: `เป้าหมายพลังงานของคุณคือ ${profile.targetCalories} kcal/วัน โดยแบ่งเป็น:\n• มื้อเช้า: ${profile.mealPlan.breakfast} kcal\n• มื้อกลางวัน: ${profile.mealPlan.lunch} kcal\n• มื้อเย็น: ${profile.mealPlan.dinner} kcal\n\nสามารถถ่ายรูปอาหารเพื่อเช็คแคลอรี่ได้เลยครับ!`,
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        reply = {
          id: String(Date.now() + 1),
          sender: 'bot',
          type: 'text',
          text: `ได้รับข้อความ "${text}" แล้วครับ หากต้องการวิเคราะห์อาหาร กรุณากดปุ่ม 📷 ถ่ายรูปอาหาร หรือเลือกเมนูด้านล่างได้เลยครับ`,
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  const handleSendSampleFood = (image: string, name: string, cal: number) => {
    const userImgMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      type: 'image',
      imageUrl: image,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userImgMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botFlex: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        type: 'flex_meal',
        data: {
          dishName: name,
          calories: cal,
          carbs: 58,
          protein: 24,
          fat: 16,
          sodium: 620,
          advice: 'แนะนำลดน้ำซอส/น้ำจิ้ม และเพิ่มผักใบเขียวเพื่อชะลอการดูดซึมน้ำตาล เหมาะกับผู้ป่วย NCD',
        },
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botFlex]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-[#7292a7] w-full max-w-[480px] h-[90vh] max-h-[720px] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/20">
        {/* LINE Header */}
        <div className="bg-[#20272c] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-[20px] cursor-pointer"
            >
              ←
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shrink-0">
              <Logo size="sm" showText={false} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[15px] text-white">Smart Food NCD</span>
                <span className="bg-[#06c755] text-white text-[10px] px-1.5 py-0.2 rounded-xs font-bold">
                  LINE OA
                </span>
              </div>
              <span className="text-[11px] text-[#06c755] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#06c755] inline-block animate-pulse"></span>
                AI กำลังให้บริการ
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-[18px] cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Content */}
              {msg.type === 'text' && (
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#06c755] text-white rounded-tr-xs'
                      : 'bg-white text-[#1b1c1c] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              )}

              {msg.type === 'image' && (
                <div className="max-w-[70%] rounded-2xl overflow-hidden border-2 border-white shadow-md">
                  <img src={msg.imageUrl} alt="Food" className="w-full h-auto object-cover max-h-48" />
                </div>
              )}

              {/* LINE Flex Message: Initial Health Profile */}
              {msg.type === 'flex_health' && (
                <div className="w-[90%] bg-white rounded-2xl overflow-hidden shadow-md border border-[#006e1c]/30">
                  <div className="bg-[#006e1c] text-white p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">health_metrics</span>
                      <span className="font-bold text-[14px]">ผลการวิเคราะห์สุขภาพ</span>
                    </div>
                    <span className="bg-white/20 text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {profile.bmiStatus}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5 text-[13px] text-[#1b1c1c]">
                    <div className="flex justify-between border-b border-[#efeded] pb-1.5">
                      <span className="text-[#3f4a3c]">ดัชนีมวลกาย (BMI)</span>
                      <span className="font-bold text-[#006e1c]">{profile.bmi} kg/m²</span>
                    </div>
                    <div className="flex justify-between border-b border-[#efeded] pb-1.5">
                      <span className="text-[#3f4a3c]">พลังงานเป้าหมาย</span>
                      <span className="font-bold">{profile.targetCalories} kcal/วัน</span>
                    </div>
                    <div className="flex justify-between border-b border-[#efeded] pb-1.5">
                      <span className="text-[#3f4a3c]">สัดส่วน 3 มื้อ</span>
                      <span className="font-semibold text-[12px]">
                        เช้า {profile.mealPlan.breakfast} | กลางวัน {profile.mealPlan.lunch} | เย็น {profile.mealPlan.dinner}
                      </span>
                    </div>
                    <div className="bg-[#f5f3f3] p-2.5 rounded-xl text-[12px] text-[#3f4a3c]">
                      <span className="font-bold text-[#006e1c] block mb-0.5">คำแนะนำ NCD:</span>
                      {profile.healthAdvice}
                    </div>
                  </div>
                </div>
              )}

              {/* LINE Flex Message: Meal Analysis */}
              {msg.type === 'flex_meal' && (
                <div className="w-[90%] bg-white rounded-2xl overflow-hidden shadow-md border border-[#4caf50]">
                  <div className="bg-[#4caf50] text-[#003c0b] p-3 flex items-center justify-between font-bold text-[14px]">
                    <span>🍽️ ผลวิเคราะห์: {msg.data.dishName}</span>
                    <span className="bg-white text-[#006e1c] px-2 py-0.5 rounded-full text-[11px]">
                      {msg.data.calories} kcal
                    </span>
                  </div>
                  <div className="p-3.5 space-y-2 text-[12px] text-[#1b1c1c]">
                    <div className="grid grid-cols-3 gap-1 text-center bg-[#fbf9f9] p-2 rounded-lg">
                      <div>
                        <span className="text-[#3f4a3c] block text-[10px]">คาร์บ</span>
                        <span className="font-bold text-[#0061a4]">{msg.data.carbs}g</span>
                      </div>
                      <div>
                        <span className="text-[#3f4a3c] block text-[10px]">โปรตีน</span>
                        <span className="font-bold text-[#006e1c]">{msg.data.protein}g</span>
                      </div>
                      <div>
                        <span className="text-[#3f4a3c] block text-[10px]">ไขมัน</span>
                        <span className="font-bold text-[#8b5000]">{msg.data.fat}g</span>
                      </div>
                    </div>
                    <div className="bg-[#eaf5e7] p-2.5 rounded-xl text-[#003c0b]">
                      <span className="font-bold block mb-0.5">💡 คำแนะนำ AI:</span>
                      {msg.data.advice}
                    </div>
                  </div>
                </div>
              )}

              {/* LINE Flex Message: 14-Day Reminder */}
              {msg.type === 'flex_reminder' && (
                <div className="w-[90%] bg-white rounded-2xl overflow-hidden shadow-md border border-[#0061a4]">
                  <div className="bg-[#0061a4] text-white p-3.5 font-bold text-[14px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                    <span>ครบกำหนด 14 วัน! อัปเดตข้อมูลสุขภาพ</span>
                  </div>
                  <div className="p-3.5 text-[12px] text-[#1b1c1c] space-y-2">
                    <p>
                      ยินดีด้วยครับ! คุณใช้งานครบ 14 วันแล้ว กรุณาส่งน้ำหนักและส่วนสูงล่าสุดเพื่อประเมินพัฒนาการและรับคำแนะนำต่อเนื่อง
                    </p>
                    <button
                      onClick={() => handleSendText('น้ำหนักปัจจุบัน 68.5 กก. ส่วนสูง 170 ซม.')}
                      className="w-full bg-[#006e1c] text-white py-2 rounded-xl font-bold text-[12px] hover:bg-[#005313] transition-colors cursor-pointer"
                    >
                      ส่งน้ำหนัก 68.5 กก.
                    </button>
                  </div>
                </div>
              )}

              <span className="text-[10px] text-white/70 mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white/90 px-3 py-2 rounded-full w-20 text-[#006e1c] text-[12px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006e1c] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#006e1c] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#006e1c] animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* LINE Rich Menu (Bottom Bar) */}
        <div className="bg-white border-t border-[#becab9]/40 p-2 shrink-0">
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            <button
              onClick={() => handleSendSampleFood(IMAGES.padThai, 'ผัดไทยกุ้งสด', 550)}
              className="flex flex-col items-center p-1.5 rounded-xl bg-[#4caf50]/15 hover:bg-[#4caf50]/25 transition-colors text-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#006e1c] text-[20px]">add_a_photo</span>
              <span className="text-[10px] font-bold text-[#006e1c] mt-0.5">ส่งรูปอาหาร</span>
            </button>

            <button
              onClick={() => handleSendText('เช็คเป้าหมายแคลอรี่')}
              className="flex flex-col items-center p-1.5 rounded-xl bg-[#d1e4ff] hover:bg-[#9ecaff] transition-colors text-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#0061a4] text-[20px]">local_fire_department</span>
              <span className="text-[10px] font-bold text-[#0061a4] mt-0.5">เช็คแคลอรี่</span>
            </button>

            <button
              onClick={() => handleSendText('สรุปผลสุขภาพ 14 วัน')}
              className="flex flex-col items-center p-1.5 rounded-xl bg-[#ffdcbe] hover:bg-[#ffb870] transition-colors text-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#8b5000] text-[20px]">calendar_month</span>
              <span className="text-[10px] font-bold text-[#8b5000] mt-0.5">สรุป 14 วัน</span>
            </button>

            <button
              onClick={() => handleSendText('คำแนะนำโภชนาการสำหรับโรคเบาหวานและความดัน')}
              className="flex flex-col items-center p-1.5 rounded-xl bg-[#efeded] hover:bg-[#e3e2e2] transition-colors text-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#3f4a3c] text-[20px]">medical_services</span>
              <span className="text-[10px] font-bold text-[#3f4a3c] mt-0.5">ปรึกษา NCD</span>
            </button>
          </div>

          {/* Text Input Row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="พิมพ์ข้อความหรือสอบถาม AI..."
              className="flex-1 px-3.5 py-2 bg-[#f5f3f3] border border-[#becab9] rounded-full text-[13px] outline-none focus:border-[#06c755]"
            />
            <button
              onClick={() => handleSendText()}
              className="w-9 h-9 rounded-full bg-[#06c755] text-white flex items-center justify-center hover:bg-[#05a847] transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
