import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Country {
  id: number;
  code: string;
  name: string;
  name_ar: string;
  currency: string;
  currency_symbol: string;
  price: number;
}

interface PaymentMethod {
  id: number;
  code: string;
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    full_name: '',
    phone: '',
    city: '',
    address: '',
    nearest_landmark: '',
    notes: '',
  });
  const [deliveryFormErrors, setDeliveryFormErrors] = useState<Record<string, string>>({});
  const [priceData, setPriceData] = useState<any>(null);
  const [brands] = useState([
    { src: 'chocodar', name: 'Chocodar' },
    { src: 'sapooon', name: 'Sapooon' },
    { src: 'cleanoosh', name: 'Cleanoosh' },
    { src: 'shomoo3', name: 'Shomoo3' },
    { src: 'koohla', name: 'Koohla' },
    { src: 'concrete', name: 'Concrete' },
  ]);
  
  // Video IDs for each brand
  const brandVideos: Record<string, string> = {
    'chocodar': 'dJjFfRiy6E4',
    'shomoo3': 'Rj9RS6Kojx4',
    'sapooon': 'NGAQzsoTc_w',
    'cleanoosh': 'dJjFfRiy6E4',
    'koohla': 'JEhGOoPrLMk',
    'concrete': 'JW5phMz61pw',
  };
  
  // Extract brand from URL parameter
  const getBrandFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('src') || null;
  };
  
  const selectedBrand = getBrandFromUrl();

  // Fetch countries when brand is selected
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        if (selectedBrand) {
          // Fetch brand-specific countries with updated currency data
          const response = await fetch(`${API_BASE_URL}/countries?src=${selectedBrand}&t=${new Date().getTime()}`);
          const data = await response.json();
          if (data.data && data.data.countries) {
            setCountries(data.data.countries);
          }
        } else {
          // Fallback to countries list if no brand selected
          const response = await fetch(`${API_BASE_URL}/countries-list`);
          const data = await response.json();
          setCountries(data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [selectedBrand]);

  // Fetch payment methods when country is selected
  useEffect(() => {
    if (selectedCountry) {
      const fetchPaymentMethods = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/payment-methods?country_code=${selectedCountry.code}`);
          const data = await response.json();
          setPaymentMethods(data.payment_methods || data || []);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching payment methods:', error);
          setLoading(false);
        }
      };
      fetchPaymentMethods();
    }
  }, [selectedCountry?.code]);
  
  // Fetch price when country or brand is selected
  useEffect(() => {
    if (selectedCountry && selectedBrand) {
      const fetchPrice = async () => {
        console.log("Fetching price for:", selectedBrand, selectedCountry?.code);
        try {
          const response = await fetch(`${API_BASE_URL}/price?src=${selectedBrand}&country=${selectedCountry.code}&t=${new Date().getTime()}`);
          const data = await response.json();
          if (data.data) {
            console.log("Price data received:", data.data);
            setPriceData(data.data);
            console.log("Price state updated to:", data.data.price);
          } else {
            console.log("No data in response:", data);
          }
        } catch (error) {
          console.error('Error fetching price:', error);
        }
      };
      fetchPrice();
    }
  }, [selectedCountry?.code, selectedBrand]);

  const handleAnswer = (step: number, answer: string) => {
    setAnswers({ ...answers, [step]: answer });
  };

  const handleContinue = () => {
    if (currentStep < 15) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    handleAnswer(10, country.name);
    setIsDropdownOpen(false);
  };

  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    handleAnswer(13, method.code);
    
    if (method.code === 'visa') {
      setCurrentStep(14);
    } else {
      if (selectedCountry) {
        try {
          const response = await fetch(`${API_BASE_URL}/payment-instructions?country=${selectedCountry.code}&method=${method.code}&src=${selectedBrand || 'Mknooon'}`);
          const data = await response.json();
          setPaymentInstructions(data);
        } catch (error) {
          console.error('Error fetching payment instructions:', error);
        }
      }
      setCurrentStep(14);
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/905344258184', '_blank');
  };

  // Get progress percentage (based on 14 main screens)
  const progressPercentage = (currentStep / 14) * 100;

  return (
    <div className="container-fluid bg-light h-[100svh] overflow-y-auto" style={{ paddingBottom: '40px' }}>
      {/* Progress Bar - Hidden on Screen 1 and decision screens */}
      {currentStep > 1 && currentStep !== 11 && currentStep !== 15 && (
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
              {currentStep}/14
            </span>
          </div>
        </div>
      )}

      {/* Screen 1: Entry */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center d-flex flex-column justify-content-between h-[100svh]"
          style={{ paddingTop: '60px', paddingBottom: '60px' }}
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
          style={{ paddingBottom: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
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
          style={{ paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>لما يبدأ مشروعك بنجح ويحقق إيرادات .. كيف حالة يكون دخله بالنسبة لك؟</h2>
          <div className="d-flex flex-column gap-2">
            {['يغطي مصاريفي الشخصية', 'يساعدني في دعم عائلتي', 'يكون مشروع العمر'].map((option) => (
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
          style={{ paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>أكثر شيء يتخافي منه لما تفكري تبدي مشروعك ؟</h2>
          <div className="d-flex flex-column gap-3">
            {['ما أعرف من وين أبدأ', 'ما أعرف أماكن بيع المواد الخام', 'ما أعرف أسعر وأسوق صح', 'ما أعرف أبيع وأحقق أرباح', 'جميع ما ذكر'].map((option) => (
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
          style={{ paddingTop: '0px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>طبيعي يكون عندك هاي المخاوف 🤍</h2>
          <p className="text-muted mb-4" style={{ fontSize: '14px', textAlign: 'right', direction: 'rtl' }}>لذلك فرقنا يكون معك خطوة بخطوة في:</p>
          <div className="d-flex flex-column gap-3">
            {['كيف تبدي', 'من وين توفري المواد الخام', 'كيف تسعري منتجاتك', 'كيف تصويرهم باحترافية', 'كيف تسوقي على السوشال ميديا', 'كيف تجيبي أول طلبية فعلية'].map((item, idx) => (
              <motion.div
                key={item}
                className="d-flex align-items-center gap-3"
                style={{ direction: 'rtl' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#8B7355', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: '18px' }}>✓</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 500, textAlign: 'right', flex: 1 }}>{item}</span>
              </motion.div>
            ))}
          </div>
          <motion.button
            onClick={() => handleContinue()}
            className="btn btn-dark fw-bold w-100 mt-5"
            style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تابعي الرحلة
          </motion.button>
        </motion.div>
      )}

      {/* Screen 6: Learning Style */}
      {currentStep === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>تختاري شكل علامتك الخاصة...أي سؤال أقرب لشخصيتك؟</h2>
          <div className="d-flex flex-column gap-3">
            {[{ title: 'فاخرة وفورية', desc: 'أنيقة، رائقة، رافية', color: '#D4AF37' }, { title: 'عصرية وملموسة', desc: 'حديثة، عصرية، ملموسة', color: '#4A90E2' }, { title: 'منزلية دافئة', desc: 'خصوصية، شخصية، دافئة', color: '#8B6F47' }].map((option) => (
              <motion.button
                key={option.title}
                onClick={() => { handleAnswer(6, option.title); handleContinue(); }}
                className={`btn py-4 fw-bold text-end d-flex flex-column align-items-start ${answers[6] === option.title ? 'btn-dark' : 'btn-outline-dark'}`}
                style={{ borderRadius: '12px', textAlign: 'right', direction: 'rtl', display: 'flex', width: '100%', gap: '4px', borderRight: `6px solid ${option.color}` }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: '16px', fontWeight: 600 }}>{option.title}</span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.8 }}>{option.desc}</span>
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
          style={{ paddingBottom: '40px' }}
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
                initial={{ strokeDasharray: '565.48px', strokeDashoffset: '565.48px' }}
                animate={{ strokeDashoffset: '141.37px' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '36px', fontWeight: 700 }}>75%</h2>
          <p className="text-muted mb-4" style={{ fontSize: '16px' }}>جاهزيتك عالية جداً!</p>
          <motion.button
            onClick={() => handleContinue()}
            className="btn btn-dark fw-bold w-100"
            style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تابعي
          </motion.button>
        </motion.div>
      )}

      {/* Screen 8: Video */}
      {currentStep === 8 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingBottom: '40px' }}
        >
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'right' }}>شاهدي فيديو راح يمكنك من عمل مشروعك</p>
          <div style={{ marginBottom: '30px', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe
              width="100%"
              height="300"
              src={`https://www.youtube.com/embed/${selectedBrand ? brandVideos[selectedBrand] || 'dJjFfRiy6E4' : 'dJjFfRiy6E4'}`}
              title="Mknooon Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'right', marginBottom: '30px', color: '#2D2D2D' }}>مستقبلك بعد مشروعك .. أفضل</h3>
          <motion.button
            onClick={handleContinue}
            className="btn btn-dark fw-bold py-3 px-5"
            style={{ borderRadius: '12px', fontSize: '16px', width: '100%' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تعرفي على تكلفة الاشتراك 🚀
          </motion.button>
        </motion.div>
      )}

      {/* Screen 9: Country Selection (Original) */}
      {currentStep === 9 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>وحتى نقدرتطيكي السعر حسب عملتك المحلية...</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'right' }}>من أي دولة تواصلي معنا؟</p>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '20px', textAlign: 'right' }}>اختاري دولتك</p>
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
                    key={country.id}
                    onClick={() => {
                      handleAnswer(9, country.name_ar);
                      setSelectedCountry(country);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      textAlign: 'right',
                      direction: 'rtl',
                      border: 'none',
                      borderBottom: '1px solid #F0EAE0',
                      backgroundColor: answers[9] === country.name_ar ? '#F0EAE0' : '#FFFFFF',
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
                    <span>{country.name_ar}</span>
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
      {currentStep === 10 && selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center d-flex flex-column justify-content-center"
          style={{ paddingTop: '8px', paddingBottom: '8px' }}
        >
          <h2 className="fw-bold text-dark" style={{ fontSize: '26px', fontWeight: 700, textAlign: 'right', marginBottom: '8px' }}>سعر الاشتراك:</h2>
          
          {/* Price Box */}
          <div style={{ backgroundColor: '#F8F7F5', padding: '12px 20px', borderRadius: '14px', marginBottom: '8px', border: '1.5px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#2D2D2D', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span>{priceData?.price}</span>
                <span style={{ fontSize: '16px', color: '#666' }}>{priceData?.currency_symbol}</span>
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

      {/* Screen 11: Decision Screen */}
      {currentStep === 11 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center d-flex flex-column h-[100svh]"
          style={{ paddingTop: '20px', paddingBottom: '40px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Title at Top */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ marginBottom: '20px' }}
          >
            <h2 className="fw-bold text-dark" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '1.4', textAlign: 'right', direction: 'rtl' }}>
              مشروعك أقرب مما تخيلي...<br />خلينا نبدأه صح.
            </h2>
          </motion.div>

          {/* Success Animation - Centered */}
          <motion.div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '30px' }}
          >
            {/* Checkmark Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 100 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#7C6E5B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                style={{ fontSize: '40px', color: '#fff', fontWeight: 'bold' }}
              >
                ✓
              </motion.span>
            </motion.div>

            {/* Buttons Section - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
            >
              <motion.button
                onClick={() => setCurrentStep(12)}
                className="btn fw-bold py-3 px-5"
                style={{ borderRadius: '12px', fontSize: '16px', width: '100%', backgroundColor: '#2D2D2D', color: '#fff', border: 'none' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ابدأ مشروعي الآن 🚀
              </motion.button>
              <motion.button
                onClick={openWhatsApp}
                className="btn fw-bold py-3 px-5"
                style={{ borderRadius: '12px', fontSize: '16px', width: '100%', backgroundColor: '#fff', color: '#2D2D2D', border: '1.5px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.347l-.355.192-.368-.06a9.879 9.879 0 00-3.464.608l.564 2.173 1.888-.959a9.877 9.877 0 018.368 2.52c.248.248.456.509.62.783l2.04-1.294a9.884 9.884 0 00-3.348-5.17z"/>
                </svg>
                عندي سؤال قبل الاشتراك
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Footer Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px', direction: 'rtl' }}>
              غير مستعدة حالياً؟ ستابعي معكم على الواتساب
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Screen 12: Payment Methods */}
      {currentStep === 12 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>اختاري طريقة الدفع</h2>
          
          {loading && <p style={{ textAlign: 'center', color: '#666' }}>جاري التحميل...</p>}
          
          {!loading && paymentMethods.length > 0 && (
            <div className="d-flex flex-column gap-3">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  onClick={() => handlePaymentMethodSelect(method)}
                  className="btn py-3 fw-bold text-end"
                  style={{ borderRadius: '12px', textAlign: 'right', direction: 'rtl', display: 'block', width: '100%', backgroundColor: '#F8F7F5', color: '#2D2D2D', border: '1.5px solid #E8E4DC' }}
                  whileHover={{ scale: 1.02, backgroundColor: '#F0EAE0' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {method.name}
                </motion.button>
              ))}
            </div>
          )}
          
          {!loading && paymentMethods.length === 0 && (
            <p style={{ textAlign: 'center', color: '#999' }}>لا توجد طرق دفع متاحة</p>
          )}
        </motion.div>
      )}



      {/* Screen 14: Payment Processing */}
      {currentStep === 14 && selectedPaymentMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingBottom: '40px' }}
        >
          {selectedPaymentMethod.code === 'visa' ? (
            <>
              <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>الدفع عبر Stripe</h2>
              <p style={{ fontSize: '14px', color: '#666', textAlign: 'right', marginBottom: '20px' }}>سيتم تحويلك إلى صفحة الدفع الآمنة</p>
              <motion.button
                onClick={() => setCurrentStep(15)}
                className="btn btn-dark fw-bold w-100 mt-4"
                style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                الانتقال إلى الدفع
              </motion.button>
            </>
          ) : (
            <>
              <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>{paymentInstructions?.title || 'تفاصيل الدفع'}</h2>
              {paymentInstructions && (
                <div>
                  {/* Instructions Text */}
                  {paymentInstructions.instructions && (
                    <p style={{ fontSize: '14px', color: '#2D2D2D', marginBottom: '20px', textAlign: 'right', direction: 'rtl', lineHeight: '1.6' }}>
                      {paymentInstructions.instructions}
                    </p>
                  )}
                  
                  {/* Fields List */}
                  {paymentInstructions.fields && Object.keys(paymentInstructions.fields).length > 0 && (
                    <div style={{ backgroundColor: '#F8F7F5', padding: '20px', borderRadius: '12px', marginBottom: '20px', textAlign: 'right', direction: 'rtl' }}>
                      {Object.entries(paymentInstructions.fields).map(([key, value]: [string, any]) => {
                        
                        const label = key;
                        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                        const isUrl = stringValue.startsWith('http://') || stringValue.startsWith('https://');
                        
                        return (
                          <div key={key} style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                            <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                              {isUrl ? (
                                <a href={stringValue} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline', wordBreak: 'break-all', display: 'block', padding: '6px 10px' }}>
                                  {stringValue}
                                </a>
                              ) : (
                                <code style={{ backgroundColor: '#fff', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', color: '#2D2D2D', wordBreak: 'break-all', display: 'block' }}>
                                  {stringValue}
                                </code>
                              )}
                            </div>
                            <strong style={{ fontSize: '14px', color: '#2D2D2D', minWidth: '120px', textAlign: 'left' }}>{label}:</strong>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {paymentInstructions?.requires_delivery_info && (
                <div style={{ backgroundColor: '#F8F7F5', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, textAlign: 'right', marginBottom: '15px', color: '#2D2D2D' }}>بيانات التوصيل</h3>
                  <p style={{ fontSize: '14px', color: '#2D2D2D', marginBottom: '15px', textAlign: 'right', direction: 'rtl', lineHeight: '1.6' }}>يرجى تعبئة البيانات التاليه</p>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', textAlign: 'right', color: '#2D2D2D' }}>الاسم الكامل *</label>
                    <input
                      type="text"
                      value={deliveryForm.full_name}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, full_name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'right', direction: 'rtl', boxSizing: 'border-box' }}
                    />
                    {deliveryFormErrors.full_name && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px', textAlign: 'right' }}>{deliveryFormErrors.full_name}</p>}
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', textAlign: 'right', color: '#2D2D2D' }}>الموبايل *</label>
                    <input
                      type="tel"
                      value={deliveryForm.phone}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                      placeholder="أدخل رقم جوالك"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'right', direction: 'rtl', boxSizing: 'border-box' }}
                    />
                    {deliveryFormErrors.phone && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px', textAlign: 'right' }}>{deliveryFormErrors.phone}</p>}
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', textAlign: 'right', color: '#2D2D2D' }}>المدينة *</label>
                    <input
                      type="text"
                      value={deliveryForm.city}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, city: e.target.value })}
                      placeholder="أدخل اسم مدينتك"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'right', direction: 'rtl', boxSizing: 'border-box' }}
                    />
                    {deliveryFormErrors.city && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px', textAlign: 'right' }}>{deliveryFormErrors.city}</p>}
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', textAlign: 'right', color: '#2D2D2D' }}>العنوان *</label>
                    <input
                      type="text"
                      value={deliveryForm.address}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                      placeholder="أدخل عنوانك التفصيلي"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'right', direction: 'rtl', boxSizing: 'border-box' }}
                    />
                    {deliveryFormErrors.address && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px', textAlign: 'right' }}>{deliveryFormErrors.address}</p>}
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', textAlign: 'right', color: '#2D2D2D' }}>أقرب نقطة دلالة *</label>
                    <input
                      type="text"
                      value={deliveryForm.nearest_landmark}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, nearest_landmark: e.target.value })}
                      placeholder="مثال: بجانب الجامع الأزرق"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'right', direction: 'rtl', boxSizing: 'border-box' }}
                    />
                    {deliveryFormErrors.nearest_landmark && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px', textAlign: 'right' }}>{deliveryFormErrors.nearest_landmark}</p>}
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', textAlign: 'right', color: '#2D2D2D' }}>ملاحظات إضافية</label>
                    <textarea
                      value={deliveryForm.notes}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
                      placeholder="أي ملاحظات إضافية؟"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'right', direction: 'rtl', minHeight: '80px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      const errors: Record<string, string> = {};
                      if (!deliveryForm.full_name) errors.full_name = 'الاسم مطلوب';
                      if (!deliveryForm.phone) errors.phone = 'الجوال مطلوب';
                      if (!deliveryForm.city) errors.city = 'المدينة مطلوبة';
                      if (!deliveryForm.address) errors.address = 'العنوان مطلوب';
                      if (!deliveryForm.nearest_landmark) errors.nearest_landmark = 'النقطة الدلالة مطلوبة';
                      
                      if (Object.keys(errors).length > 0) {
                        setDeliveryFormErrors(errors);
                        return;
                      }
                      
                      const brandName = brands.find(b => b.src === selectedBrand?.toLowerCase())?.name || 'Mknooon';
                      const message = `مرحباً، أريد الدفع عند الاستلام.\n\nالمبلغ: ${selectedCountry?.price} ${selectedCountry?.currency_symbol}\nالدولة: ${selectedCountry?.name_ar}\n\nبيانات العميل:\nالاسم: ${deliveryForm.full_name}\nالموبايل: ${deliveryForm.phone}\nالمدينة: ${deliveryForm.city}\nالعنوان: ${deliveryForm.address}\nأقرب نقطة دلالة: ${deliveryForm.nearest_landmark}${deliveryForm.notes ? `\nملاحظات: ${deliveryForm.notes}` : ''}`;
                      const phone = '905344258184';
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="btn fw-bold w-100 mt-4"
                    style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px', backgroundColor: '#25D366', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ارسل البيانات
                  </motion.button>
                </div>
              )}
              {paymentInstructions?.requires_receipt && !paymentInstructions?.requires_delivery_info && (
                <motion.button
                  onClick={() => {
                    const message = paymentInstructions.receipt_whatsapp.prefill;
                    const phone = paymentInstructions.receipt_whatsapp.phone.replace(/[^0-9]/g, '');
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="btn fw-bold w-100 mt-4"
                  style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px', backgroundColor: '#25D366', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  أرسل الإيصال عبر WhatsApp
                </motion.button>
              )}
              <motion.button
                onClick={() => setCurrentStep(15)}
                className="btn btn-dark fw-bold w-100 mt-4"
                style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                تابعي
              </motion.button>
            </>
          )}
        </motion.div>
      )}

      {/* Screen 15: Success */}
      {currentStep === 15 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center d-flex flex-column h-[100svh]"
          style={{ paddingTop: '60px', paddingBottom: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 100 }}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#7C6E5B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px'
            }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              style={{ fontSize: '50px', color: '#fff', fontWeight: 'bold' }}
            >
              ✓
            </motion.span>
          </motion.div>
          
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '32px', fontWeight: 700, lineHeight: '1.4' }}>
            شكراً لك!<br />تم استلام طلبك
          </h2>
          
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
            سيتم التواصل معك قريباً
          </p>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      {currentStep > 1 && currentStep < 12 && currentStep !== 13 && (
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
