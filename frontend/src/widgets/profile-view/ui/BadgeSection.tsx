"use client";

import { fadeRise } from "@shared/lib/animations";
import {
  ResponsiveModal,
  ResponsiveModalBody,
} from "@shared/ui/responsive-modal";
import type { Badge } from "@shared/types";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useState } from "react";

interface BadgeSectionProps {
  badges: Badge[];
}

export function BadgeSection({ badges }: BadgeSectionProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div
      {...fadeRise(0.15)}
      className="bg-white p-5 rounded-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="text-gray-900" size={18} />
          <h2 className="font-bold text-gray-900 text-sm">뱃지 컬렉션</h2>
        </div>
        <button
          type="button"
          className="text-xs text-blue-500 font-semibold cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          모두 보기
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {badges.map((badge) => (
          <BadgeTile
            key={badge.id}
            badge={badge}
            onClick={() => setShowModal(true)}
          />
        ))}
      </div>

      <ResponsiveModal
        open={showModal}
        onOpenChange={setShowModal}
        title="나의 뱃지 컬렉션"
      >
        <ResponsiveModalBody className="max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            {badges.map((badge) => (
              <BadgeDetailRow key={badge.id} badge={badge} />
            ))}
          </div>
        </ResponsiveModalBody>
      </ResponsiveModal>
    </motion.div>
  );
}

function BadgeTile({ badge, onClick }: { badge: Badge; onClick: () => void }) {
  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
      onClick={onClick}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border ${badge.acquired ? "bg-gray-50 border-gray-200" : "bg-gray-50 border-gray-100 grayscale opacity-40"}`}
      >
        {badge.icon}
      </div>
      <span
        className={`text-[10px] font-medium text-center ${badge.acquired ? "text-gray-900" : "text-gray-400"}`}
      >
        {badge.name}
      </span>
    </div>
  );
}

function BadgeDetailRow({ badge }: { badge: Badge }) {
  return (
    <div className="flex gap-4 p-4 border border-gray-100 rounded-xl items-center bg-gray-50/50">
      <div
        className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-3xl border shadow-sm ${badge.acquired ? "bg-white border-gray-200" : "bg-gray-100 border-gray-100 grayscale opacity-40"}`}
      >
        {badge.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-900">{badge.name}</h3>
        <p className="text-[12px] text-gray-500 mt-1 leading-snug">
          {badge.description}
        </p>
        <div className="mt-2 flex items-center">
          {badge.acquired ? (
            <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
              획득 완료
            </span>
          ) : (
            <span className="text-[10px] font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded">
              미획득
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
