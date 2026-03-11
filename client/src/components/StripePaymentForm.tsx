import React, { useState, useEffect } from "react";
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

declare global {
  interface Window {
    Stripe: any;
  }
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
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [paymentElement, setPaymentElement] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: "",
  });

  // Initialize Stripe
  useEffect(() => {
    if (!window.Stripe) {
      setError("Stripe library failed to load");
      return;
    }

    const stripePublishableKey =
      import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
      "pk_test_51ScO1gJygXhmYqTbbrOpQ9fzopMyPhyZB2zUnRxgFBHccuNlYd7LVh63ee9g0TtKXrKJUsgwvaEzxtUPV0z3xVgJ00KXGM3Lt8";

    const stripeInstance = window.Stripe(stripePublishableKey);
    setStripe(stripeInstance);

    // Cleanup
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Create Payment Intent
  useEffect(() => {
    if (!stripe) return;

    let isMounted = true;

    const createPaymentIntent = async () => {
      try {
        const intentResponse = await fetch(
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
              user_name: formData.name,
              user_email: formData.email,
              user_phone: formData.phone,
            }),
          }
        );

        if (!intentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { client_secret, payment_intent_id } =
          await intentResponse.json();

        if (!isMounted) return;

        setClientSecret(client_secret);
        setPaymentIntentId(payment_intent_id);
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to initialize payment";
          setError(errorMessage);
        }
      }
    };

    createPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [stripe, amount, currency, brand, countryCode]);

  // Create Payment Element once clientSecret is available
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    try {
      // Unmount previous payment element if it exists
      if (paymentElement) {
        paymentElement.unmount();
      }

      // Create elements with clientSecret
      const elementsInstance = stripe.elements({
        clientSecret: clientSecret,
      });

      const paymentElementInstance = elementsInstance.create("payment", {
        layout: "tabs",
        wallets: {
          applePay: "auto",
          googlePay: "auto",
        },
        fields: {
          billingDetails: "never", // Hide all billing details
        },
      });

      paymentElementInstance.mount("#payment-element");
      setPaymentElement(paymentElementInstance);
      setElements(elementsInstance);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mount payment element";
      setError(errorMessage);
    }
  }, [stripe, clientSecret]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !clientSecret || !paymentIntentId) {
      setError("Payment form not ready. Please wait...");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements: paymentElement ? paymentElement.parent : undefined,
          clientSecret,
          redirect: "if_required",
        });

      if (confirmError) {
        setError(confirmError.message);
        onError(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        onSuccess(paymentIntentId);
      } else {
        setError(`Payment status: ${paymentIntent.status}`);
        onError(`Payment status: ${paymentIntent.status}`);
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

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ width: "100%" }}
    >
      {/* Stripe Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#0066cc",
            letterSpacing: "0.5px",
          }}
        >
          Stripe
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            textAlign: "right",
          }}
        >
          الدفع آمن عبر Stripe
        </div>
      </div>

      {/* Name Field */}
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
          الاسم الكامل
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="أدخل اسمك الكامل"
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Cairo, sans-serif",
            color: "#2D2D2D",
            boxSizing: "border-box",
            direction: "rtl",
          }}
        />
      </div>

      {/* Phone Field */}
      <div style={{ marginBottom: "24px" }}>
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
          رقم الهاتف (اختياري)
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="أدخل رقم هاتفك"
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Cairo, sans-serif",
            color: "#2D2D2D",
            boxSizing: "border-box",
            direction: "rtl",
          }}
        />
      </div>

      {/* Payment Element */}
      <div style={{ marginBottom: "20px" }}>
        <div id="payment-element" />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            border: "1px solid #ef5350",
            borderRadius: "8px",
            color: "#c62828",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "right",
          }}
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading || !clientSecret || !paymentElement}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: loading ? "#ccc" : "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: "Cairo, sans-serif",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "جاري معالجة الدفع..." : `ادفع ${amount} ${currency.toUpperCase()}`}
      </motion.button>

      {/* Stripe Branding */}
      <div
        style={{
          textAlign: "center",
          marginTop: "16px",
          fontSize: "12px",
          color: "#999",
        }}
      >
        Powered by Stripe
      </div>
    </motion.form>
  );
};

export default StripePaymentFormWrapper;
