import { useEffect, useRef, useState } from "react";

function parseValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return {
    target: match ? Number(match[1]) : 0,
    suffix: match?.[2] ?? value,
    numeric: Boolean(match),
  };
}

export function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [{ target, suffix, numeric }] = useState(() => parseValue(value));
  const [display, setDisplay] = useState(0);
  const played = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const start = () => {
      if (played.current) return;
      played.current = true;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!numeric || prefersReducedMotion) {
        setDisplay(target);
        return;
      }

      const startTime = performance.now();
      const duration = 1400;

      const tick = (now: number) => {
        const progress = Math.min(1, Math.max(0, (now - startTime) / duration));
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(target * eased));
        if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
      },
      { rootMargin: "420px 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [numeric, target]);

  if (!numeric) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
