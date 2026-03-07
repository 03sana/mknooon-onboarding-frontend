import React from "react";
import { motion } from "framer-motion";

export default function AnimatedFirstScreenMobile() {
  // Animation variants for floating elements
  const floatingVariants = (delay: number, duration: number = 4) => ({
    animate: {
      y: [0, -30, 0],
      x: [0, 10, 0],
      transition: {
        duration,
        repeat: Infinity,
        delay,
      },
    },
  });

  const rotatingVariants = (delay: number) => ({
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 8,
        repeat: Infinity,
        delay,
      },
    },
  });

  const pulseVariants = (delay: number) => ({
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay,
      },
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* SVG Container */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 375 800"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Animated Dotted Path */}
        <motion.path
          d="M 50 100 Q 187 150, 300 250 T 200 600"
          stroke="#D4A5D9"
          strokeWidth="2"
          strokeDasharray="8,6"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2 }}
        />

        {/* Floating Icons along the path */}

        {/* Lightbulb - top left */}
        <motion.g
          variants={floatingVariants(0, 4)}
          animate="animate"
          style={{ transformOrigin: "60px 120px" }}
        >
          <circle cx="60" cy="120" r="20" fill="rgba(255, 200, 124, 0.1)" />
          <circle cx="60" cy="120" r="12" fill="none" stroke="#FFD700" strokeWidth="1.5" />
          <path d="M 60 108 L 60 100" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 52 120 L 44 120" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 68 120 L 76 120" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* Notebook - left side */}
        <motion.g
          variants={floatingVariants(0.3, 4.5)}
          animate="animate"
          style={{ transformOrigin: "70px 250px" }}
        >
          <circle cx="70" cy="250" r="18" fill="rgba(255, 182, 193, 0.1)" />
          <rect x="60" y="242" width="20" height="16" fill="none" stroke="#FF69B4" strokeWidth="1.5" rx="2" />
          <path d="M 70 242 L 70 258" stroke="#FF69B4" strokeWidth="1" />
          <path d="M 62 246 L 78 246" stroke="#FF69B4" strokeWidth="0.8" />
          <path d="M 62 250 L 78 250" stroke="#FF69B4" strokeWidth="0.8" />
          <path d="M 62 254 L 78 254" stroke="#FF69B4" strokeWidth="0.8" />
        </motion.g>

        {/* Laptop - center */}
        <motion.g
          variants={floatingVariants(0.6, 5)}
          animate="animate"
          style={{ transformOrigin: "187px 380px" }}
        >
          <circle cx="187" cy="380" r="22" fill="rgba(176, 224, 230, 0.1)" />
          <rect x="170" y="368" width="34" height="20" fill="none" stroke="#87CEEB" strokeWidth="1.5" rx="2" />
          <rect x="172" y="370" width="30" height="14" fill="none" stroke="#87CEEB" strokeWidth="1" />
          <line x1="160" y1="390" x2="214" y2="390" stroke="#87CEEB" strokeWidth="1.5" />
        </motion.g>

        {/* Briefcase - right side */}
        <motion.g
          variants={floatingVariants(0.9, 4.5)}
          animate="animate"
          style={{ transformOrigin: "300px 320px" }}
        >
          <circle cx="300" cy="320" r="20" fill="rgba(255, 192, 203, 0.1)" />
          <rect x="286" y="310" width="28" height="18" fill="none" stroke="#FFB6C1" strokeWidth="1.5" rx="2" />
          <circle cx="293" cy="310" r="2" fill="#FFB6C1" />
          <circle cx="307" cy="310" r="2" fill="#FFB6C1" />
          <path d="M 293 310 L 293 308 Q 300 305 307 308 L 307 310" stroke="#FFB6C1" strokeWidth="1" fill="none" />
        </motion.g>

        {/* Growth Chart - right */}
        <motion.g
          variants={floatingVariants(1.2, 5)}
          animate="animate"
          style={{ transformOrigin: "280px 480px" }}
        >
          <circle cx="280" cy="480" r="20" fill="rgba(221, 160, 221, 0.1)" />
          <path d="M 270 490 L 270 475 L 275 480 L 280 470 L 285 478 L 290 468 L 290 490" fill="none" stroke="#DDA0DD" strokeWidth="1.5" />
          <path d="M 270 490 L 290 490" stroke="#DDA0DD" strokeWidth="1.5" />
        </motion.g>

        {/* Handshake - bottom right */}
        <motion.g
          variants={floatingVariants(1.5, 4.5)}
          animate="animate"
          style={{ transformOrigin: "250px 600px" }}
        >
          <circle cx="250" cy="600" r="20" fill="rgba(255, 182, 193, 0.1)" />
          <path d="M 240 595 L 245 600 L 260 605" fill="none" stroke="#FFB6C1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 260 595 L 255 600 L 240 605" fill="none" stroke="#FFB6C1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>

        {/* Star - top right */}
        <motion.g
          variants={floatingVariants(0.4, 5.5)}
          animate="animate"
          style={{ transformOrigin: "320px 150px" }}
        >
          <circle cx="320" cy="150" r="18" fill="rgba(255, 215, 0, 0.1)" />
          <path
            d="M 320 140 L 324 148 L 333 148 L 326 154 L 329 162 L 320 156 L 311 162 L 314 154 L 307 148 L 316 148 Z"
            fill="none"
            stroke="#FFD700"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Decorative Floating Elements */}

        {/* Heart 1 */}
        <motion.circle
          cx="100"
          cy="200"
          r="4"
          fill="#FFB6C1"
          variants={pulseVariants(0)}
          animate="animate"
        />

        {/* Heart 2 */}
        <motion.circle
          cx="150"
          cy="450"
          r="3"
          fill="#DDA0DD"
          variants={pulseVariants(0.5)}
          animate="animate"
        />

        {/* Dot 1 */}
        <motion.circle
          cx="200"
          cy="150"
          r="2.5"
          fill="#87CEEB"
          variants={floatingVariants(0.2, 6)}
          animate="animate"
        />

        {/* Dot 2 */}
        <motion.circle
          cx="80"
          cy="500"
          r="2"
          fill="#FFD700"
          variants={floatingVariants(0.7, 5.5)}
          animate="animate"
        />

        {/* Spiral 1 */}
        <motion.path
          d="M 320 400 Q 325 395 330 400 Q 325 405 320 400"
          fill="none"
          stroke="#DDA0DD"
          strokeWidth="1"
          variants={rotatingVariants(0)}
          animate="animate"
        />

        {/* Spiral 2 */}
        <motion.path
          d="M 50 600 Q 55 595 60 600 Q 55 605 50 600"
          fill="none"
          stroke="#FFB6C1"
          strokeWidth="1"
          variants={rotatingVariants(1)}
          animate="animate"
        />
      </svg>
    </div>
  );
}
