import { MouseEvent, ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { isFinePointer, useMotionOk } from "./ready";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Pulls its child toward the pointer while hovered. */
export const Magnetic = ({
  children,
  strength = 0.35,
  className,
}: MagneticProps) => {
  const enabled = useMotionOk() && isFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });

  if (!enabled) return <div className={className}>{children}</div>;

  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
};
