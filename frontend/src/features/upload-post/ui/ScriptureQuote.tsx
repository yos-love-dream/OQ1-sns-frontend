"use client";

import { fadeRise } from "@shared/lib/animations";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DailyQt } from "@entities/daily-word";

const COLLAPSED_HEIGHT_PX = 96;

interface ScriptureQuoteProps {
  dailyQt: DailyQt;
}

export function ScriptureQuote({ dailyQt }: ScriptureQuoteProps) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [canExpand, setCanExpand] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;
    const timer = setTimeout(() => {
      if (contentRef.current) {
        setCanExpand(contentRef.current.scrollHeight > COLLAPSED_HEIGHT_PX);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [dailyQt]);

  const isCollapsed = canExpand && !isExpanded;
  const formattedContent = dailyQt.content
    ? dailyQt.content.split("\\n").join("\n")
    : "묵상 말씀을 읽어보세요.";

  return (
    <motion.div
      {...fadeRise(0)}
      className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300 mx-4 mt-4 mb-2"
    >
      <h2 className="font-bold text-gray-900 text-sm mb-2">
        {dailyQt.bible_book} {dailyQt.chapter}:{dailyQt.verse_from}-
        {dailyQt.verse_to}
      </h2>
      <div
        className={`relative ${isCollapsed ? "max-h-24 overflow-hidden" : ""} transition-all duration-300`}
      >
        <p
          ref={contentRef}
          className="text-sm text-gray-600 leading-relaxed whitespace-pre-line italic"
        >
          {formattedContent}
        </p>
        {isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-gray-50 to-transparent" />
        )}
      </div>
      {canExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-center items-center gap-1 mt-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          {isExpanded ? (
            <>
              접기 <ChevronUp size={14} />
            </>
          ) : (
            <>
              더 보기 <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
