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
  const [cardNumberElement, setCardNumberElement] = useState<any>(null);
  const [cardExpiryElement, setCardExpiryElement] = useState<any>(null);
  const [cardCvcElement, setCardCvcElement] = useState<any>(null);
  const [phone, setPhone] = useState(userPhone);
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

  const verifyPhoneCountryCode = (phoneNumber: string) => {
    if (!phoneNumber) {
      setPhoneCountryCode("");
      setPhoneError("");
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

    const elementsInstance = stripeInstance.elements();
    setElements(elementsInstance);

    const elementStyle = {
      style: {
        base: {
          fontSize: "16px",
          color: "#2D2D2D",
          fontFamily: "Cairo, sans-serif",
          "::placeholder": {
            color: "#999",
          },
        },
        invalid: {
          color: "#d32f2f",
        },
      },
    };

    // Create separate elements
    const cardNumber = elementsInstance.create("cardNumber", elementStyle);
    const cardExpiry = elementsInstance.create("cardExpiry", elementStyle);
    const cardCvc = elementsInstance.create("cardCvc", elementStyle);

    // Mount elements
    cardNumber.mount("#card-number-element");
    cardExpiry.mount("#card-expiry-element");
    cardCvc.mount("#card-cvc-element");

    setCardNumberElement(cardNumber);
    setCardExpiryElement(cardExpiry);
    setCardCvcElement(cardCvc);

    // Handle errors
    cardNumber.on("change", (event: any) => {
      if (event.error) {
        setError(event.error.message);
      } else {
        setError(null);
      }
    });

    cardExpiry.on("change", (event: any) => {
      if (event.error) {
        setError(event.error.message);
      } else {
        setError(null);
      }
    });

    cardCvc.on("change", (event: any) => {
      if (event.error) {
        setError(event.error.message);
      } else {
        setError(null);
      }
    });

    return () => {
      cardNumber.unmount();
      cardExpiry.unmount();
      cardCvc.unmount();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !cardNumberElement) {
      setError("Payment system not ready");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Payment Intent on backend
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
            user_name: userName,
            user_email: userEmail,
            user_phone: phone,
          }),
        }
      );

      if (!intentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { client_secret, payment_intent_id } =
        await intentResponse.json();

      // Step 2: Confirm payment with card details using Stripe.js
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: userName,
              email: userEmail,
              phone: phone,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        onError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Step 3: Confirm on backend
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

  const elementContainerStyle: React.CSSProperties = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    minHeight: "40px",
    marginBottom: "12px",
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      style={{ width: "100%" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
        <div id="card-number-element" style={elementContainerStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        <div>
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
            تاريخ الانتهاء
          </label>
          <div id="card-expiry-element" style={elementContainerStyle} />
        </div>

        <div>
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
          <div id="card-cvc-element" style={elementContainerStyle} />
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
        disabled={loading || isLoading || !stripe}
        style={{
          width: "100%",
          padding: "12px 20px",
          borderRadius: "12px",
          border: "none",
          backgroundColor:
            loading || isLoading || !stripe ? "#ccc" : "#d97a6f",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          cursor:
            loading || isLoading || !stripe ? "not-allowed" : "pointer",
          opacity: loading || isLoading || !stripe ? 0.6 : 1,
        }}
        whileHover={!loading && !isLoading && stripe ? { scale: 1.02 } : {}}
        whileTap={!loading && !isLoading && stripe ? { scale: 0.98 } : {}}
      >
        {loading || isLoading
          ? "جاري المعالجة..."
          : `ادفع ${amount} ${currency}`}
      </motion.button>
    </motion.form>
  );
};

export default StripePaymentFormWrapper;
