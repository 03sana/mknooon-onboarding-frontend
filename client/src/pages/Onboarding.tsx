import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (step, answer) => {
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
              className={`btn py-3 fw-bold ${answers[2] === 'خلال 30 يوم' ? 'btn-dark' : 'btn-outline-dark'}`}
              style={{ borderRadius: '12px', textAlign: 'right', fontSize: '16px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span style={{ marginLeft: '8px' }}>✨</span>
              خلال 30 يوم
            </motion.button>
            <motion.button
              onClick={() => { handleAnswer(2, 'خلال 2-3 أشهر'); handleContinue(); }}
              className={`btn py-3 fw-bold ${answers[2] === 'خلال 2-3 أشهر' ? 'btn-dark' : 'btn-outline-dark'}`}
              style={{ borderRadius: '12px', textAlign: 'right', fontSize: '16px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              خلال 2-3 أشهر
            </motion.button>
            <motion.button
              onClick={() => { handleAnswer(2, 'ما زلت أستكشف الفكرة'); handleContinue(); }}
              className={`btn py-3 fw-bold ${answers[2] === 'ما زلت أستكشف الفكرة' ? 'btn-dark' : 'btn-outline-dark'}`}
              style={{ borderRadius: '12px', textAlign: 'right', fontSize: '16px' }}
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
          <h2 className="h5 fw-bold text-dark mb-4" style={{ textAlign: 'right' }}>كم دخلك المستهدف شهرياً؟</h2>
          <div className="d-flex flex-column gap-2">
            {['أقل من 5000 ريال', '5000 - 10000 ريال', 'أكثر من 10000 ريال'].map((option) => (
              <motion.button
                key={option}
                onClick={() => { handleAnswer(3, option); handleContinue(); }}
                className={`btn py-3 fw-bold ${answers[3] === option ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px' }}
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
          <h2 className="h5 fw-bold text-dark mb-4" style={{ textAlign: 'right' }}>ما خبرتك في مجال عملك؟</h2>
          <div className="d-flex flex-column gap-2">
            {['مبتدئة تماماً', 'لدي خبرة بسيطة', 'لدي خبرة جيدة'].map((option) => (
              <motion.button
                key={option}
                onClick={() => { handleAnswer(4, option); handleContinue(); }}
                className={`btn py-3 fw-bold ${answers[4] === option ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px' }}
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
          <h2 className="h5 fw-bold text-dark mb-4" style={{ textAlign: 'right' }}>ما أكبر تحدي تواجهينه؟</h2>
          <div className="d-flex flex-column gap-2">
            {['عدم معرفة من أين أبدأ', 'صعوبة التسويق', 'إدارة الوقت والمشروع'].map((option) => (
              <motion.button
                key={option}
                onClick={() => { handleAnswer(5, option); handleContinue(); }}
                className={`btn py-3 fw-bold ${answers[5] === option ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px' }}
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
          <h2 className="h5 fw-bold text-dark mb-4" style={{ textAlign: 'right' }}>كيف تفضلين التعلم؟</h2>
          <div className="d-flex flex-column gap-2">
            {['دورات تدريبية', 'ورش عمل حية', 'محتوى مكتوب'].map((option) => (
              <motion.button
                key={option}
                onClick={() => { handleAnswer(6, option); handleContinue(); }}
                className={`btn py-3 fw-bold ${answers[6] === option ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px' }}
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
          className="text-center d-flex flex-column justify-content-center"
          style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}
        >
          <div style={{ marginBottom: '40px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" strokeWidth="8" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#2D2D2D"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 90 * 0.78} ${2 * Math.PI * 90}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              <text x="100" y="110" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#2D2D2D">
                78%
              </text>
            </svg>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#f9f7f4', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'right' }}>
              <p style={{ fontSize: '18px', fontWeight: 600, margin: '0', color: '#2D2D2D' }}>
                🎁 جاهزيتك لإطلاق مشروعك
              </p>
            </div>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0', color: '#2D2D2D', textAlign: 'right' }}>
              🎉 جاهزيتك ممتازة
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', textAlign: 'right' }}>
              إذا خليتي احكيلك الآن كيف تحول هذه الجاهزية إلى مشروع حقيقي خلال 30 يوم.
            </p>
          </div>

          <motion.button
            onClick={handleContinue}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%' }}
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
          <h2 className="h5 fw-bold text-dark mb-4" style={{ textAlign: 'right' }}>شاهدي هذا الفيديو</h2>
          <div style={{ backgroundColor: '#e0e0e0', height: '300px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#999' }}>فيديو توضيحي</p>
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
          <h2 className="h5 fw-bold text-dark mb-4" style={{ textAlign: 'right' }}>اختاري دولتك</h2>
          <select
            onChange={(e) => { handleAnswer(9, e.target.value); }}
            className="form-select mb-3"
            style={{ borderRadius: '12px' }}
          >
            <option value="">اختاري دولة</option>
            <option value="السعودية">السعودية</option>
            <option value="الإمارات">الإمارات</option>
            <option value="مصر">مصر</option>
          </select>
          <motion.button
            onClick={handleContinue}
            disabled={!answers[9]}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%' }}
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
          style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}
        >
          <h2 className="fw-bold text-dark mb-5" style={{ fontSize: '32px', fontWeight: 700 }}>العرض الخاص</h2>
          
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '48px', fontWeight: 800, color: '#2D2D2D', margin: '0 0 10px 0' }}>
              497 ريال سعودي
            </p>
            <p style={{ fontSize: '16px', color: '#666', margin: '0 0 20px 0' }}>
              وهذا السعر يشمل 5 دورات، وهي:
            </p>

            <div style={{ textAlign: 'right', marginBottom: '30px' }}>
              {[
                'الدورة الاحترافية',
                'دورة تسعير المنتجات',
                'دورة تصوير المنتجات بالموبايل',
                'دورة التسويق الإلكتروني',
                'دورة إدارة المشاريع',
                'المتابعة مع الدعم الفني لمدة عام كامل'
              ].map((item, index) => (
                <p key={index} style={{ fontSize: '14px', color: '#666', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span style={{ marginLeft: '10px' }}>✓</span>
                  {item}
                </p>
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
            style={{ borderRadius: '12px', flex: 1 }}
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
