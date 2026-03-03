import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeSrc } from '@/lib/api';
import Loading from './Loading';
import InvalidLink from './InvalidLink';

interface Brand {
  src: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  color_primary: string;
  color_accent: string;
  logo: string;
  video_url: string;
}

const countryData: Record<string, { name: string; flag: string }> = {
  'SA': { name: 'المملكة العربية السعودية', flag: '🇸🇦' },
  'AE': { name: 'الإمارات', flag: '🇦🇪' },
  'KW': { name: 'الكويت', flag: '🇰🇼' },
  'QA': { name: 'قطر', flag: '🇶🇦' },
  'BH': { name: 'البحرين', flag: '🇧🇭' },
  'OM': { name: 'عمان', flag: '🇴🇲' },
  'EG': { name: 'مصر', flag: '🇪🇬' },
  'JO': { name: 'الأردن', flag: '🇯🇴' },
  'LB': { name: 'لبنان', flag: '🇱🇧' },
};

export default function Onboarding() {
  const [src, setSrc] = useState<string | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Parse src from query string on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const srcParam = params.get('src');
    
    console.log('=== DEBUG INFO ===');
    console.log('window.location.href:', window.location.href);
    console.log('window.location.search:', window.location.search);
    console.log('srcParam from query:', srcParam);
    console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('==================');

    if (!srcParam) {
      setError('Missing src parameter');
      return;
    }

    const normalizedSrc = normalizeSrc(srcParam);
    setSrc(normalizedSrc);
  }, []);

  // Fetch brand and countries when src is available
  useEffect(() => {
    if (!src) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        
        console.log('Fetching brand from:', `${apiUrl}/brand?src=${src}`);

        // Fetch brand
        const brandResponse = await fetch(`${apiUrl}/brand?src=${src}`);
        const brandData = await brandResponse.json();

        console.log('Brand response:', brandData);

        if (!brandData.success) {
          setError(brandData.error || 'Failed to load brand data');
          return;
        }

        setBrand(brandData.data);

        // Fetch countries
        const countriesResponse = await fetch(`${apiUrl}/countries?src=${src}`);
        const countriesData = await countriesResponse.json();

        console.log('Countries response:', countriesData);

        if (countriesData.success) {
          setCountries(countriesData.data?.countries || []);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from server');
        setLoading(false);
      }
    };

    fetchData();
  }, [src]);

  // Show loading while fetching
  if (loading && currentStep === 1) {
    return <Loading />;
  }

  // Show error if src is missing or API failed
  if (!src || error) {
    return <InvalidLink />;
  }

  // Show error if brand data is missing
  if (!brand && currentStep === 1) {
    return <InvalidLink />;
  }

  const handleAnswer = (step: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [step]: answer }));
  };

  const handleContinue = async () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
  };

  const isContinueDisabled = () => {
    if (currentStep === 9) return !selectedCountry;
    if (currentStep <= 8) return !answers[currentStep];
    return false;
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: '#f5f1ed' }} dir="rtl">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        {/* Progress Bar - Only show from Screen 2 onwards */}
        {currentStep > 1 && (
          <div className="mb-4">
            <div className="progress mb-2" style={{ height: '4px' }}>
              <div
                className="progress-bar bg-dark"
                style={{ width: `${(currentStep / 11) * 100}%` }}
              />
            </div>
            <div className="text-end text-muted small">{currentStep}/10</div>
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
            <div>
              <h1 className="fw-bold text-dark mb-5" style={{ fontSize: '32px', fontWeight: 800 }}>Mknooon</h1>
            </div>

            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '32px', lineHeight: '1.3', fontWeight: 900 }}>
                رحلتك لإطلاق مشروعك تبدأ الآن
              </h2>
              <p className="text-muted mb-6" style={{ fontSize: '13px', lineHeight: '1.7', color: '#888' }}>
                3 دقائق فقط... وتعرّفي فيها .. هل انت جاهزة لإطلاق مشروعك ؟
              </p>
            </div>

            <div>
              <motion.button
                onClick={() => handleContinue()}
                className="btn btn-dark w-100 py-3 fw-bold mb-4"
                style={{ borderRadius: '12px', fontSize: '16px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                تعرفي على الفرصة
              </motion.button>
              <p className="text-muted small" style={{ fontSize: '13px', color: '#999' }}>
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
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">متى تريدين البدء؟</h2>
            <div className="d-flex flex-column gap-2">
              {['في أقرب وقت', 'خلال شهر', 'لم أقرر بعد'].map((option) => (
                <motion.button
                  key={option}
                  onClick={() => { handleAnswer(2, option); handleContinue(); }}
                  className={`btn py-3 fw-bold ${answers[2] === option ? 'btn-dark' : 'btn-outline-dark'}`}
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

        {/* Screen 3: Income Vision */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">كم دخلك المستهدف شهرياً؟</h2>
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

        {/* Screen 4: Main Obstacle */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">ما أكبر تحدي تواجهينه؟</h2>
            <div className="d-flex flex-column gap-2">
              {['عدم معرفة من أين أبدأ', 'قلة الوقت', 'الخوف من الفشل'].map((option) => (
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

        {/* Screen 5: Reassurance */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">هل لديك خبرة سابقة؟</h2>
            <div className="d-flex flex-column gap-2">
              {['نعم', 'لا، لكنني متحمسة', 'لا، وأنا قلقة'].map((option) => (
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

        {/* Screen 6: Brand Identity */}
        {currentStep === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">كيف تصفين نفسك؟</h2>
            <div className="d-flex flex-column gap-2">
              {['رائدة أعمال', 'موظفة تبحث عن دخل إضافي', 'ربة منزل'].map((option) => (
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

        {/* Screen 7: Readiness Result */}
        {currentStep === 7 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Large Circular Progress Indicator */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 30px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="200"
                height="200"
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - 0.78)}`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                  initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - 0.78) }}
                  transition={{ delay: 0.3, duration: 1 }}
                />
              </svg>
              {/* Percentage text */}
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a1a1a' }}>78%</div>
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
              style={{ marginBottom: '20px' }}
            >
              {/* First line with background */}
              <p className="text-dark mb-3" style={{
                fontSize: '15px',
                fontWeight: 600,
                lineHeight: '1.6',
                backgroundColor: '#f9f7f4',
                padding: '10px 12px',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                🎁 جاهزيتك لإطلاق مشروعك
              </p>
              {/* Second line without background */}
              <h3 className="fw-bold text-dark mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>
                🎉 جاهزيتك ممتازة
              </h3>
              {/* Third line without background */}
              <p className="text-muted mb-0" style={{ fontSize: '13px', lineHeight: '1.8', color: '#555' }}>
                إذا خليتي احكيلك الآن كيف تحول هذه الجاهزية إلى مشروع حقيقي خلال 30 يوم.
              </p>
            </motion.div>

            <motion.button
              onClick={handleContinue}
              className="btn btn-dark w-100 py-3 fw-bold"
              style={{ borderRadius: '12px', marginTop: '20px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              اضغطي هنا
            </motion.button>
          </motion.div>
        )}

        {/* Screen 8: Video Player - Only for Chocodar */}
        {currentStep === 8 && src === 'chocodar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">شوفي كيف نبدأ</h2>
            <motion.div
              className="mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ position: 'relative', paddingBottom: '177.78%', height: 0 }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                  src="https://www.youtube.com/embed/dJjFfRiy6E4?autoplay=0&rel=0&modestbranding=1"
                  title="Chocodar Journey"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
            <motion.button
              onClick={handleContinue}
              className="btn btn-dark w-100 py-3 fw-bold"
              style={{ borderRadius: '12px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              متابعة
            </motion.button>
          </motion.div>
        )}

        {/* Screen 8 (Alternative): Skip video for other brands */}
        {currentStep === 8 && src !== 'chocodar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">هل أنتِ مستعدة؟</h2>
            <motion.button
              onClick={handleContinue}
              className="btn btn-dark w-100 py-3 fw-bold"
              style={{ borderRadius: '12px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              متابعة
            </motion.button>
          </motion.div>
        )}

        {/* Screen 9: Country Selection - MODERN DROPDOWN */}
        {currentStep === 9 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="h5 fw-bold text-dark mb-3">من أي دولة أنتِ؟</h2>
            <p className="text-muted small mb-4">اختاري دولتك</p>
            
            <div className="position-relative mb-4">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn btn-outline-dark w-100 py-3 text-end d-flex justify-content-between align-items-center"
                style={{ borderRadius: '12px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>▼</span>
                <span>{selectedCountry ? countryData[selectedCountry]?.name : 'اختاري دولتك'}</span>
              </motion.button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="position-absolute w-100 bg-white border rounded mt-2"
                  style={{ top: '100%', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                >
                  {countries.map((country) => (
                    <motion.button
                      key={country}
                      onClick={() => {
                        handleCountrySelect(country);
                        setIsDropdownOpen(false);
                      }}
                      className="btn btn-link w-100 text-end py-3 text-dark text-decoration-none border-bottom"
                      style={{ borderRadius: 0 }}
                      whileHover={{ backgroundColor: '#f5f1ed' }}
                    >
                      <span className="me-2">{countryData[country]?.flag}</span>
                      {countryData[country]?.name}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <motion.button
              onClick={handleContinue}
              disabled={isContinueDisabled()}
              className="btn btn-dark w-100 py-3 fw-bold"
              style={{ borderRadius: '12px', opacity: isContinueDisabled() ? 0.5 : 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              متابعة
            </motion.button>
          </motion.div>
        )}

        {/* Screen 10: Pricing Display */}
        {currentStep === 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">سعر الاشتراك:</h2>
            <motion.div
              className="bg-white p-5 rounded mb-4"
              style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#1a1a1a' }}>497</div>
              <p className="text-muted mt-2" style={{ fontSize: '14px' }}>ريال سعودي</p>
              <p className="text-muted mt-3" style={{ fontSize: '13px', lineHeight: '1.6' }}>وهذا السعر يشمل 5 دورات، وهي:</p>
              
              <div className="text-start mt-4">
                <div className="d-flex align-items-center mb-2">
                  <span style={{ color: '#8b7355', marginLeft: '12px', fontSize: '18px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#333' }}>الدورة الاحترافية</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span style={{ color: '#8b7355', marginLeft: '12px', fontSize: '18px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#333' }}>دورة تسعير المنتجات</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span style={{ color: '#8b7355', marginLeft: '12px', fontSize: '18px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#333' }}>دورة تصوير المنتجات بالموبايل</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span style={{ color: '#8b7355', marginLeft: '12px', fontSize: '18px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#333' }}>دورة التسويق الإلكتروني</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span style={{ color: '#8b7355', marginLeft: '12px', fontSize: '18px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#333' }}>دورة إدارة المشاريع</span>
                </div>
                <div className="d-flex align-items-center">
                  <span style={{ color: '#8b7355', marginLeft: '12px', fontSize: '18px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#333' }}>المتابعة مع الدعم الفني لمدة عام كامل</span>
                </div>
              </div>
            </motion.div>
            <motion.button
              onClick={handleContinue}
              className="btn btn-dark w-100 py-3 fw-bold"
              style={{ borderRadius: '12px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              متابعة
            </motion.button>
            <p className="text-muted small mt-4" style={{ fontSize: '12px' }}>
              انضمي لأكثر من 11000 امرأة بدأت رحلتهن معنا
            </p>
          </motion.div>
        )}

        {/* Screen 11: Action Buttons */}
        {currentStep === 11 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="h5 fw-bold text-dark mb-4">ما الخطوة التالية؟</h2>
            <motion.div
              className="d-flex flex-column gap-3"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.button
                className="btn btn-dark py-3 fw-bold"
                style={{ borderRadius: '12px', fontSize: '16px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ابدأ مشروعي الآن 🚀
              </motion.button>
              <motion.button
                className="btn btn-outline-dark py-3 fw-bold"
                style={{ borderRadius: '12px', fontSize: '16px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                عندي سؤال قبل الاشتراك
              </motion.button>
              <motion.button
                className="btn btn-link text-muted text-decoration-none py-2"
                style={{ fontSize: '14px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                غير مستعدة حالياً، سأتابع معكم على الواتساب
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
