"use client";

import { motion } from "framer-motion";

export function AmbientParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-pink-200/20 blur-3xl"
        style={{ top: "8%", right: "-10%" }}
        animate={{ y: [0, -20, 0], opacity: [0.2, 0.38, 0.2] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-blue-200/15 blur-3xl"
        style={{ bottom: "20%", left: "-8%" }}
        animate={{ y: [0, 14, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 3,
        }}
      />
    </div>
  );
}
