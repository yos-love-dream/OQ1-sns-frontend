"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getEnneagramInfo } from "../model/enneagram";

interface EnneagramHeroProps {
  typeValue?: string;
}

export function EnneagramHero({ typeValue }: EnneagramHeroProps) {
  const info = getEnneagramInfo(typeValue);
  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[360px] bg-white border border-gray-200 rounded-lg p-6 mb-4 text-center"
    >
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Your Type
      </p>
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          src={info.image}
          alt={info.name}
          fill
          className="object-contain"
          placeholder="blur"
        />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{info.name}</h2>
      <p className="text-xs text-gray-400 mt-0.5 tabular-nums">{typeValue}</p>
      <p className="text-sm text-gray-600 mt-2">{info.description}</p>
    </motion.div>
  );
}
