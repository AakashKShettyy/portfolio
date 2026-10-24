import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { EASE, useMotionOk } from "./ready";

interface CountUpProps {
  value: number;
  suffix?: string;
  decimals?: number;
}

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export const CountUp = ({ value, suffix = "", decimals = 0 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const ok = useMotionOk();
  const [display, setDisplay] = useState(ok ? 0 : value);

  useEffect(() => {
    if (!inView || !ok) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, ok, value]);

  return (
    <span ref={ref}>
      {format(display, decimals)}
      {suffix}
    </span>
  );
};
