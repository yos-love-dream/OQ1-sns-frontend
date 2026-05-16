"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useWatch, type Control } from "react-hook-form";
import { getEnneagramInfo } from "../model/enneagram";
import type { SignupFormData } from "../lib/schema";

interface EnneagramPreviewProps {
  typeValue?: string;
}

function EnneagramPreview({ typeValue }: EnneagramPreviewProps) {
  const info = getEnneagramInfo(typeValue);

  return (
    <AnimatePresence mode="wait">
      {info && (
        <motion.div
          key={typeValue?.[0]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
            <Image
              src={info.image}
              alt={info.name}
              fill
              className="object-contain"
              placeholder="blur"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{info.name} 타입</p>
            <p className="text-xs text-gray-500 mt-0.5">{info.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface EnneagramPreviewConnectedProps {
  control: Control<SignupFormData>;
}

export function EnneagramPreviewConnected({
  control,
}: EnneagramPreviewConnectedProps) {
  const enneagramType = useWatch({ control, name: "enneagram_type" });
  return <EnneagramPreview typeValue={enneagramType} />;
}
