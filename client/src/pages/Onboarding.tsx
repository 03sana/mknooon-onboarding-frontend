import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const Onboarding = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (step, answer) => {
    setAnswers((prev) => ({ ...prev, [step]: answer }));
  };

  const handleContinue = () => {
    if (currentStep < 14) {
      setCurrentStep(currentStep + 1);
    } else {
      setLocation("/thank-you");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / 14) * 100;

  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><style>.product-icon { font-size: 60px; opacity: 0.15; }</style></defs><text x="10%" y="15%" class="product-icon">👜</text><text x="85%" y="20%" class="product-icon">💄</text><text x="5%" y="75%" class="product-icon">👗</text><text x="80%" y="85%" class="product-icon">💍</text><text x="50%" y="10%" class="product-icon">✨</text></svg>')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* White Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Progress Bar */}
      <div
        style={{
          height: "4px",
          backgroundColor: "#e0e0e0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          style={{
            height: "100%",
            backgroundColor: "#d97a6f",
            width: `${progressPercentage}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Content Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "20px",
          paddingRight: "20px",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* Screen 1: Hero */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "40px",
                marginTop: "0",
              }}
            >
              Mknooon
            </h1>

            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                borderRadius: "20px",
                padding: "48px 32px",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                maxWidth: "450px",
                width: "100%",
                marginTop: "123px",
              }}
            >
              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: "12px",
                  marginTop: "0",
                  lineHeight: "1.4",
                }}
              >
                رحلتك لإطلاق مشروعك تبدأ الآن
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "8px",
                  marginTop: "0",
                }}
              >
                3 دقائق فقط... وتعرّفي فيها ..
              </p>

              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "24px",
                  marginTop: "0",
                }}
              >
                هل أنت جاهزة لإطلاق مشروعك ؟ تعرفي على الفرصة
              </p>

              <motion.button
                onClick={handleContinue}
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
                تعرّفي على الفرصة
              </motion.button>

              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginTop: "16px",
                  marginBottom: "0",
                }}
              >
                أكثر من 11000 امرأة بدأت رحلتها
              </p>
            </div>
          </motion.div>
        )}

        {/* Screen 2: Timeline */}
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
              لو كانت التفاصيل واضحة وسهلة<br />...متى حابة تطلقي مشروعك؟
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              {[
                { id: "immediate", label: "في الأسابيع القادمة", emoji: "⚡" },
                { id: "months", label: "خلال 1-3 أشهر", emoji: "📅" },
                { id: "planning", label: "أنا في مرحلة التخطيط", emoji: "📋" },
                { id: "exploring", label: "أنا أستكشف الفرصة", emoji: "🔍" },
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
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    direction: "rtl",
                  }}
                  whileHover={{ backgroundColor: "rgba(217, 122, 111, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{ fontSize: "20px" }}>{option.emoji}</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a" }}>{option.label}</div>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", width: "100%", gap: "12px" }}>
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
                  flex: 1,
                }}
                whileHover={{ backgroundColor: "#f5f5f5" }}
              >
                رجوع
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 3: Business Type */}
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
              ما نوع المشروع اللي تفكري فيه؟
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              {[
                { id: "products", label: "منتجات (ملابس، إكسسوارات، إلخ)", emoji: "👗" },
                { id: "services", label: "خدمات (استشارة، تصميم، إلخ)", emoji: "💼" },
                { id: "digital", label: "محتوى رقمي (كورسات، كتب إلكترونية)", emoji: "📚" },
                { id: "food", label: "منتجات غذائية", emoji: "🍰" },
                { id: "other", label: "شيء آخر", emoji: "✨" },
              ].map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(3, option.id);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: answers[3] === option.id ? "2px solid #d97a6f" : "1px solid #e0e0e0",
                    backgroundColor: answers[3] === option.id ? "rgba(217, 122, 111, 0.1)" : "#f9f9f9",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    direction: "rtl",
                  }}
                  whileHover={{ backgroundColor: "rgba(217, 122, 111, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{ fontSize: "20px" }}>{option.emoji}</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a" }}>{option.label}</div>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", width: "100%", gap: "12px" }}>
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
                  flex: 1,
                }}
                whileHover={{ backgroundColor: "#f5f5f5" }}
              >
                رجوع
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 4: Experience */}
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
              كم سنة من الخبرة عندك في هذا المجال؟
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              {[
                { id: "beginner", label: "أنا مبتدئة", emoji: "🌱" },
                { id: "intermediate", label: "عندي خبرة 1-3 سنوات", emoji: "🌿" },
                { id: "experienced", label: "عندي خبرة أكثر من 3 سنوات", emoji: "🌳" },
              ].map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(4, option.id);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: answers[4] === option.id ? "2px solid #d97a6f" : "1px solid #e0e0e0",
                    backgroundColor: answers[4] === option.id ? "rgba(217, 122, 111, 0.1)" : "#f9f9f9",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    direction: "rtl",
                  }}
                  whileHover={{ backgroundColor: "rgba(217, 122, 111, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{ fontSize: "20px" }}>{option.emoji}</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a" }}>{option.label}</div>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", width: "100%", gap: "12px" }}>
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
                  flex: 1,
                }}
                whileHover={{ backgroundColor: "#f5f5f5" }}
              >
                رجوع
              </motion.button>
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
              طبيعي يكون عندك هاي المخاوف 🤍
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
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
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
                    <span style={{ fontWeight: 600, color: "#333" }}>{item.title} {item.emoji}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", width: "100%", gap: "12px" }}>
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
                  flex: 1,
                }}
                whileHover={{ backgroundColor: "#f5f5f5" }}
              >
                رجوع
              </motion.button>
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
              تختاري شكل علامتك<br />أي شخصية أقرب لك؟
            </h2>

            {/* Brand Personality Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
              {[
                {
                  id: "luxury",
                  title: "فاخرة وفريدة",
                  subtitle: "أنيقة، راقية، فاخرة",
                  illustration: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen6-luxury-doodle-nkMcRsg7L5Kk3gxNmjhUJx.webp",
                  accentColor: "#D4AF37",
                },
                {
                  id: "modern",
                  title: "عصرية وملموسة",
                  subtitle: "حديثة، عصرية، ملموسة",
                  illustration: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen6-modern-doodle-aVa7twdnSf9ToPY6N6EvpG.webp",
                  accentColor: "#4A90E2",
                },
                {
                  id: "cozy",
                  title: "منزلية دافئة",
                  subtitle: "خصوصية، شخصية، دافئة",
                  illustration: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen6-cozy-doodle-UPxianzYRjTKXd9tQ6QShu.webp",
                  accentColor: "#8B6F47",
                },
              ].map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    handleAnswer(6, option.id);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: answers[6] === option.id ? `2px solid ${option.accentColor}` : "2px solid #e0e0e0",
                    backgroundColor: answers[6] === option.id ? "rgba(255, 255, 255, 0.9)" : "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    direction: "rtl",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    width: "100%",
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Illustration */}
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
                  {/* Text Content */}
                  <div style={{ flex: 1, textAlign: "right", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>{option.title}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>{option.subtitle}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", width: "100%", gap: "12px" }}>
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
                  flex: 1,
                }}
                whileHover={{ backgroundColor: "#f5f5f5" }}
              >
                رجوع
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 7-14: Placeholder */}
        {currentStep > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a" }}>Screen {currentStep}</h2>
            <p style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}>Coming soon...</p>

            <div style={{ display: "flex", gap: "12px" }}>
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
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                متابعة
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
