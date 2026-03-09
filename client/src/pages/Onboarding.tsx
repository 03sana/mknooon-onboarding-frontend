import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
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

  // Fetch countries when brand is selected
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        if (selectedBrand) {
          // Fetch brand-specific countries with updated currency data
          const response = await fetch(
            `${API_BASE_URL}/countries?src=${selectedBrand}&t=${new Date().getTime()}`
          );
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
        console.error("Error fetching countries:", error);
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

  // Fetch price when country or brand is selected
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
            `${API_BASE_URL}/price?src=${selectedBrand}&country=${selectedCountry.code}&t=${new Date().getTime()}`
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

  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    handleAnswer(13, method.code);

    if (method.code === "visa") {
      setCurrentStep(14);
    } else {
      if (selectedCountry) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/payment-instructions?country=${selectedCountry.code}&method=${method.code}&src=${selectedBrand || "Mknooon"}`
          );
          const data = await response.json();
          setPaymentInstructions(data);
        } catch (error) {
          console.error("Error fetching payment instructions:", error);
        }
      }
      setCurrentStep(14);
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
        className="container-fluid h-[100svh] overflow-hidden"
        style={{
          paddingBottom: "0px",
          position: "relative",
          zIndex: 10,
          backgroundColor: "transparent",
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen1-bg-pattern-gtuN3TCCUfUab9ymxFpqgz.webp')",
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
            <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", textAlign: "center" }}>
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
              }}
            >
              {/* Main Title */}
              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  lineHeight: "1.35",
                  margin: "0 0 8px 0",
                  letterSpacing: "-0.3px",
                }}
              >
                رحلتك لإطلاق
                <br />
                مشروعك تبدأ الآن
              </h2>

              {/* Subtitle Text */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  fontWeight: 500,
                  margin: "0 0 4px 0",
                  lineHeight: "1.5",
                }}
              >
                3 دقائق فقط... وتعرّفي فيها ..
              </p>

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
                هل أنت جاهزة لإطلاق مشروعك ؟
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
                whileHover={{ scale: 1.03, boxShadow: "0 6px 20px rgba(217, 122, 111, 0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                تعرفي على الفرصة
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
                textAlign: "right",
                marginBottom: "16px",
                marginTop: "0",
                lineHeight: "1.6",
              }}
            >
              لو كانت التفاصيل واضحة وسهلة<br />...متى حابة تطلقي مشروعك؟
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              {[
                { id: "now", label: "الآن 🚀", subtitle: "أنا جاهزة!" },
                { id: "month", label: "خلال شهر 📅", subtitle: "بحاجة لتحضيرات" },
                { id: "quarter", label: "خلال 3 أشهر ⏳", subtitle: "بدي وقت أكثر" },
                { id: "unsure", label: "لسه ما قررت 🤔", subtitle: "بدي أفكر" },
              ].map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(2, option.id);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: answers[2] === option.id ? "2px solid #d97a6f" : "1px solid #e0e0e0",
                    backgroundColor: answers[2] === option.id ? "rgba(217, 122, 111, 0.1)" : "#f9f9f9",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ backgroundColor: "rgba(217, 122, 111, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>{option.label}</div>
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>{option.subtitle}</div>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", width: "100%" }}>
              <motion.button
                onClick={handleBack}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#666",
                }}
                whileHover={{ backgroundColor: "#f5f5f5" }}
              >
                رجوع
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Placeholder for remaining screens */}
        {currentStep > 2 && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Screen {currentStep}</h2>
            <p>Content for screen {currentStep} will be added here</p>
            <motion.button
              onClick={handleContinue}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "#d97a6f",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Continue
            </motion.button>
            <motion.button
              onClick={handleBack}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "#e0e0e0",
                color: "#666",
                border: "none",
                cursor: "pointer",
              }}
            >
              Back
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
}
