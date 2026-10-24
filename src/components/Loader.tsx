import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE, useMotionOk } from "./motion/ready";
import "./styles/Loader.css";

const MIN_MS = 2400;
const MAX_MS = 14000;

// Draws an "AS" monogram, counts to 100, then splits like a curtain.
const Loader = ({ onDone }: { onDone: () => void }) => {
  const ok = useMotionOk();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let heroReady = false;
    let raf = 0;
    let finished = false;
    const markReady = () => (heroReady = true);
    window.addEventListener("hero-ready", markReady, { once: true });
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const fontsReady = fonts ? fonts.ready : Promise.resolve();
    let fontsOk = false;
    fontsReady.then(() => (fontsOk = true));

    const min = ok ? MIN_MS : 400;
    const tick = (now: number) => {
      const elapsed = now - start;
      const timeRatio = Math.min(1, elapsed / min);
      const canFinish = (heroReady && fontsOk) || elapsed > MAX_MS;
      // Hold at 94% until the 3D scene and fonts are actually ready.
      const cap = canFinish ? 1 : 0.94;
      const eased = 1 - Math.pow(1 - Math.min(timeRatio, cap), 3);
      const next = Math.round(eased * 100);
      setValue(next);
      if (next >= 100 && !finished) {
        finished = true;
        setTimeout(onDone, 350);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hero-ready", markReady);
    };
  }, [ok, onDone]);

  const panel = (side: "top" | "bottom") => ({
    exit: {
      y: side === "top" ? "-101%" : "101%",
      transition: { duration: 1, ease: EASE, delay: 0.15 },
    },
  });

  return (
    <motion.div className="loader" role="status" aria-label="Loading">
      <motion.div className="loader-panel loader-top" {...panel("top")} />
      <motion.div className="loader-panel loader-bottom" {...panel("bottom")} />
      <motion.div
        className="loader-content"
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.45 } }}
      >
        <svg className="loader-mark" viewBox="0 0 120 80" fill="none" aria-hidden>
          <motion.path
            d="M6 72 L30 8 L54 72 M14 52 H46"
            initial={{ pathLength: ok ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: EASE }}
          />
          <motion.path
            d="M104 22 C96 10 74 12 72 26 C70 40 106 40 104 56 C102 72 78 72 68 60"
            initial={{ pathLength: ok ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.7, ease: EASE, delay: 0.35 }}
          />
        </svg>
        <div className="loader-meta">
          <span className="loader-count display">
            {String(value).padStart(3, "0")}
          </span>
          <span className="loader-label">Aakash Shetty · Portfolio</span>
        </div>
        <div className="loader-bar">
          <motion.i style={{ scaleX: value / 100 }} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
