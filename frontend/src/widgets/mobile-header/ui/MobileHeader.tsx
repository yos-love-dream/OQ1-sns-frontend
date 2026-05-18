"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  APP_EVENTS,
  formatDDayLabel,
  formatEventPeriod,
  getEventStatus,
  selectCurrentEvent,
  type AppEvent,
} from "@entities/event";

interface MobileHeaderProps {
  rightContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  showLogo?: boolean;
}

function EventChip({
  event,
  onClick,
}: {
  event: AppEvent;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-600"
      suppressHydrationWarning
    >
      {formatDDayLabel(getEventStatus(event))}
    </button>
  );
}

function EventDialog({
  event,
  open,
  onOpenChange,
}: {
  event: AppEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dDayLabel = formatDDayLabel(getEventStatus(event));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[300px] p-0 overflow-hidden gap-0 border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Upcoming Event</DialogTitle>
        </DialogHeader>
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
          <p className="text-xs font-medium text-white/60">
            Upcoming Event
          </p>
          <p className="text-base font-bold mt-2 leading-snug">
            {event.name}
          </p>
        </div>
        <div className="px-6 py-5 flex items-end justify-between bg-white">
          <div>
            <span className="text-3xl font-black tracking-tight text-gray-900">
              {dDayLabel}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              {formatEventPeriod(event)}
            </p>
          </div>
          <span className="text-xs font-medium text-gray-400">함께해요!</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MobileHeader({
  rightContent,
  leftContent,
  showLogo = true,
}: MobileHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [showEvent, setShowEvent] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentEvent = selectCurrentEvent(APP_EVENTS);

  return (
    <>
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex justify-between items-center">
        <div className="flex items-center">
          {leftContent}
          {showLogo && (
            <Link href="/" onClick={handleLogoClick}>
              <h1 className="text-xl font-bold italic font-serif tracking-tight">
                OQ1
              </h1>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {rightContent ??
            (currentEvent && (
              <EventChip
                event={currentEvent}
                onClick={() => setShowEvent(true)}
              />
            ))}
        </div>
      </div>

      {currentEvent && (
        <EventDialog
          event={currentEvent}
          open={showEvent}
          onOpenChange={setShowEvent}
        />
      )}
    </>
  );
}
