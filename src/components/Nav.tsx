import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { navLinks } from "../data/content";
import { scrollToId } from "../lib/smooth";
import { EASE, useSiteReady } from "./motion/ready";
import { Magnetic } from "./motion/Magnetic";
import "./styles/Nav.css";

const Nav = () => {
  const ready = useSiteReady();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ready]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <motion.header
        className={`nav ${scrolled ? "nav-scrolled" : ""}`}
        initial={{ y: -24, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.6 }}
      >
        <a
          href="#top"
          className="nav-mark"
          aria-label="Aakash Shetty, back to top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="display">A</span>
          <i />
          <span className="display">S</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
              className={active === l.id ? "is-active" : ""}
            >
              {l.label}
              {active === l.id && (
                <motion.i
                  layoutId="nav-underline"
                  className="nav-underline"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          ))}
        </nav>

        <Magnetic strength={0.25}>
          <a href="#contact" onClick={go("contact")} className="nav-cta">
            Let&apos;s talk
          </a>
        </Magnetic>
      </motion.header>
    </>
  );
};

export default Nav;
