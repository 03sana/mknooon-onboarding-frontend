import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(10);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const countriesPricing: Record<string, { price: number; flag: string }> = {
    'المملكة العربية السعودية': { price: 320, flag: '🇸🇦' },
    'الإمارات': { price: 320, flag: '🇦🇪' },
    'الكويت': { price: 350, flag: '🇰🇼' },
    'قطر': { price: 400, flag: '🇶🇦' },
    'البحرين': { price: 300, flag: '🇧🇭' },
    'عمان': { price: 320, flag: '🇴🇲' },
    'مصر': { price: 1250, flag: '🇪🇬' },
    'الأردن': { price: 350, flag: '🇯🇴' },
    'فلسطين': { price: 300, flag: '🇵🇸' },
    'لبنان': { price: 500, flag: '🇱🇧' },
    'سوريا': { price: 400, flag: '🇸🇾' },
    'العراق': { price: 450, flag: '🇮🇶' },
    'اليمن': { price: 350, flag: '🇾🇪' },
    'المغرب': { price: 400, flag: '🇲🇦' },
    'الجزائر': { price: 450, flag: '🇩🇿' },
    'تونس': { price: 400, flag: '🇹🇳' },
    'السودان': { price: 300, flag: '🇸🇩' },
    'ليبيا': { price: 350, flag: '🇱🇾' },
    'موريتانيا': { price: 300, flag: '🇲🇷' },
    'جيبوتي': { price: 300, flag: '🇩🇯' },
    'الصومال': { price: 250, flag: '🇸🇴' },
    'جزر القمر': { price: 250, flag: '🇰🇲' },
    'بريطانيا': { price: 50, flag: '🇬🇧' },
  };

  return (
    <div className="h-[100svh] overflow-hidden bg-[#F7F4EF] flex items-center justify-center">
      {/* Screen 10: Pricing */}
      {currentStep === 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[390px] h-[100svh] flex flex-col px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
        >
          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-right mb-3">سعر الاشتراك:</h2>
            
            {/* Price Box */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center mb-3">
              <p className="text-3xl font-extrabold text-gray-900 m-0">
                {countriesPricing[answers[9]]?.price || 0}
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-2 text-right">
              وهذا السعر يشمل 5 دورات، وهي:
            </p>

            {/* Courses Box */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
              <div className="text-right space-y-2">
                {[
                  'الدورة الاحترافية',
                  'دورة تسعير المنتجات',
                  'دورة تصوير المنتجات بالموبايل',
                  'دورة التسويق الإلكتروني',
                  'دورة إدارة المشاريع',
                  'المتابعة مع الدعم الفني لمدة عام كامل'
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-end gap-2">
                    <span className="text-sm text-gray-900 font-medium leading-5">{item}</span>
                    <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <motion.button
            onClick={() => setCurrentStep(11)}
            className="mt-4 w-full h-12 rounded-xl bg-[#1F2328] text-white text-base font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            متابعة
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
