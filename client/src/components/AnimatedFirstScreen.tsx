import React from "react";
import { motion } from "framer-motion";

interface AnimatedFirstScreenProps {
  backgroundImage: string;
}

export default function AnimatedFirstScreen({
  backgroundImage,
}: AnimatedFirstScreenProps) {
  // Animation variants
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
      },
    },
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 1,
        }}
      />

      {/* Floating decorative elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: "rgba(139, 69, 19, 0.1)",
          zIndex: 2,
        }}
      />

      <motion.div
        variants={floatingVariants}
        animate="animate"
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 1,
        }}
        style={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "rgba(139, 69, 19, 0.15)",
          zIndex: 2,
        }}
      />

      {/* Animated content overlay - ensures content is readable */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* This container will hold the actual form content */}
        <motion.div variants={itemVariants} style={{ width: "100%" }}>
          {/* Content will be passed as children or rendered by parent */}
        </motion.div>
      </motion.div>
    </div>
  );
}
