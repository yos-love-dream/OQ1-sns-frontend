export const fadeRise = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" as const, delay },
});

const FEED_ITEM_INITIAL_Y = 14;
const FEED_ITEM_DURATION = 0.4;
const FEED_ITEM_STAGGER_STEP = 0.07;
const FEED_ITEM_MAX_STAGGER_INDEX = 8;

/** 피드 항목 stagger 진입 애니메이션. baseDelay 이후 index별로 STAGGER_STEP만큼 늦게 등장. */
export const feedItemTransition = (index: number, baseDelay: number) => ({
  initial: { opacity: 0, y: FEED_ITEM_INITIAL_Y },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: FEED_ITEM_DURATION,
    ease: "easeOut" as const,
    delay:
      baseDelay +
      Math.min(index, FEED_ITEM_MAX_STAGGER_INDEX) * FEED_ITEM_STAGGER_STEP,
  },
});
