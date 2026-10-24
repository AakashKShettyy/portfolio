import * as THREE from "three";
import type { ScreenMode } from "./script";

// The laptop screen is a 2D canvas redrawn a few times a second. Each mode
// mirrors a real project from the portfolio so the story and the screen agree.

const W = 1024; // logical content width
const H = 640;
const CW = 1200; // canvas width (matches the monitor's 1.88:1 display)
const PAD = (CW - W) / 2;
const BG = "#080b14";
const PANEL = "#10152a";
const LINE = "rgba(232,235,240,0.09)";
const INK = "#e8ebf0";
const MUTED = "#8a92a0";
const ACCENT = "#9db4ff";
const GOOD = "#7fd8b0";

type Ctx = CanvasRenderingContext2D;

const rr = (c: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
};

const text = (c: Ctx, s: string, x: number, y: number, size: number, color = INK, weight = 500, font = "Geist, system-ui, sans-serif") => {
  c.font = `${weight} ${size}px ${font}`;
  c.fillStyle = color;
  c.textBaseline = "alphabetic";
  c.fillText(s, x, y);
};

const mono = (c: Ctx, s: string, x: number, y: number, size: number, color = INK) =>
  text(c, s, x, y, size, color, 400, '"Geist Mono", ui-monospace, monospace');

const chrome = (c: Ctx, title: string) => {
  c.fillStyle = BG;
  c.fillRect(-PAD, 0, CW, H);
  c.fillStyle = "#0c1122";
  c.fillRect(-PAD, 0, CW, 54);
  ["#ff6b6b", "#ffd166", "#7fd8b0"].forEach((col, i) => {
    c.fillStyle = col;
    c.beginPath();
    c.arc(34 + i * 26, 27, 7, 0, Math.PI * 2);
    c.fill();
  });
  text(c, title, 130, 33, 20, MUTED, 500);
  c.fillStyle = LINE;
  c.fillRect(-PAD, 54, CW, 1);
};

const typed = (s: string, t: number, speed = 22) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor(t * speed))));

const boot = (c: Ctx, t: number) => {
  c.fillStyle = BG;
  c.fillRect(-PAD, 0, CW, H);
  c.strokeStyle = ACCENT;
  c.lineWidth = 6;
  c.lineCap = "round";
  c.beginPath();
  c.arc(W / 2, H / 2 - 20, 54, t * 3, t * 3 + 4.4);
  c.stroke();
  text(c, "Aakash Shetty", W / 2 - 90, H / 2 + 100, 28, MUTED, 500);
};

const elma = (c: Ctx, t: number) => {
  chrome(c, "ELMA 2.0  ·  Enterprise Assistant");
  rr(c, 60, 100, 560, 78, 18);
  c.fillStyle = PANEL;
  c.fill();
  text(c, typed("Which shipments to Toronto are delayed this week?", t, 26), 86, 148, 22, INK, 500);
  const reply = t > 2.2;
  if (reply) {
    rr(c, 300, 214, 660, 190, 18);
    c.fillStyle = "rgba(157,180,255,0.10)";
    c.fill();
    c.strokeStyle = "rgba(157,180,255,0.35)";
    c.lineWidth = 1.5;
    c.stroke();
    text(c, "ELMA", 326, 252, 16, ACCENT, 600);
    const lines = ["14 shipments are delayed:", "9 customs holds, 3 carrier delays,", "2 documentation gaps. Report ready."];
    lines.forEach((l, i) => text(c, typed(l, t - 2.4 - i * 0.9, 34), 326, 292 + i * 36, 22, INK, 400));
  }
  [["26 tools", 60], ["2.4s", 210], ["pgvector", 330]].forEach(([s, x]) => {
    rr(c, x as number, 470, 120, 40, 20);
    c.strokeStyle = "rgba(232,235,240,0.2)";
    c.lineWidth = 1.2;
    c.stroke();
    text(c, String(s), (x as number) + 22, 497, 17, MUTED, 500);
  });
  mono(c, "3,000+ employees · India · USA · Canada", 60, 590, 16, MUTED);
};

const pendulum = (c: Ctx, t: number) => {
  chrome(c, "Pendulum AI  ·  Freight Analytics");
  const tiles = [["Shipments", "1.6M+"], ["Branches", "25"], ["Endpoints", "43"], ["Graph nodes", "3,300"]];
  tiles.forEach(([k, v], i) => {
    const x = 60 + i * 232;
    rr(c, x, 90, 212, 108, 16);
    c.fillStyle = PANEL;
    c.fill();
    text(c, k, x + 20, 128, 17, MUTED, 500);
    text(c, v, x + 20, 176, 40, INK, 600);
  });
  rr(c, 60, 222, 628, 330, 16);
  c.fillStyle = PANEL;
  c.fill();
  text(c, "Prepaid → Collect", 84, 260, 19, MUTED, 500);
  for (let i = 0; i < 18; i++) {
    const h = 60 + 150 * (0.5 + 0.5 * Math.sin(i * 0.7 + t * 1.4)) * (0.45 + i / 30);
    c.fillStyle = i > 12 ? ACCENT : "rgba(157,180,255,0.35)";
    rr(c, 90 + i * 32, 520 - h, 20, h, 5);
    c.fill();
  }
  rr(c, 712, 222, 252, 330, 16);
  c.fillStyle = PANEL;
  c.fill();
  text(c, "Ask anything", 736, 260, 19, MUTED, 500);
  text(c, typed("Top lanes by margin?", t, 16), 736, 310, 18, INK, 400);
  c.fillStyle = ACCENT;
  c.fillRect(736, 340, 140 * (0.5 + 0.5 * Math.sin(t * 2)), 4);
};

const kairos = (c: Ctx, t: number) => {
  chrome(c, "KAIROS  ·  Finance Q&A agent");
  const code = [
    ["SELECT", ACCENT], [" region, SUM(ebit)", INK], ["\n", ""], ["FROM", ACCENT], [" pnl_monthly", INK], ["\n", ""],
    ["WHERE", ACCENT], [" quarter = 'Q3'", GOOD], ["\n", ""], ["GROUP BY", ACCENT], [" region;", INK],
  ] as const;
  let x = 70, y = 120, n = Math.floor(t * 28);
  for (const [s, col] of code) {
    for (const ch of s) {
      if (n-- <= 0) break;
      if (ch === "\n") { x = 70; y += 38; continue; }
      mono(c, ch, x, y, 24, col || INK);
      x += 14.6;
    }
  }
  if (t > 3.2) {
    rr(c, 60, 300, 900, 250, 14);
    c.fillStyle = PANEL;
    c.fill();
    [["Region", "EBIT (M)", "Δ"], ["India", "12.4", "+8%"], ["USA", "9.1", "+3%"], ["Canada", "4.7", "+11%"]].forEach((row, i) => {
      row.forEach((cell, j) => text(c, cell, 90 + j * 280, 346 + i * 52, 22, i === 0 ? MUTED : j === 2 ? GOOD : INK, i === 0 ? 500 : 400));
      c.fillStyle = LINE;
      c.fillRect(80, 360 + i * 52, 860, 1);
    });
  }
};

const glimpse = (c: Ctx, t: number) => {
  chrome(c, "GLIMPSE  ·  Client brief");
  text(c, "Client brief: 13 sections", 70, 118, 30, INK, 600);
  const secs = ["Company overview", "Leadership", "Recent news", "Trade lanes", "Competitors", "Pain points", "Opportunities"];
  secs.forEach((s, i) => {
    const on = t * 3 > i;
    rr(c, 70, 150 + i * 56, 560, 44, 12);
    c.fillStyle = on ? "rgba(157,180,255,0.1)" : PANEL;
    c.fill();
    text(c, s, 96, 180 + i * 56, 20, on ? INK : MUTED, 500);
    if (on) text(c, "✓", 590, 180 + i * 56, 20, GOOD, 600);
  });
  text(c, "3 hours → 30 seconds", 670, 300, 34, ACCENT, 600);
  text(c, "~900 sales reps", 670, 346, 22, MUTED, 400);
};

const projects = (c: Ctx, t: number) => {
  chrome(c, "aakashshetty.dev / projects");
  ["All", "Enterprise AI", "Automation", "Personal"].forEach((s, i) => {
    const x = 60 + i * 170;
    rr(c, x, 82, i === 0 ? 70 : 150, 38, 19);
    c.fillStyle = i === 0 ? ACCENT : "transparent";
    c.fill();
    c.strokeStyle = LINE;
    c.stroke();
    text(c, s, x + 20, 108, 17, i === 0 ? "#07080b" : MUTED, 500);
  });
  ["ELMA 2.0", "Pendulum", "KAIROS", "GLIMPSE", "ACE", "RIVA"].forEach((s, i) => {
    const x = 60 + (i % 3) * 312;
    const y = 150 + Math.floor(i / 3) * 214;
    const lift = Math.sin(t * 1.5 + i) * 2;
    rr(c, x, y + lift, 292, 190, 16);
    c.fillStyle = PANEL;
    c.fill();
    c.strokeStyle = LINE;
    c.stroke();
    text(c, s, x + 22, y + 56 + lift, 28, INK, 600);
    c.fillStyle = "rgba(157,180,255,0.25)";
    rr(c, x + 22, y + 140 + lift, 90, 10, 5);
    c.fill();
  });
};

const DRAW: Record<ScreenMode, (c: Ctx, t: number) => void> = { boot, elma, pendulum, kairos, glimpse, projects };

export interface ScreenHandle {
  texture: THREE.CanvasTexture;
  update: (mode: ScreenMode, time: number) => void;
}

export const createScreen = (): ScreenHandle => {
  const canvas = document.createElement("canvas");
  canvas.width = CW;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  let lastMode: ScreenMode | null = null;
  let modeStart = 0;
  let lastDraw = -1;
  return {
    texture,
    update(mode, time) {
      if (mode !== lastMode) {
        lastMode = mode;
        modeStart = time;
      }
      if (time - lastDraw < 1 / 14) return;
      lastDraw = time;
      ctx.save();
      ctx.translate(PAD, 0);
      DRAW[mode](ctx, time - modeStart);
      ctx.restore();
      texture.needsUpdate = true;
    },
  };
};
