import { PropsWithChildren, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother: ScrollSmoother | null = null;

export const pauseScroll = (paused: boolean) => smoother?.paused(paused);

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (smoother) smoother.scrollTo(el, true, "top top");
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/**
 * Wraps the page in GSAP ScrollSmoother on desktop. ScrollSmoother has to
 * exist before any ScrollTrigger pins are created, so children only mount
 * after it is set up. Touch and small screens use native scrolling.
 */
export const SmoothScroll = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 1025px) and (hover: hover)"
    ).matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reduced) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.1,
        effects: false,
      });
      smoother.paused(true);
    }
    setMounted(true);
    return () => {
      smoother?.kill();
      smoother = null;
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{mounted && children}</div>
    </div>
  );
};
