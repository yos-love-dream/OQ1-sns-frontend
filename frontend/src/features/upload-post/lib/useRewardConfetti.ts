"use client";

import { useEffect } from "react";

const CONFETTI_DURATION_MS = 3000;
const CONFETTI_INTERVAL_MS = 250;
const PARTICLES_PER_BURST = 50;

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export function useRewardConfetti(active: boolean) {
  useEffect(() => {
    if (!active) return;

    let interval: ReturnType<typeof setInterval>;
    let cancelled = false;

    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;

      const animationEnd = Date.now() + CONFETTI_DURATION_MS;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 100,
      };

      interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = PARTICLES_PER_BURST * (timeLeft / CONFETTI_DURATION_MS);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, CONFETTI_INTERVAL_MS);
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [active]);
}
