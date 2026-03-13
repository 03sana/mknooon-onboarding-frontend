import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StripePaymentFormWrapper } from "../components/StripePaymentForm";
import html2canvas from "html2canvas";

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

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Function to capture invoice and send to WhatsApp
const captureInvoiceImage = async (
  invoiceElementId: string,
  onImageReady: (imageUrl: string) => void
) => {
  try {
    const invoiceElement = document.getElementById(invoiceElementId);
    if (!invoiceElement) {
      console.error("Invoice element not found");
      return;
    }

    const canvas = await html2canvas(invoiceElement, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imageUrl = canvas.toDataURL("image/png");
    onImageReady(imageUrl);
  } catch (error) {
    console.error("Error capturing invoice:", error);
    alert("حدث خطأ في التقاط الصورة. يرجى المحاولة مرة أخرى.");
  }
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("");
  const [phoneCountryError, setPhoneCountryError] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    full_name: "",
    phone: "",
    city: "",
    address: "",
    nearest_landmark: "",
    notes: "",
  });
  const [deliveryFormErrors, setDeliveryFormErrors] = useState<
    Record<string, string>
  >({});
  const [priceData, setPriceData] = useState<any>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceImageUrl, setInvoiceImageUrl] = useState<string | null>(null);
  const brandColors: Record<string, string> = {
    chocodar: "#6B3F2A",
    sapooon: "#4A7C59",
    cleanoosh: "#2C5F8D",
    shomoo3: "#8B6F47",
    koohla: "#C85A54",
    concrete: "#5A5A5A",
  };

  const [brands] = useState([
    { src: "chocodar", name: "Chocodar" },
    { src: "sapooon", name: "Sapooon" },
    { src: "cleanoosh", name: "Cleanoosh" },
    { src: "shomoo3", name: "Shomoo3" },
    { src: "koohla", name: "Koohla" },
    { src: "concrete", name: "Concrete" },
    { src: "koohla", name: "Koohla" },
    { src: "concrete", name: "Concrete" },
  ]);

  // Video IDs for each brand
  const brandVideos: Record<string, string> = {
    chocodar: "dJjFfRiy6E4",
    shomoo3: "Rj9RS6Kojx4",
    sapooon: "NGAQzsoTc_w",
    cleanoosh: "dJjFfRiy6E4",
    koohla: "JEhGOoPrLMk",
    concrete: "JW5phMz61pw",
  };

  // Extract brand from URL parameter
  const getBrandFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("src") || null;
  };

  const selectedBrand = getBrandFromUrl();

  // Fetch course data and countries when course is selected
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        if (selectedBrand) {
          // Fetch course-specific data with countries and prices
          const response = await fetch(
            `${API_BASE_URL}/course?src=${selectedBrand}&t=${new Date().getTime()}`
          );
          const data = await response.json();
          if (data.data) {
            // Store full course data
            setCourseData(data.data);

            if (data.data.prices) {
              // Extract unique countries from prices array
              const countriesMap = new Map();
              data.data.prices.forEach((price: any, idx: number) => {
                if (!countriesMap.has(price.country_code)) {
                  countriesMap.set(price.country_code, {
                    id: idx,
                    code: price.country_code,
                    name: price.country_name,
                    name_ar: price.country_name_ar || price.country_name,
                    currency: price.currency,
                    currency_symbol: price.currency_symbol,
                    price: parseFloat(price.price),
                  });
                }
              });
              // Sort countries alphabetically by Arabic name
              const sortedCountries = Array.from(countriesMap.values()).sort(
                (a, b) => a.name_ar.localeCompare(b.name_ar, "ar")
              );
              setCountries(sortedCountries);
            }
          }
        } else {
          // Fallback to countries list if no course selected
          const response = await fetch(`${API_BASE_URL}/countries-list`);
          const data = await response.json();
          setCountries(data);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [selectedBrand]);

  // Fetch payment methods when country is selected
  useEffect(() => {
    if (selectedCountry) {
      const fetchPaymentMethods = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${API_BASE_URL}/payment-methods?country_code=${selectedCountry.code}`
          );
          const data = await response.json();
          setPaymentMethods(data.payment_methods || data || []);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching payment methods:", error);
          setLoading(false);
        }
      };
      fetchPaymentMethods();
    }
  }, [selectedCountry?.code]);

  // Fetch price when country or course is selected
  useEffect(() => {
    if (selectedCountry && selectedBrand) {
      const fetchPrice = async () => {
        console.log(
          "Fetching price for:",
          selectedBrand,
          selectedCountry?.code
        );
        try {
          const response = await fetch(
            `${API_BASE_URL}/course-price?src=${selectedBrand}&country=${selectedCountry.code}&t=${new Date().getTime()}`
          );
          const data = await response.json();
          if (data.data) {
            console.log("Price data received:", data.data);
            setPriceData(data.data);
            console.log("Price state updated to:", data.data.price);
          } else {
            console.log("No data in response:", data);
          }
        } catch (error) {
          console.error("Error fetching price:", error);
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

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    handleAnswer(13, method.code);

    // Navigate to Screen 13 for all payment methods
    setCurrentStep(13);

    if (method.code !== "visa" && method.code !== "mastercard") {
      // Fetch payment instructions in parallel (non-blocking)
      if (selectedCountry) {
        fetch(
          `${API_BASE_URL}/payment-instructions?country=${selectedCountry.code}&method=${method.code}&src=${selectedBrand || "Mknooon"}`
        )
          .then(response => response.json())
          .then(data => setPaymentInstructions(data))
          .catch(error =>
            console.error("Error fetching payment instructions:", error)
          );
      }
    }
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/905344258184", "_blank");
  };

  // Get progress percentage (based on 14 main screens)
  const progressPercentage = (currentStep / 14) * 100;

  return (
    <>
      <div
        className="container-fluid h-[100svh] overflow-auto"
        style={{
          paddingBottom: "0px",
          position: "relative",
          zIndex: 10,
          backgroundColor: "transparent",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen1-bg-pattern-gtuN3TCCUfUab9ymxFpqgz.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          height: "100vh",
          maxHeight: "100vh",
        }}
      >
        {/* Progress Bar - Hidden on Screen 1 and decision screens */}
        {currentStep > 1 && currentStep !== 11 && currentStep !== 15 && (
          <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "4px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "2px",
                  marginRight: "10px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercentage}%`,
                    backgroundColor: "#d97a6f",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#666",
                  minWidth: "40px",
                  textAlign: "right",
                }}
              >
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
            className="d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "24px",
              paddingBottom: "24px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
            }}
          >
            {/* App Name - Top */}
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: "0",
                right: "0",
                textAlign: "center",
                zIndex: 20,
              }}
            >
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  margin: 0,
                  color: "#1a1a1a",
                }}
              >
                Mknooon
              </h1>
            </div>

            {/* Card - Centered */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                borderRadius: "28px",
                padding: "48px 28px",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                minHeight: "340px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                maxWidth: "85%",
                width: "100%",
                gap: "16px",
                margin: "0 auto",
                marginTop: "123px",
              }}
            >
              {/* Main Title */}
              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  lineHeight: "1.35",
                  margin: "0 0 8px 0",
                  letterSpacing: "-0.3px",
                }}
              >
                رحلتك لتغيير
                <br />
                مستقبلك تبدا الان
              </h2>

              {/* Question Text */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  fontWeight: 500,
                  margin: "0 0 20px 0",
                  lineHeight: "1.5",
                }}
              >
                اكتشفي هل انت جاهزة لاطلاق مشروعك؟
              </p>

              {/* CTA Button */}
              <motion.button
                onClick={handleContinue}
                style={{
                  borderRadius: "14px",
                  fontSize: "16px",
                  fontWeight: 700,
                  width: "100%",
                  maxWidth: "280px",
                  height: "50px",
                  backgroundColor: "#d97a6f",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 6px 20px rgba(217, 122, 111, 0.3)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                تعرَّفي الان
              </motion.button>

              {/* Social Proof */}
              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  margin: "8px 0 0 0",
                  fontWeight: 500,
                }}
              >
                أكثر من 12000 امرأة بدأت رحلتها
              </p>
            </div>
          </motion.div>
        )}

        {/* Screen 2: Launch Timing */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-end d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "0px",
              paddingBottom: "140px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
            }}
          >
            {/* Question */}
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: "16px",
                marginTop: "0",
                lineHeight: "1.6",
              }}
            >
              لو كانت التفاصيل واضحة وسهلة
              <br />
              ...متى حابة تطلقي مشروعك؟
            </h2>

            {/* Options */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              {[
                { id: "now", label: "الآن 🚀", subtitle: "أنا جاهزة!" },
                {
                  id: "month",
                  label: "خلال شهر 📅",
                  subtitle: "بحاجة لتحضيرات",
                },
                {
                  id: "quarter",
                  label: "خلال 3 أشهر ⏳",
                  subtitle: "بدي وقت أكثر",
                },
                { id: "unsure", label: "لسه ما قررت 🤔", subtitle: "بدي أفكر" },
              ].map(option => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(2, option.id);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border:
                      answers[2] === option.id
                        ? "2px solid #d97a6f"
                        : "1px solid #e0e0e0",
                    backgroundColor:
                      answers[2] === option.id
                        ? "rgba(217, 122, 111, 0.1)"
                        : "#f9f9f9",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ backgroundColor: "rgba(217, 122, 111, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                    }}
                  >
                    {option.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      marginTop: "4px",
                    }}
                  >
                    {option.subtitle}
                  </div>
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
            className="text-end d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "0px",
              paddingBottom: "140px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
            }}
          >
            {/* Question */}
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: "16px",
                marginTop: "0",
                lineHeight: "1.6",
              }}
            >
              لما يبدأ مشروعك ينجح ويحقق إيرادات..
              <br />
              كيف حابة يكون دخله بالنسبة لك؟
            </h2>

            {/* Options */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              {[
                {
                  id: "personal",
                  label: "يغطي مصاريفي الشخصية 💰",
                  subtitle: "استقلالية مالية",
                },
                {
                  id: "family",
                  label: "يساعدني في دعم عائلتي 👨‍👩‍👧",
                  subtitle: "دعم الأحبة",
                },
                {
                  id: "dream",
                  label: "يكون مشروع العمر 🎯",
                  subtitle: "حلم كبير",
                },
              ].map(option => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(3, option.id);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border:
                      answers[3] === option.id
                        ? "2px solid #d97a6f"
                        : "1px solid #e0e0e0",
                    backgroundColor:
                      answers[3] === option.id
                        ? "rgba(217, 122, 111, 0.1)"
                        : "#f9f9f9",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ backgroundColor: "rgba(217, 122, 111, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                    }}
                  >
                    {option.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      marginTop: "4px",
                    }}
                  >
                    {option.subtitle}
                  </div>
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
            className="text-end d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "0px",
              paddingBottom: "140px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
            }}
          >
            {/* Question */}
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: "16px",
                marginTop: "0",
                lineHeight: "1.6",
              }}
            >
              أكثر شيء بتخافي منه
              <br />
              لما تفكري تبدي مشروعك؟
            </h2>

            {/* Options */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              {[
                {
                  id: "start",
                  label: "ما أعرف من وين أبدأ 🤔",
                  subtitle: "البداية الصحيحة",
                },
                {
                  id: "materials",
                  label: "ما أعرف أماكن المواد 📋",
                  subtitle: "توفر المواد",
                },
                {
                  id: "pricing",
                  label: "ما أعرف أسعر وأسوق 💰",
                  subtitle: "التسعير والتسويق",
                },
                {
                  id: "sales",
                  label: "ما أعرف أبيع وأحقق إيرادات 📈",
                  subtitle: "المبيعات والأرباح",
                },
                { id: "all", label: "جميع ما ذكر ⚠️", subtitle: "كل الخوف" },
              ].map(option => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(4, option.id);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border:
                      answers[4] === option.id
                        ? "2px solid #d97a6f"
                        : "1px solid #e0e0e0",
                    backgroundColor:
                      answers[4] === option.id
                        ? "rgba(217, 122, 111, 0.1)"
                        : "#f9f9f9",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ backgroundColor: "rgba(217, 122, 111, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                    }}
                  >
                    {option.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      marginTop: "4px",
                    }}
                  >
                    {option.subtitle}
                  </div>
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
            className="text-end d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "0px",
              paddingBottom: "140px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
            }}
          >
            {/* Title */}
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: "16px",
                marginTop: "0",
                lineHeight: "1.6",
              }}
            >
              طبيعي يكون عندك هذه المخاوف 🤍
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                textAlign: "center",
                marginBottom: "16px",
                marginTop: "0",
              }}
            >
              لذلك فرقنا يكون معك خطوة بخطوة في:
            </p>

            {/* Checklist Items */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              {[
                { emoji: "🎯", title: "كيف تبدي" },
                { emoji: "📦", title: "من وين توفري المواد الخام" },
                { emoji: "💰", title: "كيف تسعري منتجاتك" },
                { emoji: "📸", title: "كيف تصوريهم باحترافية" },
                { emoji: "📱", title: "كيف تسوقي على السوشال ميديا" },
                { emoji: "🛒", title: "كيف تجيبي أول طلبية" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontSize: "15px",
                    direction: "rtl",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "12px",
                    border: "1px solid #e0e0e0",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "#d97a6f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: "#333" }}>
                      {item.title} {item.emoji}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                width: "100%",
                gap: "12px",
              }}
            >
              <motion.button
                onClick={handleContinue}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#d97a6f",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  flex: 1,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                تابعي
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 6: Brand Personality */}
        {currentStep === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-end d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "0px",
              paddingBottom: "140px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
            }}
          >
            {/* Question */}
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: "16px",
                marginTop: "0",
                lineHeight: "1.6",
              }}
            >
              لما تطلقي مشروعك،
              <br />
              كيف بتحبي تكون علامتك التجارية؟{" "}
            </h2>
            {/* Brand Personality Cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
              }}
            >
              {[
                {
                  id: "luxury",
                  title: "فاخرة وفريدة",
                  subtitle: "أنيقة، راقية، فاخرة",
                  illustration:
                    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen6-luxury-doodle-nkMcRsg7L5Kk3gxNmjhUJx.webp",
                  accentColor: "#D4AF37",
                },
                {
                  id: "modern",
                  title: "عصرية حيوية",
                  subtitle: "حديثة، عصرية، ملموسة",
                  illustration:
                    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen6-modern-doodle-aVa7twdnSf9ToPY6N6EvpG.webp",
                  accentColor: "#4A90E2",
                },
                {
                  id: "cozy",
                  title: "منزلية دافئة",
                  subtitle: "خصوصية، شخصية، دافئة",
                  illustration:
                    "https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen6-cozy-doodle-UPxianzYRjTKXd9tQ6QShu.webp",
                  accentColor: "#8B6F47",
                },
              ].map(option => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(6, option.id);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border:
                      answers[6] === option.id
                        ? `2px solid ${option.accentColor}`
                        : "2px solid #e0e0e0",
                    backgroundColor:
                      answers[6] === option.id
                        ? "rgba(255, 255, 255, 0.9)"
                        : "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    direction: "rtl",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    width: "100%",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      borderRadius: "8px",
                      backgroundColor: `${option.accentColor}15`,
                    }}
                  >
                    <img
                      src={option.illustration}
                      alt={option.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "8px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#1a1a1a",
                      }}
                    >
                      {option.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {option.subtitle}
                    </div>
                  </div>
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
            className="text-end d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "0px",
              paddingBottom: "140px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Card Container */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.70)",
                borderRadius: "20px",
                padding: "48px 32px",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                maxWidth: "450px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Circular Progress */}
              <motion.div style={{ marginBottom: "32px" }}>
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 200 200"
                  style={{ margin: "0 auto", display: "block" }}
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#d97a6f"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{
                      strokeDasharray: "565.48px",
                      strokeDashoffset: "565.48px",
                    }}
                    animate={{ strokeDashoffset: "141.37px" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <text
                    x="100"
                    y="110"
                    textAnchor="middle"
                    fontSize="48"
                    fontWeight="700"
                    fill="#d97a6f"
                  >
                    78%
                  </text>
                </svg>
              </motion.div>

              {/* Title with emoji */}
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  textAlign: "center",
                  marginBottom: "12px",
                  marginTop: "0",
                }}
              >
                🚀 جاهزيتك لإطلاق مشروعك
              </h2>

              {/* Subtitle with emoji */}
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#d97a6f",
                  textAlign: "center",
                  marginBottom: "16px",
                  marginTop: "0",
                }}
              >
                ✨ جاهزيتك ممتازة
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  textAlign: "center",
                  marginBottom: "32px",
                  marginTop: "0",
                  lineHeight: "1.6",
                }}
              >
                خليني اشرحلك كيف راح نساعدك لتحويل هذه الجاهزية لمشروع حقيقي.
              </p>

              {/* Continue Button - Centered */}
              <motion.button
                onClick={() => handleContinue()}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#d97a6f",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: "280px",
                  margin: "0 auto",
                  display: "block",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                اكتشفي الان{" "}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 8: Video */}
        {currentStep === 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-end d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "0px",
              paddingBottom: "140px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Card Container */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.70)",
                borderRadius: "20px",
                padding: "48px 32px",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                maxWidth: "450px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Subtitle */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "20px",
                  marginTop: "0",
                  textAlign: "center",
                }}
              >
                هذا الفيديو بشرح كل تفاصيل التدريب{" "}
              </p>

              {/* Video Container */}
              <div
                style={{
                  marginBottom: "30px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <iframe
                  width="100%"
                  height="250"
                  src={`https://www.youtube.com/embed/${selectedBrand ? brandVideos[selectedBrand] || "dJjFfRiy6E4" : "dJjFfRiy6E4"}`}
                  title="Mknooon Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "12px" }}
                />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: "30px",
                  marginTop: "0",
                  color: "#1a1a1a",
                }}
              >
                مستقبلك بعد مشروعك .. أفضل
              </h3>

              {/* Continue Button */}
              <motion.button
                onClick={handleContinue}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#d97a6f",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: "280px",
                  margin: "0 auto",
                  display: "block",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                تعرفي على تكلفة التدريب 🚀
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 9: Country Selection (Original) */}
        {currentStep === 9 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-end"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.70)",
                borderRadius: "20px",
                padding: "43px 32px",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                maxWidth: "450px",
                width: "100%",
                marginBottom: "259px",
              }}
            >
              <h2
                className="fw-bold text-dark mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  textAlign: "right",
                  lineHeight: "1.5",
                }}
              >
                حتى نقدر نعطيكي السعر حسب عملتك المحلية...
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#16191d",
                  marginBottom: "20px",
                  textAlign: "right",
                }}
              >
                اختاري دولتك
              </p>
              <div
                style={{
                  position: "relative",
                  marginBottom: "20px",
                  width: "100%",
                }}
              >
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    width: "100%",
                    borderRadius: isDropdownOpen ? "10px 10px 0 0" : "10px",
                    border: "1.5px solid #D9D5CF",
                    borderBottom: isDropdownOpen
                      ? "none"
                      : "1.5px solid #D9D5CF",
                    padding: "14px 16px",
                    fontSize: "16px",
                    fontWeight: 500,
                    backgroundColor: "#FFFFFF",
                    color: answers[9] ? "#2D2D2D" : "#999",
                    direction: "rtl",
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "8px",
                    transition: "all 0.2s ease",
                    boxShadow: isDropdownOpen
                      ? "0 0 0 3px rgba(124, 110, 91, 0.1)"
                      : "0 1px 3px rgba(0, 0, 0, 0.05)",
                    cursor: "pointer",
                  }}
                  whileHover={{ backgroundColor: "#FAFAF8" }}
                >
                  <span>{answers[9] || "اختاري دولة"}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7C6E5B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </motion.button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      right: 0,
                      backgroundColor: "#FFFFFF",
                      border: "1.5px solid #D9D5CF",
                      borderRadius: "10px",
                      zIndex: 10,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {countries.map(country => (
                      <motion.button
                        key={country.id}
                        onClick={() => {
                          handleAnswer(9, country.name_ar);
                          setSelectedCountry(country);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          textAlign: "right",
                          direction: "rtl",
                          border: "none",
                          borderBottom: "1px solid #F0EAE0",
                          backgroundColor:
                            answers[9] === country.name_ar
                              ? "#F0EAE0"
                              : "#FFFFFF",
                          color: "#2D2D2D",
                          fontSize: "16px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        whileHover={{ backgroundColor: "#F0EAE0" }}
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
                style={{
                  borderRadius: "12px",
                  fontSize: "16px",
                  width: "100%",
                  marginTop: "20px",
                  opacity: !answers[9] ? 0.5 : 1,
                  backgroundColor: "#d97a6f",
                  color: "#FFFFFF",
                  border: "none",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                متابعة
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 10: Pricing */}
        {currentStep === 10 && selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.70)",
                borderRadius: "20px",
                padding: "43px 32px",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                maxWidth: "450px",
                width: "100%",
                marginBottom: "259px",
              }}
            >
              <h2
                className="fw-bold text-dark mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  textAlign: "right",
                  lineHeight: "1.5",
                }}
              >
                سعر الاشتراك
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "20px",
                  textAlign: "right",
                }}
              >
                في {selectedCountry?.name_ar}
              </p>

              {/* Price Display */}
              <div
                style={{
                  backgroundColor: "transparent",
                  padding: "24px 20px",
                  borderRadius: "14px",
                  marginBottom: "20px",
                  border: "2px solid #d97a6f",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    margin: "0 0 12px 0",
                    fontWeight: 500,
                  }}
                >
                  السعر النهائي
                </p>
                {priceData?.price ? (
                  <p
                    style={{
                      fontSize: "40px",
                      fontWeight: 900,
                      color: "#d97a6f",
                      margin: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{priceData.price}</span>
                    <span style={{ fontSize: "22px" }}>
                      {priceData.currency_symbol}
                    </span>
                  </p>
                ) : (
                  <p style={{ color: "#999", fontSize: "14px" }}>
                    جاري التحميل...
                  </p>
                )}
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: "#666",
                  margin: "0 0 12px 0",
                  textAlign: "right",
                }}
              >
                وهذا السعر بشمل التالي:
              </p>

              {/* Courses Card */}
              <div
                style={{
                  backgroundColor: "rgba(217, 122, 111, 0.05)",
                  border: "1px solid rgba(217, 122, 111, 0.2)",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                {[
                  "الدورة الاحترافية",
                  "دورة تسعير المنتجات ",
                  "دورة تصوير المنتجات بالموبايل ",
                  "دورة التسويق الالكتروني ",
                  "دورة ادارة المشاريع ",
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      margin: "10px 0",
                      fontSize: "14px",
                      color: "#2D2D2D",
                      direction: "rtl",
                    }}
                  >
                    <span
                      style={{
                        color: "#d97a6f",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={() => setCurrentStep(12)}
                className="btn fw-bold py-3 px-5"
                style={{
                  borderRadius: "12px",
                  fontSize: "16px",
                  width: "100%",
                  backgroundColor: "#d97a6f",
                  border: "none",
                  color: "white",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                تعرَّفي على طرق الدفع
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 12: Payment Methods */}
        {currentStep === 12 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.70)",
                borderRadius: "20px",
                padding: "40px 32px",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                maxWidth: "450px",
                width: "100%",
                marginBottom: "40px",
              }}
            >
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="fw-bold text-dark mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  textAlign: "right",
                  direction: "rtl",
                  lineHeight: "1.5",
                }}
              >
                مشروعك قرّب يصير حقيقة
              </motion.h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "24px",
                  textAlign: "right",
                  direction: "rtl",
                }}
              >
                اختاري طريقة الدفع الانسب الك
              </p>

              {loading && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "20px",
                  }}
                >
                  جاري التحميل...
                </p>
              )}

              {!loading && paymentMethods.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {paymentMethods.map((method, index) => (
                    <motion.button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      className="btn fw-bold py-3 px-4"
                      style={{
                        borderRadius: "12px",
                        textAlign: "right",
                        direction: "rtl",
                        width: "100%",
                        backgroundColor:
                          selectedPaymentMethod?.id === method.id
                            ? "#d97a6f"
                            : "#F8F7F5",
                        color:
                          selectedPaymentMethod?.id === method.id
                            ? "#fff"
                            : "#2D2D2D",
                        border:
                          selectedPaymentMethod?.id === method.id
                            ? "2px solid #d97a6f"
                            : "1.5px solid #E8E4DC",
                        fontWeight: 600,
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                      }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor:
                          selectedPaymentMethod?.id === method.id
                            ? "#d97a6f"
                            : "#F0EAE0",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {method.name}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {!loading && paymentMethods.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#999",
                    padding: "20px",
                  }}
                >
                  لا توجد طرق دفع متاحة
                </p>
              )}

              {/* Decision Buttons from Screen 11 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                {/* Secondary Button - Question */}
                <motion.button
                  onClick={openWhatsApp}
                  className="btn fw-bold py-2 px-4"
                  style={{
                    borderRadius: "8px",
                    fontSize: "13px",
                    width: "auto",
                    display: "block",
                    margin: "0 auto",
                    backgroundColor: "transparent",
                    color: "#d97a6f",
                    border: "1.5px solid #d97a6f",
                    fontWeight: 600,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(217, 122, 111, 0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  عندي سؤال قبل الاشتراك
                </motion.button>

                {/* Tertiary Button - Not Ready */}
                <motion.button
                  onClick={() => setCurrentStep(1)}
                  className="btn fw-bold py-2 px-3"
                  style={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    width: "auto",
                    display: "block",
                    margin: "0 auto",
                    backgroundColor: "transparent",
                    color: "#999",
                    border: "none",
                    fontWeight: 500,
                    textDecoration: "underline",
                  }}
                  whileHover={{ scale: 1.05, color: "#666" }}
                  whileTap={{ scale: 0.98 }}
                >
                  حاليا غير مستعدة للاشتراك
                </motion.button>
              </motion.div>

              {selectedPaymentMethod && (
                <motion.button
                  onClick={() => setCurrentStep(13)}
                  className="btn fw-bold py-3 px-4 w-100 mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  style={{
                    borderRadius: "12px",
                    fontSize: "16px",
                    backgroundColor: "#d97a6f",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  متابعة
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Screen 13: Payment Instructions */}
        {currentStep === 13 && selectedPaymentMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.70)",
                borderRadius: "20px",
                padding: "40px 32px",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                maxWidth: "450px",
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                textAlign: "right",
              }}
            >
              {selectedPaymentMethod.code === "visa" ||
              selectedPaymentMethod.code === "mastercard" ? (
                <>
                  <h2
                    className="fw-bold text-dark mb-4"
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      textAlign: "right",
                      lineHeight: "1.5",
                    }}
                  >
                    الدفع عبر البطاقة
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      textAlign: "right",
                      marginBottom: "20px",
                    }}
                  >
                    أدخل تفاصيل بطاقتك الآمنة
                  </p>
                  {priceData && selectedCountry ? (
                    <StripePaymentFormWrapper
                      amount={priceData.price}
                      currency={priceData.currency}
                      brand={courseData?.name || selectedBrand || "Mknooon"}
                      countryCode={selectedCountry.code}
                      userName={deliveryForm.full_name || "Customer"}
                      userEmail={
                        deliveryForm.phone
                          ? `${deliveryForm.phone.replace(/\D/g, "")}@mknooon.local`
                          : "customer@mknooon.local"
                      }
                      userPhone={deliveryForm.phone}
                      courseId={courseData?.id}
                      onSuccess={paymentIntentId => {
                        setCurrentStep(15);
                      }}
                      onError={error => {
                        console.error("Payment error:", error);
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        padding: "20px",
                      }}
                    >
                      جاري تحميل تفاصيل الدفع...
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h2
                    className="fw-bold text-dark mb-4"
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      textAlign: "right",
                      lineHeight: "1.5",
                    }}
                  >
                    {paymentInstructions?.title || "تفاصيل الدفع"}
                  </h2>
                  {paymentInstructions && (
                    <div>
                      {/* Instructions Text */}
                      {paymentInstructions.instructions && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#2D2D2D",
                            marginBottom: "20px",
                            textAlign: "right",
                            direction: "rtl",
                            lineHeight: "1.6",
                          }}
                        >
                          {paymentInstructions.instructions}
                        </p>
                      )}

                      {/* Fields List */}
                      {paymentInstructions.fields &&
                        Object.keys(paymentInstructions.fields).length > 0 && (
                          <div
                            style={{
                              backgroundColor: "#F8F7F5",
                              padding: "20px",
                              borderRadius: "12px",
                              marginBottom: "20px",
                              textAlign: "right",
                              direction: "rtl",
                            }}
                          >
                            {Object.entries(paymentInstructions.fields).map(
                              ([key, value]: [string, any]) => {
                                const label = key;
                                const stringValue =
                                  typeof value === "object"
                                    ? JSON.stringify(value)
                                    : String(value);
                                const isUrl =
                                  stringValue.startsWith("http://") ||
                                  stringValue.startsWith("https://");

                                return (
                                  <div
                                    key={key}
                                    style={{
                                      display: "flex",
                                      flexDirection: "row-reverse",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: "12px",
                                      paddingBottom: "12px",
                                      borderBottom: "1px solid #ddd",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <strong
                                        style={{
                                          fontSize: "13px",
                                          color: "#2D2D2D",
                                          marginBottom: "6px",
                                          textAlign: "right",
                                        }}
                                      >
                                        {label}:
                                      </strong>
                                      {isUrl ? (
                                        <a
                                          href={stringValue}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            color: "#0066cc",
                                            textDecoration: "underline",
                                            wordBreak: "break-all",
                                            padding: "8px 10px",
                                            backgroundColor: "#fff",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            textAlign: "right",
                                          }}
                                        >
                                          {stringValue}
                                        </a>
                                      ) : (
                                        <code
                                          style={{
                                            backgroundColor: "#fff",
                                            padding: "8px 10px",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            color: "#2D2D2D",
                                            wordBreak: "break-all",
                                            display: "block",
                                            textAlign: "right",
                                          }}
                                        >
                                          {stringValue}
                                        </code>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                    </div>
                  )}
                  {paymentInstructions?.requires_delivery_info && (
                    <div
                      style={{
                        backgroundColor: "#F8F7F5",
                        padding: "20px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          textAlign: "right",
                          marginBottom: "15px",
                          color: "#2D2D2D",
                        }}
                      >
                        بيانات التوصيل
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#2D2D2D",
                          marginBottom: "15px",
                          textAlign: "right",
                          direction: "rtl",
                          lineHeight: "1.6",
                        }}
                      >
                        يرجى تعبئة البيانات التاليه
                      </p>

                      <div style={{ marginBottom: "12px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            textAlign: "right",
                            color: "#2D2D2D",
                          }}
                        >
                          الاسم الكامل *
                        </label>
                        <input
                          type="text"
                          value={deliveryForm.full_name}
                          onChange={e =>
                            setDeliveryForm({
                              ...deliveryForm,
                              full_name: e.target.value,
                            })
                          }
                          placeholder="أدخل اسمك الكامل"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                            textAlign: "right",
                            direction: "rtl",
                            boxSizing: "border-box",
                          }}
                        />
                        {deliveryFormErrors.full_name && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                              textAlign: "right",
                            }}
                          >
                            {deliveryFormErrors.full_name}
                          </p>
                        )}
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            textAlign: "right",
                            color: "#2D2D2D",
                          }}
                        >
                          الموبايل *
                        </label>
                        <input
                          type="tel"
                          value={deliveryForm.phone}
                          onChange={e =>
                            setDeliveryForm({
                              ...deliveryForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="أدخل رقم جوالك"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                            textAlign: "right",
                            direction: "rtl",
                            boxSizing: "border-box",
                          }}
                        />
                        {deliveryFormErrors.phone && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                              textAlign: "right",
                            }}
                          >
                            {deliveryFormErrors.phone}
                          </p>
                        )}
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            textAlign: "right",
                            color: "#2D2D2D",
                          }}
                        >
                          المدينة *
                        </label>
                        <input
                          type="text"
                          value={deliveryForm.city}
                          onChange={e =>
                            setDeliveryForm({
                              ...deliveryForm,
                              city: e.target.value,
                            })
                          }
                          placeholder="أدخل اسم مدينتك"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                            textAlign: "right",
                            direction: "rtl",
                            boxSizing: "border-box",
                          }}
                        />
                        {deliveryFormErrors.city && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                              textAlign: "right",
                            }}
                          >
                            {deliveryFormErrors.city}
                          </p>
                        )}
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            textAlign: "right",
                            color: "#2D2D2D",
                          }}
                        >
                          العنوان *
                        </label>
                        <input
                          type="text"
                          value={deliveryForm.address}
                          onChange={e =>
                            setDeliveryForm({
                              ...deliveryForm,
                              address: e.target.value,
                            })
                          }
                          placeholder="أدخل عنوانك التفصيلي"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                            textAlign: "right",
                            direction: "rtl",
                            boxSizing: "border-box",
                          }}
                        />
                        {deliveryFormErrors.address && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                              textAlign: "right",
                            }}
                          >
                            {deliveryFormErrors.address}
                          </p>
                        )}
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            textAlign: "right",
                            color: "#2D2D2D",
                          }}
                        >
                          أقرب نقطة دلالة *
                        </label>
                        <input
                          type="text"
                          value={deliveryForm.nearest_landmark}
                          onChange={e =>
                            setDeliveryForm({
                              ...deliveryForm,
                              nearest_landmark: e.target.value,
                            })
                          }
                          placeholder="مثال: بجانب الجامع الأزرق"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                            textAlign: "right",
                            direction: "rtl",
                            boxSizing: "border-box",
                          }}
                        />
                        {deliveryFormErrors.nearest_landmark && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                              textAlign: "right",
                            }}
                          >
                            {deliveryFormErrors.nearest_landmark}
                          </p>
                        )}
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            textAlign: "right",
                            color: "#2D2D2D",
                          }}
                        >
                          ملاحظات إضافية
                        </label>
                        <textarea
                          value={deliveryForm.notes}
                          onChange={e =>
                            setDeliveryForm({
                              ...deliveryForm,
                              notes: e.target.value,
                            })
                          }
                          placeholder="أي ملاحظات إضافية؟"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                            textAlign: "right",
                            direction: "rtl",
                            minHeight: "80px",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      <motion.button
                        onClick={() => {
                          const errors: Record<string, string> = {};
                          if (!deliveryForm.full_name)
                            errors.full_name = "الاسم مطلوب";
                          if (!deliveryForm.phone)
                            errors.phone = "الجوال مطلوب";
                          if (!deliveryForm.city)
                            errors.city = "المدينة مطلوبة";
                          if (!deliveryForm.address)
                            errors.address = "العنوان مطلوب";
                          if (!deliveryForm.nearest_landmark)
                            errors.nearest_landmark = "النقطة الدلالة مطلوبة";

                          if (Object.keys(errors).length > 0) {
                            setDeliveryFormErrors(errors);
                            return;
                          }

                          const brandName =
                            brands.find(
                              b => b.src === selectedBrand?.toLowerCase()
                            )?.name || "Mknooon";
                          const message = `مرحباً، أريد الدفع عند الاستلام.\n\nالمبلغ: ${selectedCountry?.price} ${selectedCountry?.currency_symbol}\nالدولة: ${selectedCountry?.name_ar}\n\nبيانات العميل:\nالاسم: ${deliveryForm.full_name}\nالموبايل: ${deliveryForm.phone}\nالمدينة: ${deliveryForm.city}\nالعنوان: ${deliveryForm.address}\nأقرب نقطة دلالة: ${deliveryForm.nearest_landmark}${deliveryForm.notes ? `\nملاحظات: ${deliveryForm.notes}` : ""}`;
                          const phone = "905344258184";
                          window.open(
                            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                            "_blank"
                          );
                        }}
                        className="btn fw-bold mt-4"
                        style={{
                          borderRadius: "12px",
                          padding: "12px 16px",
                          fontSize: "14px",
                          backgroundColor: "#d97a6f",
                          color: "#fff",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ارسل البيانات
                      </motion.button>
                    </div>
                  )}
                  {paymentInstructions?.requires_receipt &&
                    !paymentInstructions?.requires_delivery_info && (
                      <>
                        <motion.div
                          style={{
                            marginTop: "16px",
                            padding: "12px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "12px",
                            textAlign: "center",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#2D2D2D",
                              fontFamily: "Cairo, sans-serif",
                              margin: 0,
                              lineHeight: "1.6",
                            }}
                          >
                            الرجاء أخذ لقطة شاشة للوصل وإرسالها إلينا
                          </p>
                        </motion.div>
                        <motion.button
                          onClick={() => {
                            // Build message in the same format as Stripe
                            const courseName =
                              courseData?.name ||
                              selectedBrand ||
                              "الدورة التدريبية";
                            const countryName =
                              selectedCountry?.name_ar || "غير محدد";
                            const paymentMethod =
                              selectedPaymentMethod?.name || "غير محدد";
                            const amount = (
                              selectedCountry?.price || 0
                            ).toFixed(2);
                            const currency =
                              selectedCountry?.currency_symbol || "";

                            const message = `مرحبا، دفعت اشتراك كورس ${courseName} من ${countryName} عبر ${paymentMethod}. هذه صورة إشعار الدفع.\n\nالسعر المدفوع: ${amount} ${currency}`;

                            const phone =
                              paymentInstructions.receipt_whatsapp.phone.replace(
                                /[^0-9]/g,
                                ""
                              );
                            window.open(
                              `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                              "_blank"
                            );
                          }}
                          className="btn fw-bold mt-4"
                          style={{
                            borderRadius: "12px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            backgroundColor: "#d97a6f",
                            color: "#fff",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          أرسل الإيصال
                        </motion.button>
                      </>
                    )}
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Screen 14: Delivery Form */}
        {currentStep === 14 &&
          selectedPaymentMethod &&
          paymentInstructions?.requires_delivery_info && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-end"
              style={{ paddingBottom: "40px" }}
            >
              {/* Delivery form content */}
            </motion.div>
          )}

        {/* Screen 15: Success / Receipt */}
        {currentStep === 15 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-end d-flex flex-column justify-content-center align-items-center h-[100svh]"
            style={{
              paddingTop: "40px",
              paddingBottom: "140px",
              paddingLeft: "20px",
              paddingRight: "20px",
              minHeight: "100vh",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              style={{
                width: "50px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "25px auto",
              }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                style={{
                  fontSize: "36px",
                  color: "#fff",
                  fontWeight: "bold",
                  lineHeight: "1.2",
                }}
              >
                ✓
              </motion.span>
            </motion.div>

            {/* Title */}
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: "8px",
                marginTop: "0",
                lineHeight: "1.4",
              }}
            >
              شكراً لك!
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#666",
                textAlign: "center",
                marginBottom: "24px",
                marginTop: "0",
              }}
            >
              تم استلام طلبك
            </p>

            {/* Receipt Card for Stripe */}
            {selectedPaymentMethod?.code === "visa" && (
              <motion.div
                id="invoice-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "20px",
                  maxWidth: "100%",
                  width: "100%",
                  marginBottom: "24px",
                  textAlign: "right",
                  direction: "rtl",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "16px",
                    color: "#2D2D2D",
                    textAlign: "center",
                  }}
                >
                  إيصال الدفع
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    textAlign: "right",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      direction: "rtl",
                    }}
                  >
                    <span
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        marginLeft: "auto",
                      }}
                    >
                      المبلغ:
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#2D2D2D",
                        fontSize: "14px",
                        marginRight: "12px",
                      }}
                    >
                      {priceData?.price} {priceData?.currency}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      direction: "rtl",
                    }}
                  >
                    <span
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        marginLeft: "auto",
                      }}
                    >
                      الدولة:
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#2D2D2D",
                        fontSize: "14px",
                        marginRight: "12px",
                      }}
                    >
                      {selectedCountry?.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      direction: "rtl",
                    }}
                  >
                    <span
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        marginLeft: "auto",
                      }}
                    >
                      الخطة:
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#2D2D2D",
                        fontSize: "14px",
                        marginRight: "12px",
                      }}
                    >
                      {selectedBrand}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      direction: "rtl",
                    }}
                  >
                    <span
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        marginLeft: "auto",
                      }}
                    >
                      طريقة الدفع:
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#2D2D2D",
                        fontSize: "14px",
                        marginRight: "12px",
                      }}
                    >
                      Visa / Mastercard
                    </span>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #ddd",
                      paddingTop: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "8px",
                        direction: "rtl",
                      }}
                    >
                      <span
                        style={{
                          color: "#666",
                          fontSize: "12px",
                          marginLeft: "auto",
                        }}
                      >
                        التاريخ:
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          marginRight: "12px",
                        }}
                      >
                        {new Date().toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        direction: "rtl",
                      }}
                    >
                      <span
                        style={{
                          color: "#666",
                          fontSize: "12px",
                          marginLeft: "auto",
                        }}
                      >
                        الحالة:
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#4CAF50",
                          fontWeight: 600,
                          marginRight: "12px",
                        }}
                      >
                        ✓ مكتمل
                      </span>
                    </div>
                  </div>
                </div>

                {/* Send to WhatsApp Button */}
                <motion.button
                  onClick={() => {
                    captureInvoiceImage("invoice-card", imageUrl => {
                      setInvoiceImageUrl(imageUrl);
                      setShowInvoiceModal(true);
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: "#d97a6f",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: "16px",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  اضغط هنا لارسال الوصل
                </motion.button>
              </motion.div>
            )}

            <p style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
              سيتم التواصل معك قريباً
            </p>
          </motion.div>
        )}

        {/* Invoice Image Modal */}
        {showInvoiceModal && invoiceImageUrl && (
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInvoiceModal(false)}
          >
            <motion.div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "auto",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#2D2D2D",
                  fontFamily: "Cairo, sans-serif",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                الوصل - خذ لقطة شاشة وأرسلها
              </h3>
              <img
                src={invoiceImageUrl}
                alt="Invoice"
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              />
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  fontFamily: "Cairo, sans-serif",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                الرجاء أخذ لقطة شاشة للوصل وأرسلها عبر واتس اب
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <motion.button
                  onClick={() => setShowInvoiceModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #d97a6f",
                    backgroundColor: "transparent",
                    color: "#d97a6f",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Cairo, sans-serif",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إغلاق
                </motion.button>
                <motion.button
                  onClick={() => {
                    const paymentMethod =
                      selectedPaymentMethod?.name || "طريقة دفع";
                    const message = `مرحبا، دفعت اشتراك كورس ${courseData?.name || selectedBrand || "الدورة التدريبية"} من ${selectedCountry?.name_ar || "غير محدد"} عبر ${paymentMethod}. هذه صورة إشعار الدفع.\n\nالسعر المدفوع: ${(selectedCountry?.price || 0).toFixed(2)} ${selectedCountry?.currency_symbol || ""}`;
                    const phone = "905344258184";
                    window.open(
                      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                      "_blank"
                    );
                  }}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#25D366",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Cairo, sans-serif",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  فتح واتس
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        {currentStep > 1 && currentStep < 12 && currentStep !== 13 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              paddingBottom: "40px",
            }}
          ></div>
        )}
      </div>
    </>
  );
}
