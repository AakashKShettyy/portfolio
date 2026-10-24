import { useEffect, useRef } from "react";
import { useMotionOk } from "../components/motion/ready";
import "./Stage.css";

// Translucent bubbles rising forever (every 400ms, 4-10s, as the reference).
const Motes = () => {
  const ref = useRef<HTMLDivElement>(null);
  const ok = useMotionOk();

  useEffect(() => {
    const host = ref.current;
    if (!host || !ok) return;
    const make = () => {
      if (document.hidden) return;
      const el = document.createElement("span");
      el.className = "mote";
      const size = Math.random() * 20 + 10;
      const dur = Math.random() * 6 + 4;
      el.style.width = el.style.height = `${size}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.bottom = "-50px";
      el.style.setProperty("--o", String(Math.random() * 0.4 + 0.2));
      el.style.animation = `moteUp ${dur}s linear forwards`;
      host.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000);
    };
    const id = setInterval(make, 400);
    return () => clearInterval(id);
  }, [ok]);

  return <div className="motes" ref={ref} aria-hidden />;
};

export default Motes;
