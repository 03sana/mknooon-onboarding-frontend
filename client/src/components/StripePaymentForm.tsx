import React, { useState } from "react";
import { motion } from "framer-motion";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  brand: string;
  countryCode: string;
  userName: string;
  userEmail: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export const StripePaymentFormWrapper: React.FC<StripePaymentFormProps> = ({
  amount,
  currency,
  brand,
  countryCode,
  userName,
  userEmail,
  onSuccess,
  onError,
  isLoading = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !expiry || !cvc) {
      setError("Please fill in all card details");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Payment Intent on backend
      const response = await fetch(
        `${API_BASE_URL}/stripe/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency: currency.toUpperCase(),
            brand,
            country_code: countryCode,
            user_name: userName,
            user_email: userEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { client_secret, payment_intent_id } = await response.json();

      // Step 2: Simulate payment processing
      // In production, you would use Stripe.js here
      // For now, we'll confirm the payment directly
      const confirmResponse = await fetch(
        `${API_BASE_URL}/stripe/confirm-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_intent_id: payment_intent_id,
          }),
        }
      );

      if (!confirmResponse.ok) {
        throw new Error("Failed to confirm payment");
      }

      const confirmData = await confirmResponse.json();

      if (confirmData.success) {
        onSuccess(payment_intent_id);
      } else {
        setError(confirmData.error || "Payment confirmation failed");
        onError(confirmData.error || "Payment confirmation failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "8px",
            textAlign: "right",
            color: "#2D2D2D",
          }}
        >
          رقم البطاقة
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "16px",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              textAlign: "right",
              color: "#2D2D2D",
            }}
          >
            انتهاء الصلاحية
          </label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength="5"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "16px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "8px",
              textAlign: "right",
              color: "#2D2D2D",
            }}
          >
            CVC
          </label>
          <input
            type="text"
            value={cvc}
            onChange={(e) =>
              setCvc(e.target.value.replace(/[^0-9]/gi, "").slice(0, 4))
            }
            placeholder="123"
            maxLength="4"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "16px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            color: "#d32f2f",
            marginBottom: "16px",
            fontSize: "14px",
            padding: "8px",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
            textAlign: "right",
          }}
        >
          {error}
        </div>
      )}

      <motion.button
        type="submit"
        disabled={loading || isLoading}
        style={{
          width: "100%",
          padding: "12px 20px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: loading || isLoading ? "#ccc" : "#d97a6f",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          cursor: loading || isLoading ? "not-allowed" : "pointer",
          opacity: loading || isLoading ? 0.6 : 1,
        }}
        whileHover={!loading && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!loading && !isLoading ? { scale: 0.98 } : {}}
      >
        {loading || isLoading ? "جاري المعالجة..." : `ادفع ${amount} ${currency}`}
      </motion.button>
    </form>
  );
};

export default StripePaymentFormWrapper;
