"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Subtle architectural route transition accent bar */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0.95 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          scaleX: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          opacity: { delay: 0.35, duration: 0.25 },
        }}
        style={{ transformOrigin: "0% 50%" }}
        className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2.5px] bg-track"
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
