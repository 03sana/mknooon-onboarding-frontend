import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (step, answer) => {
    setAnswers(prev => ({ ...prev, [step]: answer }));
  };

  const handleContinue = () => {
    if (currentStep < 14) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const brandColors = {
    chocodar: "#8B4513",
    sapooon: "#E91E63",
    default: "#D97A6F"
  };

  const accentColor = brandColors.default;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", paddingTop: "20px", paddingBottom: "20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", paddingLeft: "16px", paddingRight: "16px" }}>

        {/* Screen 1: Welcome */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            style={{ paddingBottom: "40px", display: "flex", flexDirection: "column" }}
          >
            {/* App Name */}
            <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "24px", color: "#333" }}>
              Mknooon
            </h1>

            {/* Illustration */}
            <div style={{ marginTop: "0px", marginBottom: "0px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "auto", height: "152px" }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen1-illust_ec65bfb3.png"
                alt="Starting your project"
                style={{
                  maxWidth: "220px",
                  width: "100%",
                  height: "auto",
                  margin: "0 auto",
                  display: "block",
                  marginRight: "74px",
                }}
              />
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "12px",
                marginTop: "24px",
                color: "#333",
                lineHeight: "1.3",
              }}
            >
              رحلتك لإطلاق
              <br />
              مشروعك تبدأ الآن
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                textAlign: "center",
                marginBottom: "28px",
                lineHeight: "1.6",
              }}
            >
              3 دقائق فقط... وتعرّفي فيها ..
              <br />
              هل أنت جاهزة لإطلاق مشروعك ؟
            </p>

            {/* CTA Button */}
            <motion.button
              onClick={() => {
                handleAnswer(1, "started");
                handleContinue();
              }}
              style={{
                width: "100%",
                padding: "16px 24px",
                backgroundColor: accentColor,
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              تعرفي على الفرصة
            </motion.button>

            {/* Social Proof */}
            <p style={{ fontSize: "12px", color: "#999", marginTop: "16px", textAlign: "center" }}>
              أكثر من 11000 امرأة بدأت رحلتها
            </p>
          </motion.div>
        )}

        {/* Screen 2: Launch Timing */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              paddingBottom: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {/* Progress Indicator */}
            <div style={{ marginBottom: "24px", textAlign: "right", direction: "rtl" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#666", marginBottom: "8px" }}>2/14</div>
              <div style={{ height: "4px", backgroundColor: "#e0e0e0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", backgroundColor: accentColor, width: "14%", borderRadius: "2px" }}></div>
              </div>
            </div>

            {/* Illustration */}
            <div style={{ marginTop: "0px", marginBottom: "0px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "auto" }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen2-illust_69c003f3.png"
                alt="Planning and timing"
                style={{
                  maxWidth: "240px",
                  width: "100%",
                  height: "auto",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </div>

            {/* Question Text */}
            <h2
              className="fw-bold text-dark"
              style={{
                fontSize: "24px",
                fontWeight: 700,
                textAlign: "right",
                marginBottom: "28px",
                lineHeight: "1.4",
                marginTop: "24px",
              }}
            >
              لو كانت التفاصيل واضحة وسهلة
              <br />
              ...متى حابة تطلقي مشروعك؟
            </h2>

            {/* Option Cards */}
            <div className="d-flex flex-column gap-3">
              <motion.button
                onClick={() => {
                  handleAnswer(2, "خلال 30 يوم");
                  handleContinue();
                }}
                style={{
                  padding: "16px 16px",
                  borderRadius: "12px",
                  textAlign: "right",
                  fontSize: "15px",
                  direction: "rtl",
                  display: "block",
                  width: "100%",
                  border: answers[2] === "خلال 30 يوم" ? "2px solid " + accentColor : "1px solid #e0e0e0",
                  backgroundColor: answers[2] === "خلال 30 يوم" ? "#FFF5F3" : "white",
                  color: answers[2] === "خلال 30 يوم" ? accentColor : "#333",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: answers[2] === "خلال 30 يوم" ? "0 2px 8px rgba(217, 122, 111, 0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ marginLeft: "8px" }}>🚀</span>
                خلال 30 يوم
                <div style={{ fontSize: "13px", fontWeight: 500, color: answers[2] === "خلال 30 يوم" ? accentColor : "#999", marginTop: "4px" }}>ابدئي بسرعة</div>
              </motion.button>
              <motion.button
                onClick={() => {
                  handleAnswer(2, "خلال 2-3 أشهر");
                  handleContinue();
                }}
                style={{
                  padding: "16px 16px",
                  borderRadius: "12px",
                  textAlign: "right",
                  fontSize: "15px",
                  direction: "rtl",
                  display: "block",
                  width: "100%",
                  border: answers[2] === "خلال 2-3 أشهر" ? "2px solid " + accentColor : "1px solid #e0e0e0",
                  backgroundColor: answers[2] === "خلال 2-3 أشهر" ? "#FFF5F3" : "white",
                  color: answers[2] === "خلال 2-3 أشهر" ? accentColor : "#333",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: answers[2] === "خلال 2-3 أشهر" ? "0 2px 8px rgba(217, 122, 111, 0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ marginLeft: "8px" }}>📅</span>
                خلال 2-3 أشهر
                <div style={{ fontSize: "13px", fontWeight: 500, color: answers[2] === "خلال 2-3 أشهر" ? accentColor : "#999", marginTop: "4px" }}>تخطيط بهدوء</div>
              </motion.button>
              <motion.button
                onClick={() => {
                  handleAnswer(2, "ما زلت أستكشف الفكرة");
                  handleContinue();
                }}
                style={{
                  padding: "16px 16px",
                  borderRadius: "12px",
                  textAlign: "right",
                  fontSize: "15px",
                  direction: "rtl",
                  display: "block",
                  width: "100%",
                  border: answers[2] === "ما زلت أستكشف الفكرة" ? "2px solid " + accentColor : "1px solid #e0e0e0",
                  backgroundColor: answers[2] === "ما زلت أستكشف الفكرة" ? "#FFF5F3" : "white",
                  color: answers[2] === "ما زلت أستكشف الفكرة" ? accentColor : "#333",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: answers[2] === "ما زلت أستكشف الفكرة" ? "0 2px 8px rgba(217, 122, 111, 0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ marginLeft: "8px" }}>💡</span>
                ما زلت أستكشف الفكرة
                <div style={{ fontSize: "13px", fontWeight: 500, color: answers[2] === "ما زلت أستكشف الفكرة" ? accentColor : "#999", marginTop: "4px" }}>ابحث عن الإلهام</div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Screen 3: Income Vision */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              paddingBottom: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {/* Progress Indicator */}
            <div style={{ marginBottom: "24px", textAlign: "right", direction: "rtl" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#666", marginBottom: "8px" }}>3/14</div>
              <div style={{ height: "4px", backgroundColor: "#e0e0e0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", backgroundColor: accentColor, width: "21%", borderRadius: "2px" }}></div>
              </div>
            </div>

            {/* Illustration */}
            <div style={{ marginTop: "0px", marginBottom: "0px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "auto" }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029857308/iZ6p6azaBMGCgmhFoK6Rha/screen3-illust_a2ce56ee.png"
                alt="Income and financial goals"
                style={{
                  maxWidth: "300px",
                  width: "100%",
                  height: "auto",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </div>

            {/* Question Text */}
            <h2
              className="fw-bold text-dark"
              style={{
                fontSize: "24px",
                fontWeight: 700,
                textAlign: "right",
                marginBottom: "28px",
                marginTop: "24px",
                lineHeight: "1.4",
              }}
            >
              لما يبدأ مشروعك بنجح ويحقق إيرادات .. كيف حالة يكون دخله بالنسبة لك؟
            </h2>

            {/* Option Cards */}
            <div className="d-flex flex-column gap-3">
              {[
                { emoji: "💰", title: "يغطي مصاريفي الشخصية", subtitle: "استقلالية مالية" },
                { emoji: "👨‍👩‍👧", title: "يساعدني في دعم عائلتي", subtitle: "دعم الأحبة" },
                { emoji: "🎯", title: "يكون مشروع العمر", subtitle: "حلم كبير" },
              ].map(option => (
                <motion.button
                  key={option.title}
                  onClick={() => {
                    handleAnswer(3, option.title);
                    handleContinue();
                  }}
                  style={{
                    padding: "16px 16px",
                    borderRadius: "12px",
                    textAlign: "right",
                    fontSize: "15px",
                    direction: "rtl",
                    display: "block",
                    width: "100%",
                    border: answers[3] === option.title ? "2px solid " + accentColor : "1px solid #e0e0e0",
                    backgroundColor: answers[3] === option.title ? "#FFF5F3" : "white",
                    color: answers[3] === option.title ? accentColor : "#333",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: answers[3] === option.title ? "0 2px 8px rgba(217, 122, 111, 0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span style={{ marginLeft: "8px" }}>{option.emoji}</span>
                  {option.title}
                  <div style={{ fontSize: "13px", fontWeight: 500, color: answers[3] === option.title ? accentColor : "#999", marginTop: "4px" }}>{option.subtitle}</div>
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
            style={{ paddingBottom: "40px" }}
          >
            <h2
              className="fw-bold text-dark mb-4"
              style={{
                fontSize: "24px",
                fontWeight: 700,
                textAlign: "right",
                lineHeight: "1.5",
              }}
            >
              كم سنة خبرة عندك في مجال مشروعك؟
            </h2>
            <div className="d-flex flex-column gap-2">
              {[
                "مبتدئة تماماً",
                "عندي فكرة عن المجال",
                "عندي خبرة جيدة",
              ].map(option => (
                <motion.button
                  key={option}
                  onClick={() => {
                    handleAnswer(4, option);
                    handleContinue();
                  }}
                  className={`btn py-3 fw-bold text-end`}
                  style={{
                    borderRadius: "12px",
                    textAlign: "right",
                    direction: "rtl",
                    display: "block",
                    width: "100%",
                    border: answers[4] === option ? "2px solid " + accentColor : "1px solid #e0e0e0",
                    backgroundColor: answers[4] === option ? "#FFF5F3" : "white",
                    color: answers[4] === option ? accentColor : "#333",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: "12px", marginTop: "40px", justifyContent: "space-between" }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            style={{
              padding: "12px 24px",
              backgroundColor: currentStep === 1 ? "#f0f0f0" : "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              cursor: currentStep === 1 ? "not-allowed" : "pointer",
              opacity: currentStep === 1 ? 0.5 : 1,
            }}
          >
            السابق
          </button>
          <div style={{ fontSize: "14px", color: "#999", alignSelf: "center" }}>
            {currentStep} / 14
          </div>
        </div>
      </div>
    </div>
  );
}
