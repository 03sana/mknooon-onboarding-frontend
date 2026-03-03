import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const countriesPricing: Record<string, { price: number; flag: string; currency: string }> = {
    'السعودية': { price: 320, flag: '🇸🇦', currency: 'ريال' },
    'الإمارات العربية المتحدة': { price: 320, flag: '🇦🇪', currency: 'درهم' },
    'مصر': { price: 1250, flag: '🇪🇬', currency: 'جنيه' },
    'الأردن': { price: 30, flag: '🇯🇴', currency: 'دينار' },
    'لبنان': { price: 40, flag: '🇱🇧', currency: 'ليرة' },
    'قطر': { price: 290, flag: '🇶🇦', currency: 'ريال' },
    'الكويت': { price: 29, flag: '🇰🇼', currency: 'دينار' },
    'سلطنة عُمان': { price: 35, flag: '🇴🇲', currency: 'ريال' },
    'البحرين': { price: 40, flag: '🇧🇭', currency: 'دينار' },
    'ليبيا': { price: 295, flag: '🇱🇾', currency: 'دينار' },
    'المغرب': { price: 290, flag: '🇲🇦', currency: 'درهم' },
    'تونس': { price: 150, flag: '🇹🇳', currency: 'دينار' },
    'الجزائر': { price: 7000, flag: '🇩🇿', currency: 'دينار' },
    'العراق': { price: 60000, flag: '🇮🇶', currency: 'دينار' },
    'سوريا': { price: 4500, flag: '🇸🇾', currency: 'ليرة' },
    'السودان': { price: 95000, flag: '🇸🇩', currency: 'جنيه' },
    'اليمن': { price: 50, flag: '🇾🇪', currency: 'ريال' },
    'فلسطين - الضفة الغربية': { price: 280, flag: '🇵🇸', currency: 'شيقل' },
    'فلسطين - الداخل والقدس': { price: 390, flag: '🇵🇸', currency: 'شيقل' },
    'بريطانيا': { price: 100, flag: '🇬🇧', currency: 'جنيه' },
    'كندا': { price: 150, flag: '🇨🇦', currency: 'دولار' },
    'أمريكا': { price: 130, flag: '🇺🇸', currency: 'دولار' },
    'باقي الدول': { price: 130, flag: '🌍', currency: 'دولار' }
  };
  
  const countries = Object.keys(countriesPricing).sort();

  const handleAnswer = (step: number, answer: string) => {
    setAnswers({ ...answers, [step]: answer });
  };

  const handleContinue = () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get progress percentage
  const progressPercentage = (currentStep / 10) * 100;

  return (
    <div className="container-fluid bg-light" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Progress Bar - Hidden on Screen 1 */}
      {currentStep > 1 && (
        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ flex: 1, height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', marginRight: '10px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercentage}%`,
                  backgroundColor: '#2D2D2D',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#666', minWidth: '40px', textAlign: 'right' }}>
              {currentStep}/10
            </span>
          </div>
        </div>
      )}

      {/* Screen 1: Entry */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center d-flex flex-column justify-content-between"
          style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}
        >
          <div className="mb-3">
            <h1 className="fw-bold text-dark" style={{ fontSize: '18px', fontWeight: 800, marginBottom: '0' }}>Mknooon</h1>
          </div>

          <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '36px', lineHeight: '1.2', fontWeight: 800, letterSpacing: '-0.5px' }}>
              رحلتك لإطلاق<br />
              مشروعك تبدأ الآن
            </h2>
            <p className="text-muted mb-2" style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', fontWeight: 600 }}>
              3 دقائق فقط... وتعرّفي فيها ..
            </p>
            <p className="text-muted mb-6" style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', fontWeight: 600 }}>
              هل انت جاهزة لإطلاق مشروعك ؟
            </p>
          </div>

          <div>
            <motion.button
              onClick={handleContinue}
              className="btn btn-dark fw-bold py-3 px-5"
              style={{ borderRadius: '12px', fontSize: '16px', width: '100%' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              تعرفي على الفرصة
            </motion.button>
            <p className="text-muted mt-4" style={{ fontSize: '14px', color: '#999' }}>
              أكثر من 11000 امرأة بدأت رحلتها
            </p>
          </div>
        </motion.div>
      )}

        {/* Screen 2: Launch Timing */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-end"
            style={{ paddingTop: '80px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
          >
            <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>لو كانت التفاصيل واضحة وسهلة<br />...متى حابة تطلقي مشروعك؟</h2>
            <div className="d-flex flex-column gap-2">
            <motion.button
              onClick={() => { handleAnswer(2, 'خلال 30 يوم'); handleContinue(); }}
              className={`btn py-3 fw-bold text-end ${answers[2] === 'خلال 30 يوم' ? 'btn-dark' : 'btn-outline-dark'}`}
              style={{ borderRadius: '12px', textAlign: 'right', fontSize: '16px', direction: 'rtl', display: 'block', width: '100%' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span style={{ marginLeft: '8px' }}>✨</span>
              خلال 30 يوم
            </motion.button>
            <motion.button
              onClick={() => { handleAnswer(2, 'خلال 2-3 أشهر'); handleContinue(); }}
              className={`btn py-3 fw-bold text-end ${answers[2] === 'خلال 2-3 أشهر' ? 'btn-dark' : 'btn-outline-dark'}`}
              style={{ borderRadius: '12px', textAlign: 'right', fontSize: '16px', direction: 'rtl', display: 'block', width: '100%' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              خلال 2-3 أشهر
            </motion.button>
            <motion.button
              onClick={() => { handleAnswer(2, 'ما زلت أستكشف الفكرة'); handleContinue(); }}
              className={`btn py-3 fw-bold text-end ${answers[2] === 'ما زلت أستكشف الفكرة' ? 'btn-dark' : 'btn-outline-dark'}`}
              style={{ borderRadius: '12px', textAlign: 'right', fontSize: '16px', direction: 'rtl', display: 'block', width: '100%' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ما زلت أستكشف الفكرة
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Screen 3: Income Vision */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>كم دخلك المستهدف شهرياً؟</h2>
          <div className="d-flex flex-column gap-2">
            {['أقل من 5000 ريال', '5000 - 10000 ريال', 'أكثر من 10000 ريال'].map((option) => (
              <motion.button
                key={option}
                onClick={() => { handleAnswer(3, option); handleContinue(); }}
                className={`btn py-3 fw-bold text-end ${answers[3] === option ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px', textAlign: 'right', direction: 'rtl', display: 'block', width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 4: Experience Level */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>ما خبرتك في مجال عملك؟</h2>
          <div className="d-flex flex-column gap-2">
            {['مبتدئة تماماً', 'لدي خبرة بسيطة', 'لدي خبرة جيدة'].map((option) => (
              <motion.button
                key={option}
                onClick={() => { handleAnswer(4, option); handleContinue(); }}
                className={`btn py-3 fw-bold text-end ${answers[4] === option ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px', textAlign: 'right', direction: 'rtl', display: 'block', width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 5: Main Challenge */}
      {currentStep === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>ما أكبر تحدي تواجهينه؟</h2>
          <div className="d-flex flex-column gap-2">
            {['عدم معرفة من أين أبدأ', 'صعوبة التسويق', 'إدارة الوقت والمشروع'].map((option) => (
              <motion.button
                key={option}
                onClick={() => { handleAnswer(5, option); handleContinue(); }}
                className={`btn py-3 fw-bold text-end ${answers[5] === option ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px', textAlign: 'right', direction: 'rtl', display: 'block', width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 6: Learning Style */}
      {currentStep === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>كيف تفضلين التعلم؟</h2>
          <div className="d-flex flex-column gap-2">
            {['دورات تدريبية', 'ورش عمل حية', 'محتوى مكتوب'].map((option) => (
              <motion.button
                key={option}
                onClick={() => { handleAnswer(6, option); handleContinue(); }}
                className={`btn py-3 fw-bold text-end ${answers[6] === option ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px', textAlign: 'right', direction: 'rtl', display: 'block', width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 7: Readiness Score */}
      {currentStep === 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <motion.div style={{ marginBottom: '20px' }}>
            <svg width="140" height="140" viewBox="0 0 200 200" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" strokeWidth="8" />
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#2D2D2D"
                strokeWidth="8"
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                initial={{ strokeDasharray: `0 ${2 * Math.PI * 90}` }}
                animate={{ strokeDasharray: `${2 * Math.PI * 90 * 0.78} ${2 * Math.PI * 90}` }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
              <text x="100" y="110" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#2D2D2D">
                78%
              </text>
            </svg>
          </motion.div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#f9f7f4', padding: '10px', borderRadius: '8px', marginBottom: '10px', textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, margin: '0', color: '#2D2D2D' }}>
                🎁 جاهزيتك لإطلاق مشروعك
              </p>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: '#2D2D2D', textAlign: 'center' }}>
              🎉 جاهزيتك ممتازة
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.4', color: '#666', textAlign: 'center' }}>
              إذا خليتي احكيلك الآن كيف تحول هذه الجاهزية إلى مشروع حقيقي خلال 30 يوم.
            </p>
          </div>

          <motion.button
            onClick={handleContinue}
            className="btn btn-dark fw-bold"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%', padding: '10px 20px', marginBottom: '10px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            اضغطي هنا
          </motion.button>
        </motion.div>
      )}

      {/* Screen 8: Video */}
      {currentStep === 8 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '28px', fontWeight: 700, textAlign: 'right' }}>شاهدي هذا الفيديو</h2>
          <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe
              width="100%"
              height="300"
              src="https://www.youtube.com/embed/dJjFfRiy6E4"
              title="Mknooon Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            />
          </div>
          <motion.button
            onClick={handleContinue}
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
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
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
          className="text-center d-flex flex-column justify-content-center"
          style={{ paddingTop: '8px', paddingBottom: '8px' }}
        >
          <h2 className="fw-bold text-dark" style={{ fontSize: '26px', fontWeight: 700, textAlign: 'right', marginBottom: '8px' }}>سعر الاشتراك:</h2>
          
          {/* Price Box - Horizontal */}
          <div style={{ backgroundColor: '#F8F7F5', padding: '12px 20px', borderRadius: '14px', marginBottom: '8px', border: '1.5px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#2D2D2D', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span>{countriesPricing[answers[9]]?.price || 0}</span>
                <span style={{ fontSize: '16px', color: '#666' }}>{countriesPricing[answers[9]]?.currency || 'عملة'}</span>
              </p>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 6px 0', textAlign: 'right' }}>
            وهذا السعر يشمل 5 دورات، وهي:
          </p>

          {/* Courses Box */}
          <div style={{ backgroundColor: '#F8F7F5', padding: '28px 16px', borderRadius: '14px', marginBottom: '8px', border: '1.5px solid #E8E4DC' }}>
            <div style={{ textAlign: 'right' }}>
              {[
                'الدورة الاحترافية',
                'دورة تسعير المنتجات',
                'دورة تصوير المنتجات بالموبايل',
                'دورة التسويق الإلكتروني',
                'دورة إدارة المشاريع',
                'المتابعة مع الدعم الفني لمدة عام كامل'
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '10px 0', gap: '10px', direction: 'rtl' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#7C6E5B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>✓</span>
                  </div>
                  <span style={{ fontSize: '15px', color: '#2D2D2D', fontWeight: 500, lineHeight: '1.5' }}>{item}</span>
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
            اشتري الآن
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
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
            تم استقبال طلبك بنجاح. سنتواصل معك قريباً.
          </p>
          <motion.button
            onClick={() => setCurrentStep(1)}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            البداية من جديد
          </motion.button>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      {currentStep > 1 && currentStep < 11 && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingBottom: '40px' }}>
          <motion.button
            onClick={handleBack}
            className="btn btn-outline-dark fw-bold py-2 px-4"
            style={{ borderRadius: '12px', flex: 1, display: 'none' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            رجوع
          </motion.button>
        </div>
      )}
    </div>
  );
}
