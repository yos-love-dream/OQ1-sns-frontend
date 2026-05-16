"use client";

import { motion } from "framer-motion";
import { Home, Trophy } from "lucide-react";

interface RewardOverlayProps {
  onClose: () => void;
}

export function RewardOverlay({ onClose }: RewardOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const, delay: 0.1 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-linear-to-tr from-yellow-300 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-5 text-white shadow-lg">
            <Trophy size={40} strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">오.큐.완!</h2>
          <p className="text-gray-500 mb-8 text-sm">
            오늘 하루도 말씀과 함께 소중한 시간을 보내셨네요! ✨
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            <span>홈으로 돌아가기</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
