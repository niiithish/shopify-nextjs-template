const MIN_MARQUEE_SEGMENTS = 2;
const MAX_MARQUEE_SEGMENTS = 8;
const TARGET_MARQUEE_SLOTS = 18;

export function getMarqueeRepeatCount(publisherCount: number): number {
  if (publisherCount <= 0) {
    return MIN_MARQUEE_SEGMENTS;
  }

  return Math.max(
    MIN_MARQUEE_SEGMENTS,
    Math.min(
      MAX_MARQUEE_SEGMENTS,
      Math.ceil(TARGET_MARQUEE_SLOTS / publisherCount)
    )
  );
}

export function getMarqueeTrackStyle(
  segments: number,
  gap: number,
  durationSeconds: number
): React.CSSProperties {
  return {
    gap: `${gap}px`,
    animationDuration: `${durationSeconds}s`,
    ["--pw-mq-n" as string]: String(segments),
  };
}
