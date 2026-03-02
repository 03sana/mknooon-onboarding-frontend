import { useState, useEffect } from 'react';
import { normalizeSrc } from '@/lib/api';
import Loading from './Loading';
import InvalidLink from './InvalidLink';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
  };

  const isContinueDisabled = () => {
    if (currentStep === 8) return !selectedCountry;
    if (currentStep <= 7) return !answers[currentStep];
    return false;
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: '#f5f1ed' }} dir="rtl">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="progress mb-2" style={{ height: '4px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`progress-bar ${i < currentStep ? 'bg-dark' : 'bg-secondary'}`}
                style={{ width: `${100 / 7}%` }}
              />
            ))}
          </div>
          <small className="text-muted">{currentStep}/7</small>
        </div>

        {/* Screen 1: Entry */}
        {currentStep === 1 && brand && (
          <div className="text-center">
            <h1 className="h3 fw-bold mb-2 text-dark">{brand.title}</h1>
            <p className="text-muted mb-4">{brand.subtitle}</p>
            <button
              onClick={handleContinue}
              className="btn btn-dark w-100 py-3 fw-bold"
            >
              تعرّفي الآن
            </button>
            <p className="text-muted small mt-3">أكثر من 11000 امرأة بدأت رحلتهن معنا</p>
          </div>
        )}

        {/* Screen 2: Launch Timing */}
        {currentStep === 2 && (
          <div>
            <h2 className="h5 fw-bold text-dark mb-2">لو كل شيء كان واضح وسهل…</h2>
            <p className="text-muted mb-4">متى حابة تطلقي مشروعك؟</p>
            <div className="d-flex flex-column gap-2">
              {['خلال 30 يوم 🌟', 'خلال 2–3 أشهر', 'ما زلت أستكشف الفكرة'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer(2, option);
                    handleContinue();
                  }}
                  className={`btn btn-outline-dark text-end py-3 ${
                    answers[2] === option ? 'btn-dark text-white' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen 3: Income Vision */}
        {currentStep === 3 && (
          <div>
            <h2 className="h5 fw-bold text-dark mb-2">لما يبدأ مشروعك ينجح…</h2>
            <p className="text-muted mb-4">كيف حابة يكون دخله بالنسبة لك؟</p>
            <div className="d-flex flex-column gap-2">
              {['يغطي مصاريفي الشخصية', 'يساعدني وأدعم عائلتي', 'يكون مشروع العمر'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer(3, option);
                    handleContinue();
                  }}
                  className={`btn btn-outline-dark text-end py-3 ${
                    answers[3] === option ? 'btn-dark text-white' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen 4: Main Obstacle */}
        {currentStep === 4 && (
          <div>
            <h2 className="h5 fw-bold text-dark mb-3">أكثر شيء مقلقك لما تفكري تبدئي مشروعك؟</h2>
            <div className="d-flex flex-column gap-2">
              {[
                'ما أعرف من وين أبدأ',
                'ما أعرف أماكن بيع المواد الخام',
                'ما أعرف أسعّر وأسوّق صح',
                'ما أعرف أبيع وأحقق أرباح',
                'جميع ما ذُكر',
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer(4, option);
                    handleContinue();
                  }}
                  className={`btn btn-outline-dark text-end py-3 ${
                    answers[4] === option ? 'btn-dark text-white' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen 5: Reassurance */}
        {currentStep === 5 && (
          <div className="text-center">
            <h2 className="h5 fw-bold text-dark mb-2">طبيعي يكون عندك هاي المخاوف 🤍</h2>
            <p className="text-muted mb-4">لذلك فريق شوكودار بيكون معك خطوة بخطوة في:</p>
            <div className="bg-white p-4 rounded mb-4 text-end">
              {[
                'كيف تبدئي',
                'من وين توفري المواد الخام',
                'كيف تسعّري منتجاتك',
                'كيف تصوريهم باحترافية',
                'كيف تسوّقي على السوشال ميديا',
                'كيف تجيبي أول طلبية فعلية',
              ].map((item) => (
                <div key={item} className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span className="text-dark">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleContinue}
              className="btn btn-dark w-100 py-3 fw-bold"
            >
              تابعي الرحلة
            </button>
          </div>
        )}

        {/* Screen 6: Brand Identity */}
        {currentStep === 6 && (
          <div>
            <h2 className="h5 fw-bold text-dark mb-2">تخيّلي شكل علامتك الخاصة…</h2>
            <p className="text-muted mb-4">أي ستايل أقرب لشخصيتك؟</p>
            <div className="d-flex flex-column gap-2">
              {['فاخرة ومرتبة', 'عصرية وملونة', 'منزلية دافئة'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer(6, option);
                    handleContinue();
                  }}
                  className={`btn btn-outline-dark text-end py-3 ${
                    answers[6] === option ? 'btn-dark text-white' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen 7: Readiness Result */}
        {currentStep === 7 && (
          <div className="text-center">
            <div className="display-1 fw-bold text-dark mb-2">78%</div>
            <h2 className="h5 fw-bold text-dark mb-2">جاهزيتك ممتازة 👏</h2>
            <p className="text-muted mb-4">جاهزيتك لإطلاق مشروعك:</p>
            <div className="bg-white p-4 rounded mb-4">
              <p className="text-dark mb-3">
                أنتِ قريبة جداً من إطلاق مشروعك وأول طلبية فعلية 🍫
              </p>
              <p className="text-muted small">
                خليني أفرجيكي كيف نحول هذه الجاهزية إلى مشروع حقيقي خلال 30 يوم.
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="btn btn-dark w-100 py-3 fw-bold"
            >
              ▶ مشاهدة الفيديو
            </button>
          </div>
        )}

        {/* Screen 8: Country Selection */}
        {currentStep === 8 && (
          <div>
            <h2 className="h5 fw-bold text-dark mb-2">وحتى تقدري تعطيكي السعر حسب عملتك المحلية…</h2>
            <p className="text-muted mb-4">من أي دولة تتواصلي معنا؟</p>
            
            {/* Dropdown */}
            <select
              value={selectedCountry || ''}
              onChange={(e) => handleCountrySelect(e.target.value)}
              className="form-select form-select-lg mb-4 text-end"
            >
              <option value="">اختاري دولتك</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {countryData[country]?.flag} {countryData[country]?.name}
                </option>
              ))}
            </select>

            {/* Countries List */}
            {selectedCountry && (
              <div className="list-group mb-4">
                {countries.map((country) => {
                  const data = countryData[country];
                  const isSelected = selectedCountry === country;
                  
                  return (
                    <button
                      key={country}
                      onClick={() => handleCountrySelect(country)}
                      className={`list-group-item list-group-item-action text-end d-flex justify-content-between align-items-center ${
                        isSelected ? 'active' : ''
                      }`}
                    >
                      <span>{data?.name}</span>
                      <span className="fs-5">{data?.flag}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={isContinueDisabled()}
              className="btn btn-dark w-100 py-3 fw-bold"
            >
              متابعة
            </button>
          </div>
        )}

        {/* Screen 9: Pricing */}
        {currentStep === 9 && (
          <div className="text-center">
            <h2 className="h5 fw-bold text-dark mb-4">سعر الاشتراك:</h2>
            <div className="bg-white p-4 rounded mb-4">
              <div className="display-4 fw-bold text-dark">497</div>
              <p className="text-muted small mt-2">ريال سعودي</p>
              <p className="text-muted small mt-3">يشمل التدريب الكامل + الدعم</p>
            </div>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-dark py-3 fw-bold">
                ابدأ مشروعي الآن 🚀
              </button>
              <button className="btn btn-outline-dark py-2 fw-bold">
                عندي سؤال قبل الاشتراك
              </button>
              <button className="btn btn-link text-muted text-decoration-none py-2">
                غير مستعدة حالياً، سأتابع معكم على الواتساب
              </button>
            </div>
            <p className="text-muted small mt-4">
              انضمي لأكثر من 11000 امرأة بدأت رحلتهن معنا
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
