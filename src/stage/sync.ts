import { stageState } from "./script";

// Maps the page scroll position onto the story value p (0..1).
// The anchors are real section positions, so the 3D story stays aligned with
// the text beside it whatever the screen size.

interface Anchor { y: number; p: number }

const offsetTop = (el: HTMLElement) => {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
};

let anchors: Anchor[] = [{ y: 0, p: 0 }];

const measure = () => {
  const get = (id: string) => document.getElementById(id);
  const y = (id: string) => {
    const e = get(id);
    return e ? offsetTop(e) : null;
  };
  const about = get("about");
  const yAbout = y("about");
  const yExp = y("experience");
  const yProj = y("projects");
  const yEdu = y("education");
  const yContact = y("contact");
  const yStack = y("stack");
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  if (yAbout === null || yExp === null || yProj === null || yEdu === null || yContact === null || !about) return;
  const aboutMid = yAbout + about.offsetHeight * 0.55;
  const vh = window.innerHeight;
  const projects = document.getElementById("projects");
  const projH = projects ? projects.offsetHeight : vh * 2;
  anchors = [
    { y: 0, p: 0 },
    { y: yAbout, p: 0.12 },
    { y: aboutMid, p: 0.3 },
    { y: yExp, p: 0.45 },
    { y: yProj - vh * 1.1, p: 0.66 }, // dive begins as Projects scrolls into view
    { y: yProj - vh * 0.1, p: 0.76 }, // screen fills the viewport
    { y: yProj + projH * 0.2, p: 0.8 }, // hold while the grid slides over it
    { y: yEdu, p: 0.86 }, // step back
    ...(yStack !== null ? [{ y: yStack, p: 0.91 }] : []),
    { y: yContact, p: 0.94 },
    { y: max, p: 1 },
  ].filter((a, i, arr) => i === 0 || a.y > arr[i - 1].y);
};

const toP = (scroll: number) => {
  if (scroll <= anchors[0].y) return anchors[0].p;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (scroll >= a.y && scroll <= b.y) return a.p + ((scroll - a.y) / (b.y - a.y || 1)) * (b.p - a.p);
  }
  return anchors[anchors.length - 1].p;
};

export const startScrollSync = () => {
  const onScroll = () => {
    stageState.target = toP(window.scrollY);
  };
  const remeasure = () => {
    measure();
    onScroll();
  };
  remeasure();
  const timers = [300, 1000, 2500].map((ms) => window.setTimeout(remeasure, ms));
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  return () => {
    timers.forEach(clearTimeout);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", remeasure);
    window.removeEventListener("load", remeasure);
  };
};
