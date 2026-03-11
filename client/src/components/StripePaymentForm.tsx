import React, { useState, useEffect, useRef } from "react";
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
  userPhone?: string;
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
  userPhone = "",
  onSuccess,
  onError,
  isLoading = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [detectedCountryCode, setDetectedCountryCode] = useState<string>(countryCode);
  const paymentIntentCreatedRef = useRef(false);

  // Phone country code mapping
  const countryCodeMap: Record<string, string> = {
    "1": "US",
    "90": "TR",
    "20": "EG",
    "966": "SA",
    "971": "AE",
    "212": "MA",
    "216": "TN",
    "213": "DZ",
    "218": "LY",
    "970": "PS",
    "962": "JO",
    "963": "SY",
    "961": "LB",
    "968": "OM",
    "974": "QA",
    "973": "BH",
    "965": "KW",
    "92": "PK",
    "880": "BD",
    "91": "IN",
  };

  const verifyPhoneCountryCode = (phoneNumber: string) => {
    if (!phoneNumber) {
      setPhoneCountryCode("");
      setPhoneError("");
      setDetectedCountryCode(countryCode);
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
    const phoneWithoutPlus = cleanPhone.replace("+", "");

    let foundCode = "";
    for (const code of Object.keys(countryCodeMap).sort((a, b) => b.length - a.length)) {
      if (phoneWithoutPlus.startsWith(code)) {
        foundCode = code;
        break;
      }
    }

    if (foundCode) {
      const detectedCountry = countryCodeMap[foundCode];
      setPhoneCountryCode(detectedCountry);
      setDetectedCountryCode(detectedCountry);
      setPhoneError("");
    } else {
      setPhoneCountryCode("");
      setPhoneError("⚠️ Country code not recognized");
      setDetectedCountryCode(countryCode);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    verifyPhoneCountryCode(newPhone);
  };

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
  }, []);

  // Create Payment Intent only once
  useEffect(() => {
    if (!stripe || paymentIntentCreatedRef.current) return;

    paymentIntentCreatedRef.current = true;

    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stripe/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency: currency.toUpperCase(),
            brand,
            country_code: detectedCountryCode,
            user_name: name,
            user_email: userEmail,
            user_phone: phone,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.client_secret);
        setPaymentIntentId(data.payment_intent_id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create payment intent";
        setError(errorMessage);
        onError(errorMessage);
      }
    };

    createPaymentIntent();
  }, [stripe]);

  // Mount Payment Element only when clientSecret is available
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const elementsInstance = stripe.elements({
      clientSecret: clientSecret,
    });

    setElements(elementsInstance);

    const paymentElement = elementsInstance.create("payment", {
      layout: "tabs",
      fields: {
        billingDetails: "auto",
      },
    });

    paymentElement.mount("#payment-element");

    return () => {
      paymentElement.unmount();
    };
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret || !paymentIntentId) {
      setError("Payment system not ready");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Update payment intent metadata with current name before confirming
      try {
        await fetch(`${API_BASE_URL}/stripe/update-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_intent_id: paymentIntentId,
            user_name: name,
            user_phone: phone,
          }),
        });
      } catch (updateErr) {
        console.warn("Could not update payment intent metadata", updateErr);
        // Continue anyway - this is just metadata
      }

      // Submit the payment element form
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setError(submitError.message || "Form validation failed");
        onError(submitError.message || "Form validation failed");
        setLoading(false);
        return;
      }

      // Confirm payment with billing details including current name
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?payment_intent_id=${paymentIntentId}`,
          payment_method_data: {
            billing_details: {
              name: name,
              phone: phone,
              address: {
                country: detectedCountryCode,
              },
            },
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        onError(confirmError.message || "Payment failed");
      } else {
        onSuccess(paymentIntentId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك الكامل"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            fontFamily: "Cairo, sans-serif",
            color: "#2D2D2D",
            boxSizing: "border-box",
            direction: "rtl",
          }}
        />
      </div>

      {/* Phone Field with Country Code Verification */}
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
          رقم الهاتف
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+201234567890"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              fontFamily: "Cairo, sans-serif",
              color: "#2D2D2D",
              boxSizing: "border-box",
              direction: "ltr",
            }}
          />
          {phoneCountryCode && (
            <div
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                backgroundColor: phoneError ? "#ffebee" : "#e8f5e9",
                color: phoneError ? "#d32f2f" : "#2e7d32",
                fontSize: "12px",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {phoneCountryCode}
            </div>
          )}
        </div>
        {phoneError && (
          <div
            style={{
              color: "#d32f2f",
              fontSize: "12px",
              marginTop: "4px",
              textAlign: "right",
            }}
          >
            {phoneError}
          </div>
        )}
      </div>

      {/* Payment Element */}
      <div style={{ marginBottom: "20px" }}>
        <div id="payment-element" />
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
        disabled={loading || isLoading || !stripe || !clientSecret}
        style={{
          width: "100%",
          padding: "12px 20px",
          borderRadius: "12px",
          border: "none",
          backgroundColor:
            loading || isLoading || !stripe || !clientSecret ? "#ccc" : "#d97a6f",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          cursor:
            loading || isLoading || !stripe || !clientSecret ? "not-allowed" : "pointer",
          opacity: loading || isLoading || !stripe || !clientSecret ? 0.6 : 1,
        }}
        whileHover={!loading && !isLoading && stripe && clientSecret ? { scale: 1.02 } : {}}
        whileTap={!loading && !isLoading && stripe && clientSecret ? { scale: 0.98 } : {}}
      >
        {loading || isLoading
          ? "جاري المعالجة..."
          : `ادفع ${amount} ${currency}`}
      </motion.button>
    </motion.form>
  );
};

export default StripePaymentFormWrapper;
