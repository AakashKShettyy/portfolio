import { useSyncExternalStore } from "react";
import gsap from "gsap";

// The three colour "worlds" (the flavours). Switching one is the page's
// signature moment: background morph, a swing-and-blur of the scene, and the
// floating tokens implode, change into the new world's stack, then explode out.

export type WorldId = "enterprise" | "automation" | "personal";

export interface World {
  id: WorldId;
  label: string;
  inner: string;
  mid: string;
  outer: string;
  /** Floating tokens for this world: 6 in front of the text, 3 behind. */
  fg: string[];
  bg: string[];
}

export const worlds: Record<WorldId, World> = {
  enterprise: {
    id: "enterprise",
    label: "Enterprise AI Agents",
    inner: "#0aa3a0",
    mid: "#05505a",
    outer: "#010f13",
    fg: ["cloud", "neural", "database", "bolt", "chat", "chip"],
    bg: ["terminal", "gear", "brackets"],
  },
  automation: {
    id: "automation",
    label: "Data & Document Automation",
    inner: "#3552ff",
    mid: "#14217f",
    outer: "#040824",
    fg: ["document", "eye", "gear", "database", "chat", "bolt"],
    bg: ["cloud", "chip", "neural"],
  },
  personal: {
    id: "personal",
    label: "Personal Projects",
    inner: "#7a35e8",
    mid: "#32107a",
    outer: "#0b0220",
    fg: ["react", "brackets", "neural", "terminal", "shield", "database"],
    bg: ["bolt", "chip", "cloud"],
  },
};

export const worldOrder: WorldId[] = ["enterprise", "automation", "personal"];

// Mutable state read every frame by the 3D layers (not React state).
export const worldState = {
  id: "enterprise" as WorldId,
  switching: false,
  /** 0 = tokens in place, 1 = collapsed to the centre. */
  collapse: 0,
  /** 0..1 swing of the scene while switching (peaks mid-switch). */
  swing: 0,
  /** Bumped at the peak so tokens re-roll their positions. */
  seed: 0,
};

// Pointer in pixels, shared by tokens and the avatar.
export const pointer = { px: 0, py: 0, nx: 0, ny: 0 };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useWorld = () => useSyncExternalStore(subscribe, () => worldState.id);

const canvasEl = () => document.querySelector<HTMLCanvasElement>(".stage canvas");

export const switchWorld = (id: WorldId) => {
  if (worldState.switching || id === worldState.id) return;
  worldState.switching = true;
  const target = worlds[id];
  const root = document.documentElement;

  // 1. Background morph (same duration and ease as the Soda reference).
  gsap.to(root, {
    "--bg-inner": target.inner,
    "--bg-mid": target.mid,
    "--bg-outer": target.outer,
    duration: 1.5,
    ease: "power2.inOut",
  } as gsap.TweenVars);

  const blur = { v: 0 };
  const setBlur = () => {
    const c = canvasEl();
    if (c) c.style.filter = blur.v > 0.1 ? `blur(${blur.v}px)` : "none";
  };

  // 2. Swing + blur peaks, then settles with a back-out overshoot.
  const tl = gsap.timeline({
    onComplete: () => {
      worldState.switching = false;
      worldState.collapse = 0;
      worldState.swing = 0;
      blur.v = 0;
      setBlur();
    },
  });
  tl.to(worldState, { swing: 1, duration: 0.6, ease: "power2.in" }, 0)
    .to(blur, { v: 14, duration: 0.6, ease: "power2.in", onUpdate: setBlur }, 0)
    // 3. Tokens implode to the centre...
    .to(worldState, { collapse: 1, duration: 0.5, ease: "power2.in" }, 0)
    .add(() => {
      // ...swap at the peak (new world, new stack, new random positions)...
      worldState.id = id;
      worldState.seed += 1;
      emit();
      window.dispatchEvent(new Event("world-swap"));
    }, 0.62)
    // ...and explode back out.
    .to(worldState, { collapse: 0, duration: 0.9, ease: "back.out(1.5)" }, 0.8)
    .to(worldState, { swing: 0, duration: 1.3, ease: "back.out(0.7)" }, 0.66)
    .to(blur, { v: 0, duration: 1.1, ease: "power2.out", onUpdate: setBlur }, 0.66);
};

export const nextWorld = (dir: 1 | -1) => {
  const i = worldOrder.indexOf(worldState.id);
  switchWorld(worldOrder[(i + dir + worldOrder.length) % worldOrder.length]);
};
