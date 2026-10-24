import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionOk } from "./ready";

interface ParallaxProps {
  children: ReactNode;
  /** Pixels of travel either side of centre while the element crosses the viewport. */
  offset?: number;
  className?: string;
}

export const Parallax = ({ children, offset = 60, className }: ParallaxProps) => {
  const ok = useMotionOk();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (!ok) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
};
