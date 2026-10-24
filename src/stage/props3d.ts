import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// The floating props: chunky, glossy 3D icons built from primitives (no
// licensed logos, no flat tiles). Each is normalised to fit a unit box.

const C = {
  cream: "#fff1e6",
  sky: "#5fc3ff",
  skyDeep: "#2f8fe0",
  lilac: "#a98bff",
  indigo: "#23195f",
  coral: "#ff6f6f",
  amber: "#ffc23d",
  mint: "#5eead4",
  teal: "#13b3a3",
  ink: "#101923",
  orange: "#ff8a4c",
  paper: "#f6f1e8",
  react: "#61dafb",
};

const mat = (color: string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.26,
    metalness: 0.02,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transparent: true,
    ...o,
  });

const add = (g: THREE.Group, geo: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number] = [0, 0, 0], rot: [number, number, number] = [0, 0, 0], scl: [number, number, number] = [1, 1, 1]) => {
  const mesh = new THREE.Mesh(geo, m);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  mesh.scale.set(...scl);
  g.add(mesh);
  return mesh;
};

const rbox = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(w, h, d, 5, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
const ball = (r: number) => new THREE.SphereGeometry(r, 32, 24);

/** A capsule between two points in the XY plane: the "inflated line" look. */
const bar = (g: THREE.Group, a: [number, number], b: [number, number], r: number, m: THREE.Material, z = 0) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const geo = new THREE.CapsuleGeometry(r, len, 8, 16);
  add(g, geo, m, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z], [0, 0, Math.atan2(dy, dx) - Math.PI / 2]);
};

const poly = (g: THREE.Group, pts: [number, number][], r: number, m: THREE.Material, z = 0) => {
  for (let i = 0; i < pts.length - 1; i++) bar(g, pts[i], pts[i + 1], r, m, z);
  pts.forEach((p) => add(g, ball(r), m, [p[0], p[1], z]));
};

type Builder = (g: THREE.Group) => void;

const builders: Record<string, Builder> = {
  // Bedrock / AWS
  cloud: (g) => {
    const m = mat(C.cream);
    add(g, ball(0.24), m, [-0.27, -0.04, 0]);
    add(g, ball(0.32), m, [0, 0.1, 0]);
    add(g, ball(0.25), m, [0.28, -0.02, 0]);
    add(g, rbox(0.86, 0.28, 0.5, 0.14), m, [0, -0.13, 0]);
  },
  // pgvector / Postgres
  database: (g) => {
    const m = mat(C.sky);
    const band = mat(C.skyDeep);
    const dot = mat(C.cream);
    for (let i = 0; i < 3; i++) {
      const y = (i - 1) * 0.28;
      add(g, new THREE.CylinderGeometry(0.4, 0.4, 0.22, 48), m, [0, y, 0]);
      add(g, new THREE.TorusGeometry(0.4, 0.028, 16, 64), band, [0, y + 0.11, 0], [Math.PI / 2, 0, 0]);
      add(g, ball(0.035), dot, [0.22, y, 0.39]);
    }
  },
  // GPU / model
  chip: (g) => {
    const body = mat(C.lilac);
    const core = mat(C.indigo, { clearcoat: 0.5 });
    const pin = mat("#dfe6f2", { metalness: 0.9, roughness: 0.2 });
    add(g, rbox(0.74, 0.74, 0.16, 0.1), body);
    add(g, rbox(0.4, 0.4, 0.2, 0.06), core, [0, 0, 0.03]);
    for (let i = 0; i < 5; i++) {
      const t = (i - 2) * 0.14;
      add(g, rbox(0.07, 0.14, 0.08, 0.03), pin, [t, 0.42, 0]);
      add(g, rbox(0.07, 0.14, 0.08, 0.03), pin, [t, -0.42, 0]);
      add(g, rbox(0.14, 0.07, 0.08, 0.03), pin, [0.42, t, 0]);
      add(g, rbox(0.14, 0.07, 0.08, 0.03), pin, [-0.42, t, 0]);
    }
  },
  // LangChain / MCP / LangGraph
  neural: (g) => {
    const node = mat(C.coral);
    const link = mat(C.cream, { clearcoat: 0.6 });
    add(g, ball(0.17), node);
    const outer: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.3;
      outer.push([Math.cos(a) * 0.4, Math.sin(a) * 0.4]);
    }
    outer.forEach((p, i) => {
      add(g, ball(0.1), node, [p[0], p[1], (i % 2 ? 0.08 : -0.08)]);
      bar(g, [0, 0], p, 0.02, link);
    });
    bar(g, outer[0], outer[2], 0.015, link);
    bar(g, outer[1], outer[3], 0.015, link);
  },
  // FastAPI
  bolt: (g) => {
    const m = mat(C.amber);
    poly(g, [[0.14, 0.46], [-0.16, 0.02], [0.08, 0.02], [-0.14, -0.46]], 0.08, m);
  },
  // ELMA / GPT
  chat: (g) => {
    const m = mat(C.mint);
    const dot = mat("#ffffff");
    add(g, rbox(0.92, 0.62, 0.24, 0.17), m, [0, 0.08, 0]);
    add(g, rbox(0.2, 0.2, 0.2, 0.05), m, [-0.28, -0.28, 0], [0, 0, Math.PI / 4]);
    [-0.2, 0, 0.2].forEach((x) => add(g, ball(0.06), dot, [x, 0.08, 0.13]));
  },
  // OCR / document automation
  document: (g) => {
    const page = mat(C.paper);
    const line = mat(C.teal);
    add(g, rbox(0.62, 0.82, 0.1, 0.05), page);
    [0.24, 0.1, -0.04].forEach((y) => add(g, rbox(0.4, 0.05, 0.05, 0.02), line, [0, y, 0.06]));
    add(g, rbox(0.22, 0.05, 0.05, 0.02), line, [-0.09, -0.18, 0.06]);
    add(g, rbox(0.14, 0.14, 0.05, 0.04), mat(C.coral), [0.17, 0.3, 0.06]);
  },
  // OpenCV
  eye: (g) => {
    add(g, new THREE.TorusGeometry(0.34, 0.08, 24, 64), mat(C.cream));
    add(g, ball(0.28), mat("#18255c"), [0, 0, -0.02], [0, 0, 0], [1, 1, 0.55]);
    add(g, new THREE.TorusGeometry(0.15, 0.035, 16, 48), mat(C.mint), [0, 0, 0.1]);
    add(g, ball(0.09), mat("#050814"), [0, 0, 0.1]);
    add(g, ball(0.045), mat("#ffffff", { clearcoat: 0 }), [0.09, 0.1, 0.17]);
  },
  // automation
  gear: (g) => {
    const m = mat(C.orange);
    const hole = mat(C.ink);
    add(g, new THREE.CylinderGeometry(0.31, 0.31, 0.22, 48), m, [0, 0, 0], [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      add(g, rbox(0.17, 0.2, 0.22, 0.04), m, [Math.cos(a) * 0.37, Math.sin(a) * 0.37, 0], [0, 0, a]);
    }
    add(g, new THREE.CylinderGeometry(0.12, 0.12, 0.24, 32), hole, [0, 0, 0], [Math.PI / 2, 0, 0]);
  },
  // React
  react: (g) => {
    const m = mat(C.react, { emissive: C.react, emissiveIntensity: 0.25, clearcoat: 0.5 });
    for (let i = 0; i < 3; i++) {
      add(g, new THREE.TorusGeometry(0.44, 0.032, 16, 80), m, [0, 0, 0], [0, 0, (i * Math.PI) / 3], [1, 0.4, 1]);
    }
    add(g, ball(0.09), m);
  },
  // code
  brackets: (g) => {
    const m = mat(C.cream);
    const slash = mat(C.coral);
    poly(g, [[-0.2, 0.3], [-0.5, 0], [-0.2, -0.3]], 0.075, m);
    poly(g, [[0.2, 0.3], [0.5, 0], [0.2, -0.3]], 0.075, m);
    bar(g, [0.09, 0.38], [-0.09, -0.38], 0.07, slash, 0.02);
  },
  // terminal
  terminal: (g) => {
    const body = mat("#16202c");
    const head = mat("#26354a");
    const prompt = mat(C.mint, { emissive: C.mint, emissiveIntensity: 0.3 });
    add(g, rbox(0.94, 0.68, 0.16, 0.1), body);
    add(g, rbox(0.94, 0.15, 0.18, 0.06), head, [0, 0.27, 0]);
    ["#ff6b6b", "#ffd166", "#6ee7b7"].forEach((c, i) => add(g, ball(0.03), mat(c), [-0.38 + i * 0.09, 0.27, 0.1]));
    poly(g, [[-0.28, 0.06], [-0.16, -0.04], [-0.28, -0.14]], 0.035, prompt, 0.1);
    bar(g, [-0.06, -0.14], [0.14, -0.14], 0.035, prompt, 0.1);
  },
  // Verity: safety
  shield: (g) => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.5);
    s.lineTo(0.38, 0.38);
    s.lineTo(0.38, 0.02);
    s.quadraticCurveTo(0.38, -0.3, 0, -0.5);
    s.quadraticCurveTo(-0.38, -0.3, -0.38, 0.02);
    s.lineTo(-0.38, 0.38);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 6, curveSegments: 24 });
    geo.translate(0, 0, -0.07);
    add(g, geo, mat(C.lilac));
    poly(g, [[-0.15, 0.0], [-0.04, -0.13], [0.17, 0.13]], 0.05, mat("#ffffff"), 0.13);
  },
};

export const propIds = Object.keys(builders);

export interface Prop {
  group: THREE.Group;
  mats: THREE.Material[];
}

export const buildProp = (id: string): Prop => {
  const group = new THREE.Group();
  (builders[id] ?? builders.cloud)(group);
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const k = 1 / Math.max(size.x, size.y, size.z);
  const wrap = new THREE.Group();
  group.position.sub(center);
  wrap.add(group);
  wrap.scale.setScalar(k);
  const outer = new THREE.Group();
  outer.add(wrap);
  const mats: THREE.Material[] = [];
  outer.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | undefined;
    if (m && !mats.includes(m)) mats.push(m);
  });
  return { group: outer, mats };
};

/** Renders a prop to a transparent PNG (for the world cards). */
const pngCache = new Map<string, string>();
export const propPNG = (id: string, px = 256): string => {
  const hit = pngCache.get(id);
  if (hit) return hit;
  const r = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1);
  r.setSize(px, px);
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(r);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const { group } = buildProp(id);
  group.rotation.set(0.25, -0.55, 0);
  scene.add(group);
  const key = new THREE.DirectionalLight("#ffffff", 2.2);
  key.position.set(2, 3, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#bfeaff", 1.4);
  rim.position.set(-3, 1, -2);
  scene.add(rim);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  cam.position.set(0, 0, 3.1);
  r.render(scene, cam);
  const url = r.domElement.toDataURL("image/png");
  pm.dispose();
  r.dispose();
  r.forceContextLoss();
  pngCache.set(id, url);
  return url;
};
