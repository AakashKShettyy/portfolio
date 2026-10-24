import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { isFinePointer, useMotionOk } from "./motion/ready";
import "./styles/Cursor.css";

type Mode = "default" | "link" | "view" | "hidden";

// Dot + trailing ring. Elements opt in with data-cursor="link" | "view" | "hidden".
// Links and buttons get "link" automatically.
const Cursor = () => {
  const enabled = useMotionOk() && isFinePointer();
  const [mode, setMode] = useState<Mode>("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.3 });
  const dotY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.3 });
  const ringX = useSpring(x, { stiffness: 170, damping: 22, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 170, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button"
      );
      const value = el?.dataset.cursor as Mode | undefined;
      setMode(value ?? (el ? "link" : "default"));
    };
    const leave = () => setMode("hidden");
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: mode === "hidden" || mode === "view" ? 0 : 1 }}
      />
      <motion.div
        className={`cursor-ring cursor-${mode}`}
        style={{ x: ringX, y: ringY }}
        animate={{
          width: mode === "view" ? 92 : mode === "link" ? 64 : 34,
          height: mode === "view" ? 92 : mode === "link" ? 64 : 34,
          opacity: mode === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <span>{mode === "view" ? "View" : ""}</span>
      </motion.div>
    </>
  );
};

export default Cursor;
