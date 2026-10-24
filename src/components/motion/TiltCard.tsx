import { MouseEvent, ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { isFinePointer, useMotionOk } from "./ready";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  tilt?: number;
  cursor?: string;
}

const spring = { stiffness: 160, damping: 18, mass: 0.6 };

/** 3D tilt toward the pointer with a champagne spotlight that follows it. */
export const TiltCard = ({
  children,
  className,
  tilt = 7,
  cursor = "view",
}: TiltCardProps) => {
  const enabled = useMotionOk() && isFinePointer();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const x = useSpring(px, spring);
  const y = useSpring(py, spring);

  const rotateX = useTransform(y, [0, 1], [tilt, -tilt]);
  const rotateY = useTransform(x, [0, 1], [-tilt, tilt]);
  const spotX = useTransform(x, [0, 1], ["0%", "100%"]);
  const spotY = useTransform(y, [0, 1], ["0%", "100%"]);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${spotX} ${spotY}, rgb(var(--accent-rgb) / 0.16), transparent 42%)`;
  const glow = useMotionValue(0);
  const glowSpring = useSpring(glow, { stiffness: 120, damping: 20 });

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  };

  return (
    <motion.div
      className={className}
      data-cursor={cursor}
      onMouseMove={onMove}
      onMouseEnter={() => glow.set(1)}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", ...spring }}
    >
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          background: spotlight,
          opacity: glowSpring,
        }}
      />
      {children}
    </motion.div>
  );
};
