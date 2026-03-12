import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Function to capture invoice and show in modal for screenshot
const captureInvoiceImage = async (
  invoiceElementId: string,
  onImageReady: (imageUrl: string) => void
) => {
  try {
    const invoiceElement = document.getElementById(invoiceElementId);
    if (!invoiceElement) {
      console.error("Invoice element not found");
      return;
    }

    const canvas = await html2canvas(invoiceElement, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imageUrl = canvas.toDataURL("image/png");
    onImageReady(imageUrl);
  } catch (error) {
    console.error("Error capturing invoice:", error);
    alert("حدث خطأ في التقاط الصورة. يرجى المحاولة مرة أخرى.");
  }
};

interface PaymentDetails {
  id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  country_code: string;
  created_at: string;
  status: string;
  brand?: string;
}

export const PaymentSuccess: React.FC = () => {
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceImageUrl, setInvoiceImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const intentId = params.get("payment_intent_id");
    setPaymentIntentId(intentId);

    if (intentId) {
      fetchPaymentDetails(intentId);
    }
  }, []);

  const fetchPaymentDetails = async (intentId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stripe/payment-status?payment_intent_id=${intentId}`
      );
      const data = await response.json();
      if (data.success && data.payment) {
        setPaymentDetails(data.payment);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

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
          maxWidth: "600px",
          width: "100%",
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
            textAlign: "center",
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
            textAlign: "center",
          }}
        >
          شكراً لك على الدفع
        </p>

        <p
          style={{
            fontSize: "14px",
            color: "#999",
            marginBottom: "32px",
            fontFamily: "Cairo, sans-serif",
            textAlign: "center",
          }}
        >
          تم استلام طلبك وسيتم معالجته قريباً
        </p>

        {/* Invoice Section */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#999",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            جاري تحميل التفاصيل...
          </div>
        ) : paymentDetails ? (
          <motion.div
            id="invoice-card"
            style={{
              backgroundColor: "#f9f9f9",
              padding: "24px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #e0e0e0",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {/* Invoice Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#2D2D2D",
                  fontFamily: "Cairo, sans-serif",
                  margin: 0,
                }}
              >
                فاتورة الدفع
              </h2>
              <span
                style={{
                  fontSize: "12px",
                  color: "#999",
                  fontFamily: "monospace",
                }}
              >
                #{paymentDetails.stripe_payment_intent_id?.substring(0, 8) || "N/A"}
              </span>
            </div>

            {/* Customer Details */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  fontFamily: "Cairo, sans-serif",
                  margin: "0 0 4px 0",
                }}
              >
                العميل
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#2D2D2D",
                  fontFamily: "Cairo, sans-serif",
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {paymentDetails.user_name}
              </p>

              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontFamily: "Cairo, sans-serif",
                  margin: "2px 0 0 0",
                }}
              >
                {paymentDetails.user_phone}
              </p>
            </div>

            {/* Course/Brand Details */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  fontFamily: "Cairo, sans-serif",
                  margin: "0 0 4px 0",
                }}
              >
                الدورة
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#2D2D2D",
                  fontFamily: "Cairo, sans-serif",
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {paymentDetails.brand}
              </p>
            </div>
            {/* Payment Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    fontFamily: "Cairo, sans-serif",
                    margin: "0 0 4px 0",
                  }}
                >
                  التاريخ
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#2D2D2D",
                    fontFamily: "Cairo, sans-serif",
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  {formatDate(paymentDetails.created_at)}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    fontFamily: "Cairo, sans-serif",
                    margin: "0 0 4px 0",
                  }}
                >
                  الحالة
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#4CAF50",
                    fontFamily: "Cairo, sans-serif",
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  {paymentDetails.status === "succeeded" ? "مكتمل" : "قيد المعالجة"}
                </p>
              </div>
            </div>

            {/* Amount Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  fontFamily: "Cairo, sans-serif",
                  margin: 0,
                }}
              >
                المبلغ المدفوع
              </p>
              <p
                style={{
                  fontSize: "20px",
                  color: "#d97a6f",
                  fontFamily: "Cairo, sans-serif",
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                {formatAmount(paymentDetails.amount, paymentDetails.currency)}
              </p>
            </div>

            {/* Payment Intent ID */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: "12px",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#999",
                  fontFamily: "Cairo, sans-serif",
                  margin: "0 0 4px 0",
                }}
              >
                معرف المعاملة
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#666",
                  fontFamily: "monospace",
                  margin: 0,
                  wordBreak: "break-all",
                }}
              >
                {paymentDetails.stripe_payment_intent_id}
              </p>
            </div>
          </motion.div>
        ) : null}

        <motion.button
          onClick={() => {
            if (paymentDetails) {
              captureInvoiceImage("invoice-card", (imageUrl) => {
                setInvoiceImageUrl(imageUrl);
                setShowInvoiceModal(true);
              });
            }
          }}
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
          اضغط هنا لارسال الوصل
        </motion.button>

        {/* Invoice Image Modal */}
        {showInvoiceModal && invoiceImageUrl && (
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInvoiceModal(false)}
          >
            <motion.div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "auto",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#2D2D2D",
                  fontFamily: "Cairo, sans-serif",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                الوصل - خذ لقطة شاشة وأرسلها
              </h3>
              <img
                src={invoiceImageUrl}
                alt="Invoice"
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              />
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  fontFamily: "Cairo, sans-serif",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                الرجاء أخذ لقطة شاشة للوصل وأرسلها عبر واتس اب
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <motion.button
                  onClick={() => setShowInvoiceModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #d97a6f",
                    backgroundColor: "transparent",
                    color: "#d97a6f",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Cairo, sans-serif",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إغلاق
                </motion.button>
                <motion.button
                  onClick={() => {
                    const paymentMethod = "Stripe";
                    const formattedAmount = ((paymentDetails?.amount || 0) / 100).toFixed(2);
                    const message = `مرحبا، دفعت اشتراك كورس ${paymentDetails?.brand || 'دورة'} من ${paymentDetails?.country_code || 'غير محدد'} عبر ${paymentMethod}. هذه صورة إشعار الدفع.\n\nالسعر المدفوع: ${formattedAmount} ${paymentDetails?.currency || ''}`;
                    const phone = "905344258184";
                    window.open(
                      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                      "_blank"
                    );
                  }}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#25D366",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Cairo, sans-serif",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  فتح واتس
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccess;
