import React from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onContinue: () => void;
  selectedBrand?: string | null;
}

/**
 * WelcomeScreen Component
 * 
 * Design Philosophy: Professional, Warm, Inviting
 * - Soft gradient background with subtle animations
 * - Welcoming typography with clear hierarchy
 * - Smooth entrance animations for elements
 * - Mobile-first responsive design
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinue,
  selectedBrand,
}) => {
  // Brand-specific accent colors
  const brandColors: Record<string, string> = {
    chocodar: "#8B4513", // Brown
    sapooon: "#FF6B9D", // Pink
    cleanoosh: "#4A90E2", // Blue
    shomoo3: "#FF8C42", // Orange
    koohla: "#2ECC71", // Green
    concrete: "#34495E", // Dark Gray
  };

  const accentColor = selectedBrand
    ? brandColors[selectedBrand] || "#D4AF37"
    : "#D4AF37"; // Default gold

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center px-6 py-12"
      style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 240, 250, 0.95) 100%)`,
        minHeight: "100svh",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{
          background: accentColor,
          filter: "blur(80px)",
        }}
        animate={{
          y: [0, 30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
        style={{
          background: accentColor,
          filter: "blur(80px)",
        }}
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay: 1,
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-md text-center"
        variants={containerVariants}
      >
        {/* Icon/Logo placeholder */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <span className="text-4xl">🚀</span>
          </motion.div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-4xl font-bold mb-4"
          style={{
            color: "#1a1a1a",
            lineHeight: "1.3",
          }}
          variants={itemVariants}
        >
          أهلاً وسهلاً بك
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg mb-8"
          style={{
            color: "#666",
            lineHeight: "1.6",
          }}
          variants={itemVariants}
        >
          نحن هنا لمساعدتك على بدء مشروعك الخاص والنجاح فيه
        </motion.p>

        {/* Features list with staggered animation */}
        <motion.div
          className="space-y-3 mb-10"
          variants={containerVariants}
        >
          {[
            "تعلم من الخبراء",
            "خطوات عملية مجربة",
            "دعم مستمر",
          ].map((feature, index) => (
            <motion.div
              key={feature}
              className="flex items-center justify-center gap-3"
              variants={itemVariants}
            >
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: accentColor,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.4,
                }}
              >
                <span className="text-white text-sm">✓</span>
              </motion.div>
              <span style={{ color: "#333" }}>{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          variants={itemVariants}
          className="w-full"
        >
          <motion.button
            onClick={onContinue}
            className="w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: `0 10px 25px ${accentColor}40`,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            ابدأي الآن
          </motion.button>
        </motion.div>

        {/* Secondary text */}
        <motion.p
          className="text-sm mt-6"
          style={{
            color: "#999",
          }}
          variants={itemVariants}
        >
          لا تقلقي، العملية سهلة وسريعة
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
