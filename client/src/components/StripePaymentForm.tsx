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
  const [cardElement, setCardElement] = useState<any>(null);

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

    const card = elementsInstance.create("card", {
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
    });

    card.mount("#card-element");
    setCardElement(card);

    return () => {
      card.unmount();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !cardElement) {
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
            card: cardElement,
            billing_details: {
              name: userName,
              email: userEmail,
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
          تفاصيل البطاقة
        </label>
        <div
          id="card-element"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            minHeight: "40px",
          }}
        />
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
    </form>
  );
};

export default StripePaymentFormWrapper;
