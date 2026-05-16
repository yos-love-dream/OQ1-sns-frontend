"use client";

import { motion } from "framer-motion";

export function ProfileAmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-purple-200/15 blur-3xl"
        style={{ top: "10%", right: "-12%" }}
        animate={{ y: [0, -18, 0], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-amber-200/15 blur-3xl"
        style={{ bottom: "30%", left: "-10%" }}
        animate={{ y: [0, 12, 0], opacity: [0.15, 0.28, 0.15] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 2,
        }}
      />
    </div>
  );
}
