import React, { useState } from "react";
import { loadStripe } from "@stripe/js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || ""
);

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

const StripeCardForm: React.FC<StripePaymentFormProps> = ({
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
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
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

      // Step 2: Confirm payment with card details
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: userName,
              email: userEmail,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        onError(stripeError.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        // Step 3: Confirm payment on backend
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
        setError("Payment processing failed");
        onError("Payment processing failed");
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
      <div
        style={{
          marginBottom: "20px",
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424242",
                "::placeholder": {
                  color: "#aaa",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
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
          }}
        >
          {error}
        </div>
      )}

      <motion.button
        type="submit"
        disabled={!stripe || loading || isLoading}
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
        {loading || isLoading ? "Processing..." : `Pay ${currency} ${amount}`}
      </motion.button>
    </form>
  );
};

interface StripePaymentFormWrapperProps {
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

export const StripePaymentFormWrapper: React.FC<
  StripePaymentFormWrapperProps
> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCardForm {...props} />
    </Elements>
  );
};

export default StripePaymentFormWrapper;
