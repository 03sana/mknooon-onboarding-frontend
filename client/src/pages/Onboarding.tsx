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

const API_BASE_URL = 'http://localhost:8000/api';

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

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/countries-list`);
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch payment methods when country is selected
  useEffect(() => {
    if (selectedCountry) {
      const fetchPaymentMethods = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/payment-methods?country_code=${selectedCountry.code}`);
          const data = await response.json();
          setPaymentMethods(data);
        } catch (error) {
          console.error('Error fetching payment methods:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPaymentMethods();
    }
  }, [selectedCountry]);

  // Fetch payment instructions when payment method is selected
  useEffect(() => {
    if (selectedPaymentMethod && selectedCountry) {
      const fetchPaymentInstructions = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/payment-instructions?country=${selectedCountry.code}&method=${selectedPaymentMethod.code}`);
          const data = await response.json();
          setPaymentInstructions(data);
          setDeliveryFormErrors({});
        } catch (error) {
          console.error('Error fetching payment instructions:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPaymentInstructions();
    }
  }, [selectedPaymentMethod, selectedCountry]);

  const handleDeliverySubmit = () => {
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

    const message = `مرحباً، أريد الدفع عند الاستلام.
المشروع: Mknooon
الدولة: ${selectedCountry?.name}

الاسم: ${deliveryForm.full_name}
الجوال: ${deliveryForm.phone}
المدينة: ${deliveryForm.city}
العنوان: ${deliveryForm.address}
أقرب نقطة دلالة: ${deliveryForm.nearest_landmark}
ملاحظات: ${deliveryForm.notes}`;

    const phone = '905344258184';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ height: '100svh', overflowY: 'auto', backgroundColor: '#fff', direction: 'rtl' }}>
      {/* Screen 1: Welcome */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h1 className="fw-bold text-dark mb-4" style={{ fontSize: '32px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            أهلاً وسهلاً في Mknooon
          </h1>
          <p style={{ fontSize: '16px', color: '#666', textAlign: 'right', marginBottom: '30px', lineHeight: '1.6' }}>
            رحلتك نحو مشروعك الخاص في صناعة الشوكولاتة تبدأ من هنا
          </p>
          <motion.button
            onClick={() => setCurrentStep(2)}
            className="btn btn-dark fw-bold w-100"
            style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ابدأي الآن
          </motion.button>
        </motion.div>
      )}

      {/* Screen 2: Income Purpose */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            لما يبدأ مشروعك بنجح ويحقق إيرادات .. كيف حالة يكون دخله بالنسبة لك؟
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['يغطي مصاريفي الشخصية', 'يساعدني في دعم عائلتي', 'يكون مشروع العمر'].map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setAnswers({ ...answers, 2: option });
                  setCurrentStep(3);
                }}
                className="btn btn-outline-dark fw-bold w-100"
                style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px', textAlign: 'right' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 3: Main Obstacles */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            أكثر شيء يتخافي منه لما تفكري تبدي مشروعك ؟
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['ما أعرف من وين أبدأ', 'ما أعرف أماكن بيع المواد الخام', 'ما أعرف أسعر وأسوق صح', 'ما أعرف أبيع وأحقق أرباح', 'جميع ما ذكر'].map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setAnswers({ ...answers, 3: option });
                  setCurrentStep(4);
                }}
                className="btn btn-outline-dark fw-bold w-100"
                style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px', textAlign: 'right' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 4: Reassurance */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            طبيعي يكون عندك هاي المخاوف 🤍
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {['كيف تبدي', 'من وين توفري المواد الخام', 'كيف تسعري منتجاتك', 'كيف تصويرهم باحترافية', 'كيف تسوقي على السوشال ميديا', 'كيف تجيبي أول طلبية فعلية'].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#F8F7F5', borderRadius: '8px' }}
              >
                <span style={{ color: '#2D2D2D', fontSize: '16px' }}>✓</span>
                <span style={{ color: '#2D2D2D', fontSize: '14px', textAlign: 'right' }}>{item}</span>
              </motion.div>
            ))}
          </div>
          <motion.button
            onClick={() => setCurrentStep(5)}
            className="btn btn-dark fw-bold w-100"
            style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تابعي الرحلة
          </motion.button>
        </motion.div>
      )}

      {/* Screen 5: Brand Style */}
      {currentStep === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '0px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5', paddingTop: '40px' }}>
            تختاري شكل علامتك الخاصة...أي سؤال أقرب لشخصيتك؟
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'فاخرة وفورية', desc: 'أنيقة، رائقة، رافية', color: '#D4AF37' },
              { label: 'عصرية وملموسة', desc: 'حديثة، عصرية، ملموسة', color: '#4A90E2' },
              { label: 'منزلية دافئة', desc: 'خصوصية، شخصية، دافئة', color: '#8B6F47' },
            ].map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setAnswers({ ...answers, 5: option.label });
                  setCurrentStep(6);
                }}
                style={{
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '16px',
                  textAlign: 'right',
                  backgroundColor: '#fff',
                  border: `6px solid ${option.color}`,
                  borderLeft: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{ scale: 1.02, backgroundColor: '#F8F7F5' }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ fontWeight: 700, color: '#2D2D2D', marginBottom: '4px' }}>{option.label}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{option.desc}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 6: Video */}
      {currentStep === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            شاهدي فيديو راح يمكنك من عمل مشروعك
          </h2>
          <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>الفيديو قصير - 2 دقيقة</p>
          <h3 style={{ fontSize: '18px', fontWeight: 700, textAlign: 'right', marginBottom: '20px', color: '#2D2D2D' }}>
            مستقبلك بعد مشروعك .. أفضل
          </h3>
          <motion.button
            onClick={() => setCurrentStep(7)}
            className="btn btn-dark fw-bold w-100"
            style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تعرفي على تكلفة الاشتراك 🚀
          </motion.button>
        </motion.div>
      )}

      {/* Screen 7: Pricing Intro */}
      {currentStep === 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            وحتى نقدرتطيكي السعر حسب عملتك المحلية...
          </h2>
          <p style={{ fontSize: '16px', color: '#666', textAlign: 'right', marginBottom: '30px', lineHeight: '1.6' }}>
            من أي دولة تواصلي معنا؟
          </p>
          <motion.button
            onClick={() => setCurrentStep(8)}
            className="btn btn-dark fw-bold w-100"
            style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            اختاري دولتك
          </motion.button>
        </motion.div>
      )}

      {/* Screen 8: Country Selection */}
      {currentStep === 8 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            اختاري دولتك
          </h2>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                textAlign: 'right',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {selectedCountry ? selectedCountry.name : 'اختاري دولة'}
            </button>
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  borderRadius: '0 0 8px 8px',
                }}
              >
                {countries.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      setIsDropdownOpen(false);
                      setCurrentStep(9);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      textAlign: 'right',
                      backgroundColor: selectedCountry?.code === country.code ? '#F8F7F5' : '#fff',
                    }}
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Screen 9: Pricing Display */}
      {currentStep === 9 && selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            سعر الاشتراك في {selectedCountry.name}
          </h2>
          <div style={{ backgroundColor: '#F8F7F5', padding: '30px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#2D2D2D', marginBottom: '10px' }}>
              {selectedCountry.price} {selectedCountry.currency_symbol}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>{selectedCountry.currency}</div>
          </div>
          <motion.button
            onClick={() => setCurrentStep(10)}
            className="btn btn-dark fw-bold w-100"
            style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            تابعي
          </motion.button>
        </motion.div>
      )}

      {/* Screen 10: Decision */}
      {currentStep === 10 && selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            هل تريدين البدء؟
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <motion.button
              onClick={() => setCurrentStep(11)}
              className="btn btn-dark fw-bold w-100"
              style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              نعم، أريد البدء
            </motion.button>
            <motion.button
              onClick={() => {
                const message = 'مرحباً، أريد معرفة المزيد عن دورة Mknooon';
                window.open(`https://wa.me/905344258184?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="btn btn-outline-dark fw-bold w-100"
              style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              أريد أسأل سؤال عبر WhatsApp
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Screen 11: Payment Methods */}
      {currentStep === 11 && selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>
            اختاري طريقة الدفع
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paymentMethods.map((method) => (
              <motion.button
                key={method.code}
                onClick={() => {
                  setSelectedPaymentMethod(method);
                  setCurrentStep(12);
                }}
                className="btn btn-outline-dark fw-bold w-100"
                style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px', textAlign: 'right' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {method.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen 12: Payment Processing */}
      {currentStep === 12 && selectedPaymentMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px' }}
        >
          {selectedPaymentMethod.code === 'visa' ? (
            <>
              <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'right', lineHeight: '1.5' }}>الدفع عبر Stripe</h2>
              <p style={{ fontSize: '14px', color: '#666', textAlign: 'right', marginBottom: '20px' }}>سيتم تحويلك إلى صفحة الدفع الآمنة</p>
              <motion.button
                onClick={() => setCurrentStep(13)}
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
                        // Use the key directly as the label (already in Arabic from backend)
                        const label = key;
                        
                        return (
                          <div key={key} style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                            <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                              <code style={{ backgroundColor: '#fff', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', color: '#2D2D2D', wordBreak: 'break-all', display: 'block' }}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </code>
                            </div>
                            <strong style={{ fontSize: '14px', color: '#2D2D2D', minWidth: '120px', textAlign: 'left' }}>{label}:</strong>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Form */}
              {paymentInstructions?.requires_delivery_info && (
                <div style={{ backgroundColor: '#F8F7F5', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, textAlign: 'right', marginBottom: '15px', color: '#2D2D2D' }}>بيانات التوصيل</h3>
                  
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
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', textAlign: 'right', color: '#2D2D2D' }}>الجوال *</label>
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
                </div>
              )}

              {/* Receipt Button for non-delivery methods */}
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

              {/* Delivery Submit Button */}
              {paymentInstructions?.requires_delivery_info && (
                <motion.button
                  onClick={handleDeliverySubmit}
                  className="btn fw-bold w-100 mt-4"
                  style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '16px', backgroundColor: '#25D366', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إرسال بيانات التوصيل عبر WhatsApp
                </motion.button>
              )}

              <motion.button
                onClick={() => setCurrentStep(13)}
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

      {/* Screen 13: Success */}
      {currentStep === 13 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end"
          style={{ paddingTop: '80px', paddingBottom: '40px', textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            style={{ fontSize: '80px', marginBottom: '20px' }}
          >
            ✓
          </motion.div>
          <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', lineHeight: '1.5' }}>
            شكراً لك!
          </h2>
          <p style={{ fontSize: '16px', color: '#666', textAlign: 'center', marginBottom: '30px', lineHeight: '1.6' }}>
            تم استقبال طلبك بنجاح. سنتواصل معك قريباً
          </p>
        </motion.div>
      )}
    </div>
  );
}
