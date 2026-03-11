import { useState, useEffect } from "react";
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
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

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

  const verifyPhoneCountryCode = (phone: string) => {
    if (!phone) {
      setPhoneCountryCode("");
      setPhoneError("");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, "");
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
      
      if (detectedCountry !== countryCode) {
        setPhoneError(`⚠️ Country mismatch: detected ${detectedCountry}, but selected ${countryCode}`);
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneCountryCode("");
      setPhoneError("⚠️ Country code not recognized");
    }
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
          const errorData = await intentResponse.json();
          throw new Error(errorData.message || "Failed to create payment intent");
        }

        const { client_secret, payment_intent_id } =
          await intentResponse.json();

        if (isMounted) {
          setClientSecret(client_secret);
          setPaymentIntentId(payment_intent_id);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create payment intent";
        if (isMounted) {
          setError(errorMessage);
          onError(errorMessage);
        }
      }
    };

    createPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [stripe, amount, currency, brand, countryCode]);


  // Mount Payment Element
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    let isMounted = true;

    const mountPaymentElement = async () => {
      try {
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
          defaultValues: {
            billingDetails: {
              name: formData.name,
            },
          },
        });

        paymentElementInstance.mount("#payment-element");
        if (isMounted) {
          setPaymentElement(paymentElementInstance);
          setElements(elementsInstance);
          setError(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to mount payment element";
        if (isMounted) {
          setError(errorMessage);
        }
      }
    };

    mountPaymentElement();

    return () => {
      isMounted = false;
    };
  }, [stripe, clientSecret]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "phone") {
      verifyPhoneCountryCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret || !paymentIntentId) {
      setError("Payment system not ready");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Call elements.submit() first as required by Stripe Payment Element API
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setError(submitError.message || "Form validation failed");
        onError(submitError.message || "Form validation failed");
        setLoading(false);
        return;
      }

      // Step 2: Now confirm the payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?payment_intent_id=${paymentIntentId}`,
          payment_method_data: {
            billing_details: {
              name: formData.name,
              email: formData.email,
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Stripe Branding */}
      <div
        style={{
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

      {/* Phone Field with Country Code Verification */}
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
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="أدخل رقم هاتفك"
            style={{
              flex: 1,
              padding: "12px",
              border: phoneError ? "2px solid #ff6b6b" : "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "Cairo, sans-serif",
              color: "#2D2D2D",
              boxSizing: "border-box",
              direction: "rtl",
            }}
          />
          {phoneCountryCode && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: phoneError ? "#ffe0e0" : "#e8f5e9",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: phoneError ? "#d32f2f" : "#2e7d32",
                whiteSpace: "nowrap",
                border: phoneError ? "1px solid #ff6b6b" : "1px solid #4caf50",
              }}
            >
              {phoneCountryCode}
            </div>
          )}
        </div>
        {phoneError && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#d32f2f",
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

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "8px",
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
        disabled={loading || !stripe || !clientSecret}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: loading ? "#ccc" : "#d97a6f",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "Cairo, sans-serif",
          transition: "all 0.3s ease",
        }}
      >
        {loading ? "جاري المعالجة..." : `ادفع ${amount} ${currency.toUpperCase()}`}
      </motion.button>
    </motion.form>
  );
};
