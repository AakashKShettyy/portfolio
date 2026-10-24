// "A Day at the Desk": the scroll script as data.
//
// One number, p (0..1), drives the whole stage. Everything here is a table of
// keyframes over p: chapters, camera path, character poses, lights, laptop
// screen. Change the story by editing these tables, not the components.

export type V3 = [number, number, number];

export const JOINTS = [
  "spine", "neck", "head",
  "shL", "shR", "elL", "elR", "wrL", "wrR",
  "hipL", "hipR", "knL", "knR", "anL", "anR",
] as const;
export type Joint = (typeof JOINTS)[number];

// The man faces +z (towards the camera). His left is +x, his right is -x.
// Joint conventions (all local Euler XYZ, radians):
//   shoulder x<0 raises the arm forward; z>0 lifts the left arm out, z<0 the right
//   elbow    x<0 bends the forearm forward/up
//   hip      x<0 lifts the thigh forward;  knee x>0 folds the shin back
export interface Pose {
  j: Record<Joint, V3>;
  root: V3; // floor point under the pelvis
  rotY: number; // body heading, 0 = facing +z
  hipY: number; // pelvis height above the floor
  fingL: number; // 0 open .. 1 fist
  fingR: number;
  wave: number; // 0..1 right-hand wave
  type: number; // 0..1 typing
  walk: number; // 0..1 walking cycle
  chairZ: number; // chair roll (towards the desk is negative)
}

const Z: V3 = [0, 0, 0];
const baseJoints = (): Record<Joint, V3> =>
  Object.fromEntries(JOINTS.map((k) => [k, [...Z] as V3])) as Record<Joint, V3>;

export const makePose = (o: Partial<Omit<Pose, "j">> & { j?: Partial<Record<Joint, V3>> } = {}): Pose => ({
  j: { ...baseJoints(), ...(o.j ?? {}) },
  root: o.root ?? [0, 0, 0],
  rotY: o.rotY ?? 0,
  hipY: o.hipY ?? 2.7,
  fingL: o.fingL ?? 0.35,
  fingR: o.fingR ?? 0.35,
  wave: o.wave ?? 0,
  type: o.type ?? 0,
  walk: o.walk ?? 0,
  chairZ: o.chairZ ?? 0,
});

// ── poses ───────────────────────────────────────────────────────────────────

const stand = makePose({
  j: {
    shL: [0.04, 0, 0.1], shR: [0.04, 0, -0.1],
    elL: [-0.2, 0, 0], elR: [-0.2, 0, 0],
    hipL: [0, 0, 0.03], hipR: [0, 0, -0.03],
  },
});

// Hello: right hand up in a wave, left hand low.
const hello = makePose({
  j: {
    spine: [0, 0.06, 0],
    shR: [-0.7, 0, -0.75], elR: [-1.75, 0, 0],
    shL: [-0.35, 0, 0.12], elL: [-1.2, 0, 0],
    hipL: [0, 0, 0.03], hipR: [0, 0, -0.03],
  },
  wave: 1, fingR: 0.05, fingL: 0.25,
});

// Right hand rests on the tie, left hand on the cuff.
const tie = makePose({
  j: {
    spine: [0, -0.04, 0],
    shR: [-0.55, 0.25, -0.15], elR: [-2.05, 0.3, 0],
    shL: [-0.45, 0, 0.1], elL: [-1.35, 0, 0],
    wrL: [0, 0, 0.2],
    hipL: [0, 0, 0.03], hipR: [0, 0, -0.03],
  },
  fingR: 0.2, fingL: 0.3,
});

// Looks around the room, hands at the jacket buttons.
const look = makePose({
  j: {
    spine: [0, -0.18, 0], neck: [0, -0.2, 0], head: [0, -0.15, 0],
    shR: [-0.4, 0.1, -0.12], elR: [-1.6, 0.3, 0],
    shL: [-0.4, -0.1, 0.12], elL: [-1.6, -0.3, 0],
    hipL: [0, 0, 0.03], hipR: [0, 0, -0.03],
  },
  fingL: 0.4, fingR: 0.4,
});

const turn = makePose({ ...stand, rotY: Math.PI * 0.5, j: stand.j });

// Mid-stride on the way to the chair.
const stride = makePose({ j: stand.j, rotY: Math.PI * 0.5, root: [1.2, 0, 0.5], walk: 1 });
const arrive = makePose({ j: stand.j, rotY: Math.PI * 0.5, root: [2.35, 0, 0.9], walk: 0.4 });
const faceDesk = makePose({ j: stand.j, rotY: Math.PI, root: [2.6, 0, 1.05] });

// Seated, hands on the keyboard.
const SEAT: V3 = [2.6, 0, 1.05];
const sitHands = {
  spine: [0.06, 0, 0] as V3,
  head: [0.1, 0, 0] as V3,
  shL: [-0.62, 0, 0.1] as V3, shR: [-0.62, 0, -0.1] as V3,
  elL: [-1.2, 0, 0] as V3, elR: [-1.2, 0, 0] as V3,
  wrL: [0.35, 0, 0] as V3, wrR: [0.35, 0, 0] as V3,
  hipL: [-1.52, 0, 0.1] as V3, hipR: [-1.52, 0, -0.1] as V3,
  knL: [1.52, 0, 0] as V3, knR: [1.52, 0, 0] as V3,
  anL: [0.0, 0, 0] as V3, anR: [0.0, 0, 0] as V3,
};
const sitDown = makePose({ j: { ...sitHands, spine: [0.25, 0, 0], hipL: [-0.9, 0, 0.1], hipR: [-0.9, 0, -0.1], knL: [0.95, 0, 0], knR: [0.95, 0, 0] }, rotY: Math.PI, root: SEAT, hipY: 2.0, chairZ: 0.5 });
const sit = makePose({ j: sitHands, rotY: Math.PI, root: [SEAT[0], 0, SEAT[2] + 0.12], hipY: 1.45, fingL: 0.55, fingR: 0.55, chairZ: 0 });
const typing = makePose({ ...sit, j: { ...sitHands, head: [0.16, -0.05, 0] }, root: sit.root, rotY: Math.PI, hipY: 1.45, type: 1, fingL: 0.55, fingR: 0.55 });

// Leans back, hands behind the head.
const leanBack = makePose({
  j: {
    ...sitHands,
    spine: [-0.28, 0, 0], head: [0.1, 0.35, 0],
    shL: [-0.5, 0.2, 1.15], shR: [-0.5, -0.2, -1.15],
    elL: [-2.4, 0.5, 0], elR: [-2.4, -0.5, 0],
  },
  rotY: Math.PI * 0.82, root: [SEAT[0], 0, SEAT[2] + 0.18], hipY: 1.45, fingL: 0.3, fingR: 0.3, chairZ: 0.15,
});

const standUp = makePose({ j: stand.j, rotY: Math.PI * 1.25, root: [2.2, 0, 1.0], hipY: 2.5, walk: 0.3 });
const walkBack = makePose({ j: stand.j, rotY: Math.PI * 1.6, root: [1.0, 0, 0.6], walk: 1 });

// Handshake: right arm out, open hand.
const handshake = makePose({
  j: {
    shR: [-1.35, 0.2, -0.2], elR: [-0.35, 0, 0],
    shL: [0.04, 0, 0.1], elL: [-0.25, 0, 0],
    spine: [0, 0.05, 0],
    hipL: [0, 0, 0.03], hipR: [0, 0, -0.03],
  },
  rotY: Math.PI * 2, root: [0, 0, 0], fingR: 0, fingL: 0.35,
});

export interface PoseKey { p: number; pose: Pose }
export const poseKeys: PoseKey[] = [
  { p: 0.0, pose: hello },
  { p: 0.06, pose: hello },
  { p: 0.09, pose: tie },
  { p: 0.14, pose: tie },
  { p: 0.2, pose: stand },
  { p: 0.26, pose: look },
  { p: 0.3, pose: turn },
  { p: 0.34, pose: stride },
  { p: 0.38, pose: arrive },
  { p: 0.4, pose: faceDesk },
  { p: 0.425, pose: sitDown },
  { p: 0.45, pose: sit },
  { p: 0.5, pose: typing },
  { p: 0.68, pose: typing },
  { p: 0.8, pose: sit },
  { p: 0.86, pose: leanBack },
  { p: 0.9, pose: leanBack },
  { p: 0.92, pose: standUp },
  { p: 0.95, pose: walkBack },
  { p: 0.985, pose: handshake },
  { p: 1.0, pose: handshake },
];

// ── camera ──────────────────────────────────────────────────────────────────
// x is shifted so the man sits on the right and the text on the left.

export interface CamKey { p: number; pos: V3; look: V3; fov: number }
export const cameraKeys: CamKey[] = [
  // Hello: close on his face and hands (front, monitor hidden)
  { p: 0.0, pos: [0, 11.3, 27], look: [0, 11.0, 0], fov: 17 },
  { p: 0.1, pos: [0, 11.35, 27.5], look: [0, 10.95, 0], fov: 17 },
  // The Turn: orbit round to his right side, desk and monitor appear
  { p: 0.2, pos: [18, 11.8, 18], look: [0, 10.4, 4.2], fov: 24 },
  { p: 0.3, pos: [27, 11.4, 9], look: [0, 10.2, 4.4], fov: 25 },
  // Work mode: over his shoulder, looking at the screen
  { p: 0.4, pos: [13, 12.4, -9], look: [2.2, 10.9, 4.6], fov: 28 },
  { p: 0.5, pos: [10, 12.4, -11], look: [1.8, 11.1, 5.0], fov: 27 },
  { p: 0.64, pos: [6.2, 12.0, -9], look: [1.0, 11.5, 5.0], fov: 26 },
  // Enter the screen: slide past his shoulder, fill the view with the display
  { p: 0.7, pos: [2.2, 11.8, -3.2], look: [0, 11.7, 5], fov: 30 },
  { p: 0.75, pos: [0, 11.72, -1.4], look: [0, 11.72, 5], fov: 32 },
  { p: 0.8, pos: [0, 11.72, -1.4], look: [0, 11.72, 5], fov: 32 },
  // Step back: out of the screen to a side view of him working
  { p: 0.86, pos: [22, 12.4, 10], look: [0, 10.6, 3.6], fov: 26 },
  { p: 0.92, pos: [16, 12.2, 20], look: [-1.5, 11, 1.5], fov: 24 },
  // Let's talk: bookend with the opening close-up
  { p: 0.97, pos: [0, 11.35, 27.5], look: [0, 10.95, 0], fov: 17 },
  { p: 1.0, pos: [0, 11.3, 27], look: [0, 11.0, 0], fov: 17 },
];

// ── lights, screen, visibility ──────────────────────────────────────────────

export interface Mood {
  room: number; // 0..1 how much of the room (desk, chair, laptop) is visible
  screen: number; // 0..1 laptop screen glow
  lamp: number; // 0..1 warm desk lamp
  key: number; // key light intensity multiplier
  man: number; // 1 visible, 0 hidden (during the dive into the screen)
}
export const moodKeys: { p: number; mood: Mood }[] = [
  { p: 0.0, mood: { room: 0, screen: 0, lamp: 0, key: 1, man: 1 } },
  { p: 0.1, mood: { room: 0, screen: 0, lamp: 0, key: 1, man: 1 } },
  { p: 0.2, mood: { room: 1, screen: 0.2, lamp: 0, key: 1, man: 1 } },
  { p: 0.3, mood: { room: 1, screen: 0.5, lamp: 0, key: 0.9, man: 1 } },
  { p: 0.42, mood: { room: 1, screen: 1, lamp: 0, key: 0.8, man: 1 } },
  { p: 0.66, mood: { room: 1, screen: 1, lamp: 0, key: 0.75, man: 1 } },
  { p: 0.7, mood: { room: 1, screen: 1, lamp: 0, key: 0.75, man: 0 } },
  { p: 0.8, mood: { room: 1, screen: 1, lamp: 0, key: 0.75, man: 0 } },
  { p: 0.84, mood: { room: 1, screen: 1, lamp: 0, key: 0.85, man: 1 } },
  { p: 0.92, mood: { room: 1, screen: 0.7, lamp: 0, key: 0.95, man: 1 } },
  { p: 0.97, mood: { room: 0.1, screen: 0.2, lamp: 0, key: 1, man: 1 } },
  { p: 1.0, mood: { room: 0, screen: 0, lamp: 0, key: 1, man: 1 } },
];

// What the laptop screen shows, by chapter.
export type ScreenMode = "boot" | "elma" | "pendulum" | "kairos" | "glimpse" | "projects";
export const screenKeys: { p: number; mode: ScreenMode }[] = [
  { p: 0, mode: "boot" },
  { p: 0.44, mode: "elma" },
  { p: 0.52, mode: "pendulum" },
  { p: 0.58, mode: "kairos" },
  { p: 0.63, mode: "glimpse" },
  { p: 0.7, mode: "projects" },
];

// ── chapters (for the nav ticks and the DOM overlays) ───────────────────────

export const chapters = [
  { id: "hello", label: "Hello", from: 0, to: 0.12 },
  { id: "turn", label: "The Turn", from: 0.12, to: 0.3 },
  { id: "sit", label: "Sitting Down", from: 0.3, to: 0.45 },
  { id: "work", label: "Work Mode", from: 0.45, to: 0.65 },
  { id: "screen", label: "Enter the Screen", from: 0.65, to: 0.8 },
  { id: "back", label: "Step Back", from: 0.8, to: 0.92 },
  { id: "talk", label: "Let's Talk", from: 0.92, to: 1 },
] as const;

// ── sampling ────────────────────────────────────────────────────────────────

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

const bracket = <T extends { p: number }>(keys: T[], p: number): [T, T, number] => {
  if (p <= keys[0].p) return [keys[0], keys[0], 0];
  const last = keys[keys.length - 1];
  if (p >= last.p) return [last, last, 0];
  for (let i = 0; i < keys.length - 1; i++) {
    if (p >= keys[i].p && p <= keys[i + 1].p) {
      const t = (p - keys[i].p) / (keys[i + 1].p - keys[i].p || 1);
      return [keys[i], keys[i + 1], smoother(t)];
    }
  }
  return [last, last, 0];
};

export const samplePose = (p: number): Pose => {
  const [a, b, t] = bracket(poseKeys, p);
  const A = a.pose;
  const B = b.pose;
  const j = {} as Record<Joint, V3>;
  JOINTS.forEach((k) => (j[k] = lerp3(A.j[k], B.j[k], t)));
  return {
    j,
    root: lerp3(A.root, B.root, t),
    rotY: lerp(A.rotY, B.rotY, t),
    hipY: lerp(A.hipY, B.hipY, t),
    fingL: lerp(A.fingL, B.fingL, t),
    fingR: lerp(A.fingR, B.fingR, t),
    wave: lerp(A.wave, B.wave, t),
    type: lerp(A.type, B.type, t),
    walk: lerp(A.walk, B.walk, t),
    chairZ: lerp(A.chairZ, B.chairZ, t),
  };
};

export const sampleCamera = (p: number) => {
  const [a, b, t] = bracket(cameraKeys, p);
  return {
    pos: lerp3(a.pos, b.pos, t),
    look: lerp3(a.look, b.look, t),
    fov: lerp(a.fov, b.fov, t),
  };
};

export const sampleMood = (p: number): Mood => {
  const [a, b, t] = bracket(moodKeys.map((k) => ({ p: k.p, ...k.mood })), p);
  return {
    room: lerp(a.room, b.room, t),
    screen: lerp(a.screen, b.screen, t),
    lamp: lerp(a.lamp, b.lamp, t),
    key: lerp(a.key, b.key, t),
    man: lerp(a.man, b.man, t),
  };
};

export const sampleScreen = (p: number): ScreenMode => {
  let mode: ScreenMode = screenKeys[0].mode;
  for (const k of screenKeys) if (p >= k.p) mode = k.mode;
  return mode;
};

export const chapterAt = (p: number) =>
  chapters.find((c) => p >= c.from && p < c.to) ?? chapters[chapters.length - 1];

// Shared mutable progress: written by the scroll sync, read every frame by the
// stage. A plain object (not React state) so scrolling never re-renders.
export const stageState = { p: 0, target: 0 };
