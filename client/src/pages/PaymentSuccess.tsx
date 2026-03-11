import React, { useEffect, useState } from "react";
import { useRouter } from "wouter";
import { motion } from "framer-motion";

export const PaymentSuccess: React.FC = () => {
  const [, navigate] = useRouter();
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const intentId = params.get("payment_intent_id");
    setPaymentIntentId(intentId);
  }, []);

  return (
    <motion.div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          maxWidth: "500px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Success Icon */}
        <motion.div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#e8f5e9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "40px",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ✓
        </motion.div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#2D2D2D",
            marginBottom: "12px",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          تم الدفع بنجاح
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "8px",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          شكراً لك على الدفع
        </p>

        <p
          style={{
            fontSize: "14px",
            color: "#999",
            marginBottom: "24px",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          تم استلام طلبك وسيتم معالجته قريباً
        </p>

        {paymentIntentId && (
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "12px",
              color: "#666",
              fontFamily: "monospace",
              wordBreak: "break-all",
            }}
          >
            Payment ID: {paymentIntentId}
          </div>
        )}

        <motion.button
          onClick={() => navigate("/", { replace: true })}
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#d97a6f",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Cairo, sans-serif",
          } as React.CSSProperties}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          العودة للصفحة الرئيسية
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccess;
