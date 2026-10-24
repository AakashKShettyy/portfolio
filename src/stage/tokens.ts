// Where the floating props sit: left/top in % of the viewport, size in px at a
// 1440px-wide screen (the layout idea from the Soda reference).
export interface Slot {
  left: number;
  top: number;
  size: number;
  opacity?: number;
}
export const FG_SLOTS: Slot[] = [
  { left: 37, top: 60, size: 98 },
  { left: 25, top: 80, size: 62 },
  { left: 68, top: 74, size: 98 },
  { left: 60, top: 15, size: 57 },
  { left: 12, top: 70, size: 65 },
  { left: 79, top: 53, size: 98 },
];
export const BG_SLOTS: Slot[] = [
  { left: 38, top: 27, size: 58, opacity: 0.75 },
  { left: 87, top: 49, size: 55, opacity: 0.75 },
  { left: 56, top: 90, size: 51, opacity: 0.7 },
];

// Phones: tokens stay in the top half, around the figure, clear of the text below.
export const FG_SLOTS_MOBILE: Slot[] = [
  { left: 86, top: 17, size: 54 },
  { left: 8, top: 17, size: 50 },
  { left: 91, top: 36, size: 48 },
  { left: 7, top: 37, size: 46 },
  { left: 80, top: 5, size: 40 },
  { left: 19, top: 6, size: 40 },
];
export const BG_SLOTS_MOBILE: Slot[] = [
  { left: 90, top: 28, size: 44, opacity: 0.7 },
  { left: 12, top: 27, size: 42, opacity: 0.7 },
  { left: 92, top: 8, size: 38, opacity: 0.6 },
];
