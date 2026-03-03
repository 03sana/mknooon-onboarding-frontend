import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const countriesPricing: Record<string, { price: number; flag: string }> = {
    'السعودية': { price: 320, flag: '🇸🇦' },
    'الإمارات العربية المتحدة': { price: 320, flag: '🇦🇪' },
    'مصر': { price: 1250, flag: '🇪🇬' },
    'الأردن': { price: 30, flag: '🇯🇴' },
    'لبنان': { price: 40, flag: '🇱🇧' },
    'قطر': { price: 290, flag: '🇶🇦' },
    'الكويت': { price: 29, flag: '🇰🇼' },
    'سلطنة عُمان': { price: 35, flag: '🇴🇲' },
    'البحرين': { price: 40, flag: '🇧🇭' },
    'ليبيا': { price: 295, flag: '🇱🇾' },
    'المغرب': { price: 290, flag: '🇲🇦' },
    'تونس': { price: 150, flag: '🇹🇳' },
    'الجزائر': { price: 7000, flag: '🇩🇿' },
    'العراق': { price: 60000, flag: '🇮🇶' },
    'سوريا': { price: 4500, flag: '🇸🇾' },
    'السودان': { price: 95000, flag: '🇸🇩' },
    'اليمن': { price: 50, flag: '🇾🇪' },
    'فلسطين - الضفة الغربية': { price: 280, flag: '🇵🇸' },
    'فلسطين - الداخل والقدس': { price: 390, flag: '🇵🇸' },
    'بريطانيا': { price: 100, flag: '🇬🇧' },
    'كندا': { price: 150, flag: '🇨🇦' },
    'أمريكا': { price: 130, flag: '🇺🇸' },
    'باقي الدول': { price: 130, flag: '🌍' }
  };
  
  const countries = Object.keys(countriesPricing).sort();

  const handleAnswer = (step: number, answer: string) => {
    setAnswers({ ...answers, [step]: answer });
  };

  const handleContinue = () => {
    if (answers[currentStep]) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAFAF8', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Screen 1: Welcome */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center d-flex flex-column justify-content-center"
          style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}
        >
          <h1 className="fw-bold text-dark mb-3" style={{ fontSize: '36px', fontWeight: 700 }}>Mknooon</h1>
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '32px', fontWeight: 700 }}>رحلتك للإطلاق<br />مشروعك تبدأ الآن</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>3 دقائق فقط...وتعرفي فيها ..</p>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>هل أنت جاهزة لإطلاق مشروعك ؟</p>
          
          <motion.button
            onClick={() => setCurrentStep(2)}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%', maxWidth: '400px', margin: '0 auto' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تعرفي على الفرصة
          </motion.button>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '30px' }}>أكثر من 11000 امرأة بدأن رحلتهن</p>
        </motion.div>
      )}

      {/* Screen 2: Question 1 */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>هل تمتلكين منتجات أو خدمات جاهزة للبيع؟</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['نعم، أمتلك منتجات', 'نعم، أمتلك خدمات', 'لا، أريد إنشاء منتجات'].map((option) => (
              <motion.button
                key={option}
                onClick={() => {
                  handleAnswer(2, option);
                  setCurrentStep(3);
                }}
                className="btn btn-outline-dark fw-bold py-3 px-4"
                style={{ borderRadius: '12px', fontSize: '16px', textAlign: 'right', border: '1.5px solid #D9D5CF' }}
                whileHover={{ backgroundColor: '#F0EAE0' }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 3: Question 2 */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>هل لديك خبرة في التسويق الإلكتروني؟</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['نعم، لدي خبرة', 'لا، مبتدئة', 'لدي خبرة بسيطة'].map((option) => (
              <motion.button
                key={option}
                onClick={() => {
                  handleAnswer(3, option);
                  setCurrentStep(4);
                }}
                className="btn btn-outline-dark fw-bold py-3 px-4"
                style={{ borderRadius: '12px', fontSize: '16px', textAlign: 'right', border: '1.5px solid #D9D5CF' }}
                whileHover={{ backgroundColor: '#F0EAE0' }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 4: Question 3 */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>ما هو هدفك من هذه الدورة؟</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['زيادة المبيعات', 'تعلم مهارات جديدة', 'بناء مشروع جديد', 'تطوير مشروعي الحالي'].map((option) => (
              <motion.button
                key={option}
                onClick={() => {
                  handleAnswer(4, option);
                  setCurrentStep(5);
                }}
                className="btn btn-outline-dark fw-bold py-3 px-4"
                style={{ borderRadius: '12px', fontSize: '16px', textAlign: 'right', border: '1.5px solid #D9D5CF' }}
                whileHover={{ backgroundColor: '#F0EAE0' }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 5: Question 4 */}
      {currentStep === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>كم ساعة في اليوم يمكنك تخصيصها للدراسة؟</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['أقل من ساعة', '1-2 ساعة', '2-3 ساعات', 'أكثر من 3 ساعات'].map((option) => (
              <motion.button
                key={option}
                onClick={() => {
                  handleAnswer(5, option);
                  setCurrentStep(6);
                }}
                className="btn btn-outline-dark fw-bold py-3 px-4"
                style={{ borderRadius: '12px', fontSize: '16px', textAlign: 'right', border: '1.5px solid #D9D5CF' }}
                whileHover={{ backgroundColor: '#F0EAE0' }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 6: Question 5 */}
      {currentStep === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>ما هو نطاق منتجاتك/خدماتك؟</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['منتجات فيزيائية', 'خدمات رقمية', 'كورسات/تدريب', 'منتجات رقمية', 'مزيج من الخيارات'].map((option) => (
              <motion.button
                key={option}
                onClick={() => {
                  handleAnswer(6, option);
                  setCurrentStep(7);
                }}
                className="btn btn-outline-dark fw-bold py-3 px-4"
                style={{ borderRadius: '12px', fontSize: '16px', textAlign: 'right', border: '1.5px solid #D9D5CF' }}
                whileHover={{ backgroundColor: '#F0EAE0' }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 7: Progress */}
      {currentStep === 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center d-flex flex-column justify-content-center"
          style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}
        >
          <h2 className="fw-bold text-dark mb-5" style={{ fontSize: '32px', fontWeight: 700 }}>أنتِ في الطريق الصحيح!</h2>
          
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '40px auto' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="#E8E4DC" strokeWidth="8" />
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#7C6E5B"
                strokeWidth="8"
                strokeDasharray="565.48"
                initial={{ strokeDashoffset: 565.48 }}
                animate={{ strokeDashoffset: 565.48 * 0.22 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 800, color: '#2D2D2D', margin: '0' }}>78%</p>
              <p style={{ fontSize: '14px', color: '#999', margin: '4px 0 0 0' }}>مكتمل</p>
            </div>
          </div>

          <motion.button
            onClick={() => setCurrentStep(8)}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%', maxWidth: '400px', margin: '40px auto 0' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            متابعة
          </motion.button>
        </motion.div>
      )}

      {/* Screen 8: Video */}
      {currentStep === 8 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>شاهدي هذا الفيديو</h2>
          <div style={{ marginBottom: '30px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#E8E4DC' }}>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/dJjFfRiy6E4"
              title="Chocodar Brand Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            ></iframe>
          </div>
          <motion.button
            onClick={() => setCurrentStep(9)}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            متابعة
          </motion.button>
        </motion.div>
      )}

      {/* Screen 9: Country Selection */}
      {currentStep === 9 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>اختاري دولتك</h2>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: '100%',
                borderRadius: isDropdownOpen ? '10px 10px 0 0' : '10px',
                border: '1.5px solid #D9D5CF',
                borderBottom: isDropdownOpen ? 'none' : '1.5px solid #D9D5CF',
                padding: '14px 16px',
                fontSize: '16px',
                fontWeight: 500,
                backgroundColor: '#FFFFFF',
                color: answers[9] ? '#2D2D2D' : '#999',
                direction: 'rtl',
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isDropdownOpen ? '0 0 0 3px rgba(124, 110, 91, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer'
              }}
              whileHover={{ backgroundColor: '#FAFAF8' }}
            >
              <span>{answers[9] || 'اختاري دولة'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C6E5B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.button>
            
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #D9D5CF',
                  borderRadius: '10px',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}
              >
                {countries.map((country) => (
                  <motion.button
                    key={country}
                    onClick={() => {
                      handleAnswer(9, country);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      textAlign: 'right',
                      direction: 'rtl',
                      border: 'none',
                      borderBottom: '1px solid #F0EAE0',
                      backgroundColor: answers[9] === country ? '#F0EAE0' : '#FFFFFF',
                      color: '#2D2D2D',
                      fontSize: '16px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    whileHover={{ backgroundColor: '#F0EAE0' }}
                  >
                    <span style={{ fontSize: '18px' }}>{countriesPricing[country].flag}</span>
                    <span>{country}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
          <motion.button
            onClick={handleContinue}
            disabled={!answers[9]}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%', opacity: !answers[9] ? 0.5 : 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            متابعة
          </motion.button>
        </motion.div>
      )}

      {/* Screen 10: Pricing */}
      {currentStep === 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end d-flex flex-column justify-content-center"
          style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>سعر الاشتراك:</h2>
          
          {/* Price Box */}
          <div style={{ backgroundColor: '#F8F7F5', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1.5px solid #E8E4DC', textAlign: 'center' }}>
            <p style={{ fontSize: '48px', fontWeight: 800, color: '#2D2D2D', margin: '0' }}>
              {countriesPricing[answers[9]]?.price || 0}
            </p>
            <p style={{ fontSize: '14px', color: '#999', margin: '8px 0 0 0' }}>
              {answers[9]}
            </p>
          </div>

          <p style={{ fontSize: '16px', color: '#666', margin: '0 0 16px 0', textAlign: 'right' }}>
            وهذا السعر يشمل 5 دورات، وهي:
          </p>

          {/* Courses Box */}
          <div style={{ backgroundColor: '#F8F7F5', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1.5px solid #E8E4DC' }}>
            <div style={{ textAlign: 'right' }}>
              {[
                'الدورة الاحترافية',
                'دورة تسعير المنتجات',
                'دورة تصوير المنتجات بالموبايل',
                'دورة التسويق الإلكتروني',
                'دورة إدارة المشاريع',
                'المتابعة مع الدعم الفني لمدة عام كامل'
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '12px 0', gap: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#2D2D2D', fontWeight: 500 }}>{item}</span>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#7C6E5B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={() => setCurrentStep(11)}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            متابعة
          </motion.button>
        </motion.div>
      )}

      {/* Screen 11: Final */}
      {currentStep === 11 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center d-flex flex-column justify-content-center"
          style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '32px', fontWeight: 700 }}>شكراً لك!</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>سيتم التواصل معك قريباً</p>
          <motion.button
            onClick={() => setCurrentStep(1)}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%', maxWidth: '400px', margin: '0 auto' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            العودة للبداية
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
