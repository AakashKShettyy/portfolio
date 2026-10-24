import { createContext, useContext } from "react";
import { useReducedMotion } from "framer-motion";

// True once the loader has finished, so hero animations can wait for it.
export const ReadyContext = createContext(false);
export const useSiteReady = () => useContext(ReadyContext);

export const EASE = [0.22, 1, 0.36, 1] as const;

export const useMotionOk = () => !useReducedMotion();

export const isFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
