import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { BG_SLOTS, BG_SLOTS_MOBILE, FG_SLOTS, FG_SLOTS_MOBILE, Slot } from "./tokens";
import { buildProp, type Prop } from "./props3d";
import { pointer, worldState, worlds } from "./world";
import { stageState } from "./script";

// Tokens live in "screen space": each is placed by pixel position on the page
// (like the Soda page's CSS-positioned berries) and projected into the 3D
// scene at a fixed distance in front of the camera, so they always land where
// designed whatever the camera is doing, yet still get real lighting,
// real rotation and (for the far layer) real occlusion by the avatar.

const PARALLAX = { fg: 60, bg: -30 } as const;
const FLOAT_DUR = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10];
const REPEL_RADIUS = 400;
const REPEL_STRENGTH = 80;

interface State {
  rx: number;
  ry: number;
  angle: number;
  dx: number;
  dy: number;
  id: string;
}

const rand = () => (Math.random() - 0.5) * 200;

/** 1 in the hero, fading out as the story moves on. */
const visibility = (p: number) => THREE.MathUtils.clamp(1 - (p - 0.035) / 0.05, 0, 1);

interface Props {
  layer: "fg" | "bg";
  distance: number;
}

const TokenField = ({ layer, distance }: Props) => {
  const { camera, size } = useThree();
  const phone = size.width < 900;
  const slots: Slot[] = layer === "fg" ? (phone ? FG_SLOTS_MOBILE : FG_SLOTS) : phone ? BG_SLOTS_MOBILE : BG_SLOTS;
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<(THREE.Object3D | null)[]>([]);
  // For each slot, every prop it can show across the three worlds.
  const props = useMemo(
    () =>
      slots.map((_s, i) => {
        const map = new Map<string, Prop>();
        Object.values(worlds).forEach((w) => {
          const id = (layer === "fg" ? w.fg : w.bg)[i];
          if (id && !map.has(id)) map.set(id, buildProp(id));
        });
        return map;
      }),
    [slots, layer]
  );
  const mouse = useRef({ x: 0, y: 0 });
  const seen = useRef({ id: "", seed: -1 });
  const states = useMemo<State[]>(
    () =>
      slots.map(() => ({ rx: 0, ry: 0, angle: 0, dx: 0, dy: 0, id: "" })),
    [slots]
  );
  const v = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);

  useEffect(() => {
    // Tokens start collapsed in the centre and explode out on load.
    worldState.collapse = 1;
    const t = setTimeout(() => {
      const start = performance.now();
      const run = () => {
        const k = Math.min(1, (performance.now() - start) / 1100);
        worldState.collapse = 1 - (1 - Math.pow(1 - k, 3));
        if (k < 1 && !worldState.switching) requestAnimationFrame(run);
        else if (!worldState.switching) worldState.collapse = 0;
      };
      run();
    }, 200);
    return () => clearTimeout(t);
  }, []);

  useFrame(({ clock }) => {
    const pc = camera as THREE.PerspectiveCamera;
    const H = size.height;
    const W = size.width;
    const upp = (d: number) => (2 * d * Math.tan(THREE.MathUtils.degToRad(pc.fov) / 2)) / H;
    const t = clock.elapsedTime;
    const scale = THREE.MathUtils.clamp(W / 1440, 0.55, 1.25);
    const vis = visibility(stageState.p);

    // Smoothed pointer for the parallax containers (lerp 0.05, as Soda).
    mouse.current.x += (pointer.nx - mouse.current.x) * 0.05;
    mouse.current.y += (pointer.ny - mouse.current.y) * 0.05;

    const world = worlds[worldState.id];
    const ids = layer === "fg" ? world.fg : world.bg;
    const reseed = seen.current.seed !== worldState.seed;
    seen.current.seed = worldState.seed;

    slots.forEach((slot, i) => {
      const m = mesh.current[i] as THREE.Group | null;
      const s = states[i];
      if (!m) return;

      // New world: show this slot's prop for it, and pick fresh resting offsets.
      const id = ids[i];
      if (s.id !== id) {
        s.id = id;
        props[i].forEach((p, pid) => (p.group.visible = pid === id));
      }
      if (reseed) {
        s.dx = rand() * scale;
        s.dy = rand() * scale;
        s.rx = 0;
        s.ry = 0;
      }

      const sizePx = slot.size * scale;
      let x = (slot.left / 100) * W + s.dx + mouse.current.x * PARALLAX[layer];
      let y = (slot.top / 100) * H + s.dy + mouse.current.y * -PARALLAX[layer];

      // Repulsion from the pointer.
      const diffX = pointer.px - x;
      const diffY = pointer.py - y;
      const dist = Math.hypot(diffX, diffY) || 1;
      let tx = 0;
      let ty = 0;
      let speed = 1;
      if (dist < REPEL_RADIUS && !worldState.switching) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        tx = (diffX / dist) * force * -REPEL_STRENGTH;
        ty = (diffY / dist) * force * -REPEL_STRENGTH;
        speed = 1 + force * 5;
      }
      s.rx += (tx - s.rx) * 0.1;
      s.ry += (ty - s.ry) * 0.1;
      s.angle += (tx * 0.9 - s.angle) * 0.08; // twist from the push, eases back
      void speed;

      // Float.
      const phase = (t + i * 0.7) * ((Math.PI * 2) / FLOAT_DUR[(i + (layer === "bg" ? 6 : 0)) % 9]);
      const floatY = Math.sin(phase) * 15;
      const floatA = Math.cos(phase) * 6;

      x += s.rx;
      y += s.ry + floatY;

      // Implode toward / explode from the centre while the world switches.
      const c = worldState.collapse;
      x += (W / 2 - x) * c;
      y += (H / 2 - y) * c;

      const k = upp(distance);
      v.set((x - W / 2) * k, -(y - H / 2) * k, -distance).applyQuaternion(camera.quaternion).add(camera.position);
      m.position.copy(v);

      const sc = sizePx * k * (1 - 0.9 * c) * vis;
      m.scale.setScalar(Math.max(sc, 0.0001));
      m.visible = vis > 0.01 && c < 0.995;

      const sway = Math.sin((t + i * 1.3) * 0.6) * 40;
      e.set(THREE.MathUtils.degToRad(14 + floatA * 0.8 + s.ry * 0.3), THREE.MathUtils.degToRad(-20 + sway + s.angle), THREE.MathUtils.degToRad(floatA * 0.5));
      q.setFromEuler(e);
      m.quaternion.copy(camera.quaternion).multiply(q);

      const o = (slot.opacity ?? 1) * (1 - c) * vis;
      props[i].get(s.id)?.mats.forEach((mm) => (mm.opacity = o));
    });
  });

  return (
    <group ref={group}>
      {slots.map((_slot, i) => (
        <group key={i} ref={(g) => (mesh.current[i] = g)}>
          {[...props[i].values()].map((p, k) => (
            <primitive key={k} object={p.group} />
          ))}
        </group>
      ))}
    </group>
  );
};

export default TokenField;
