import { useState } from 'react';
import { useQueryParam } from '@/hooks/useQueryParam';
import { useOnboarding } from '@/hooks/useOnboarding';
import { normalizeSrc, normalizeCountry } from '@/lib/api';
import Loading from './Loading';
import InvalidLink from './InvalidLink';

export default function Onboarding() {
  const srcParam = useQueryParam('src');
  const normalizedSrc = srcParam ? normalizeSrc(srcParam) : null;
  
  const { brand, countries, selectedCountry, loading, error, selectCountry, fetchPricing } =
    useOnboarding(normalizedSrc);

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Show loading while fetching brand data (but only if we have a src)
  if (normalizedSrc && loading && currentStep === 1) {
    return <Loading />;
  }

  // Show error if brand is invalid (but only if we tried to load it)
  if (normalizedSrc && error && currentStep === 1) {
    return <InvalidLink />;
  }

  // Show error if brand data is missing (but only if we tried to load it)
  if (normalizedSrc && !brand && currentStep === 1 && !loading) {
    return <InvalidLink />;
  }

  // Show error if no src parameter provided
  if (!srcParam && currentStep === 1) {
    return <InvalidLink />;
  }

  const handleAnswer = (step: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [step]: answer }));
  };

  const handleContinue = async () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 8 && selectedCountry) {
      // Fetch pricing when moving to pricing screen
      await fetchPricing(selectedCountry);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCountrySelect = (country: string) => {
    selectCountry(country);
  };

  const isContinueDisabled = () => {
    if (currentStep === 8) return !selectedCountry;
    if (currentStep <= 7) return !answers[currentStep];
    return false;
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{currentStep}/7</p>
        </div>

        {/* Screen 1: Entry */}
        {currentStep === 1 && brand && (
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{brand.title}</h1>
              <p className="text-muted-foreground">{brand.subtitle}</p>
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              تعرّفي الآن
            </button>
            <p className="text-xs text-muted-foreground">أكثر من 11000 امرأة بدأت رحلتهن معنا</p>
          </div>
        )}

        {/* Screen 2: Launch Timing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">لو كل شيء كان واضح وسهل…</h2>
              <p className="text-muted-foreground mt-2">متى حابة تطلقي مشروعك؟</p>
            </div>
            <div className="space-y-3">
              {['خلال 30 يوم 🌟', 'خلال 2–3 أشهر', 'ما زلت أستكشف الفكرة'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer(2, option);
                    handleContinue();
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-right ${
                    answers[2] === option
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-border hover:border-primary'
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
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">لما يبدأ مشروعك ينجح…</h2>
              <p className="text-muted-foreground mt-2">كيف حابة يكون دخله بالنسبة لك؟</p>
            </div>
            <div className="space-y-3">
              {['يغطي مصاريفي الشخصية', 'يساعدني وأدعم عائلتي', 'يكون مشروع العمر'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer(3, option);
                    handleContinue();
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-right ${
                    answers[3] === option
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-border hover:border-primary'
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
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">أكثر شيء مقلقك لما تفكري تبدئي مشروعك؟</h2>
            </div>
            <div className="space-y-3">
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
                  className={`w-full p-4 rounded-lg border-2 transition-all text-right ${
                    answers[4] === option
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-border hover:border-primary'
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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">طبيعي يكون عندك هاي المخاوف 🤍</h2>
              <p className="text-muted-foreground">لذلك فريق شوكودار بيكون معك خطوة بخطوة في:</p>
            </div>
            <div className="space-y-2 bg-card p-4 rounded-lg border border-border">
              {[
                'كيف تبدئي',
                'من وين توفري المواد الخام',
                'كيف تسعّري منتجاتك',
                'كيف تصوريهم باحترافية',
                'كيف تسوّقي على السوشال ميديا',
                'كيف تجيبي أول طلبية فعلية',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-primary">✔</span>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              تابعي الرحلة
            </button>
          </div>
        )}

        {/* Screen 6: Brand Identity */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">تخيّلي شكل علامتك الخاصة…</h2>
              <p className="text-muted-foreground mt-2">أي ستايل أقرب لشخصيتك؟</p>
            </div>
            <div className="space-y-3">
              {['فاخرة ومرتبة', 'عصرية وملونة', 'منزلية دافئة'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleAnswer(6, option);
                    handleContinue();
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-right ${
                    answers[6] === option
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-border hover:border-primary'
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
          <div className="space-y-6 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">78%</div>
              <h2 className="text-xl font-bold text-foreground mb-2">جاهزيتك ممتازة 👏</h2>
              <p className="text-muted-foreground">جاهزيتك لإطلاق مشروعك:</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-foreground mb-4">
                أنتِ قريبة جداً من إطلاق مشروعك وأول طلبية فعلية 🍫
              </p>
              <p className="text-sm text-muted-foreground">
                خليني أفرجيكي كيف نحول هذه الجاهزية إلى مشروع حقيقي خلال 30 يوم.
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              ▶ مشاهدة الفيديو
            </button>
          </div>
        )}

        {/* Screen 8: Country Selection */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">وحتى أقدر أحدد لك السعر بعملتك المحلية…</h2>
              <p className="text-muted-foreground mt-2">من أي دولة تتواصلي معنا؟</p>
            </div>
            <div className="space-y-2">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-right text-sm ${
                    selectedCountry === country
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
            <button
              onClick={handleContinue}
              disabled={isContinueDisabled()}
              className={`w-full py-3 rounded-lg font-medium transition-opacity ${
                isContinueDisabled()
                  ? 'bg-border text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              متابعة
            </button>
          </div>
        )}

        {/* Screen 9: Pricing */}
        {currentStep === 9 && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">سعر الاشتراك:</h2>
              <div className="bg-card p-6 rounded-lg border border-border mb-4">
                <div className="text-4xl font-bold text-primary">
                  497
                </div>
                <p className="text-muted-foreground text-sm mt-2">ريال سعودي</p>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                يشمل التدريب الكامل + الدعم
              </p>
            </div>
            <div className="space-y-3">
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                ابدأ مشروعي الآن 🚀
              </button>
              <button className="w-full py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:bg-opacity-5 transition-colors">
                عندي سؤال قبل الاشتراك
              </button>
              <button className="w-full py-2 text-muted-foreground text-sm hover:text-foreground transition-colors">
                غير مستعدة حالياً، سأتابع معكم على الواتساب
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              انضمي لأكثر من 11000 امرأة بدأت رحلتهن معنا
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
