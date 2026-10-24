import * as THREE from "three";
import { makeBeard } from "./beard";

// Dresses the original avatar: skin tones, a black formal suit, white shirt,
// red tie, mustache and beard. Every body part shares one plain material in
// the model, so each part gets its own clone to colour it.

const SKIN = "#c68660";
const SUIT = "#060608";
const TROUSERS = "#08080b";
const SHOES = "#050507";
const SHIRT = "#f4f6fa";
const TIE = "#a30f1c";
const FACIAL_HAIR = "#120d0b";

const PART_STYLES: Record<string, { color: string; roughness: number; metalness?: number }> = {
  Plane007: { color: SKIN, roughness: 0.55 }, // head (hair keeps its vertex colour)
  Ear001: { color: SKIN, roughness: 0.55 },
  Neck: { color: SKIN, roughness: 0.55 },
  Hand: { color: SKIN, roughness: 0.55 },
  BODYSHIRT: { color: SUIT, roughness: 0.78 },
  Pant: { color: TROUSERS, roughness: 0.85 },
  Shoe: { color: SHOES, roughness: 0.3, metalness: 0.1 },
  Sole: { color: "#030304", roughness: 0.7 },
};

// Front surface of the jacket at x = 0, measured from the model: [y, z].
const CHEST: [number, number][] = [
  [8.0, 0.69],
  [9.0, 0.71],
  [10.0, 0.71],
  [10.5, 0.69],
  [11.0, 0.6],
  [11.5, 0.47],
  [12.0, 0.2],
];

const chestZ = (y: number, x: number) => {
  let z = CHEST[CHEST.length - 1][1];
  if (y <= CHEST[0][0]) z = CHEST[0][1];
  for (let i = 0; i < CHEST.length - 1; i++) {
    const [y0, z0] = CHEST[i];
    const [y1, z1] = CHEST[i + 1];
    if (y >= y0 && y <= y1) z = z0 + ((y - y0) / (y1 - y0)) * (z1 - z0);
  }
  return z - x * x * 0.4;
};

const chestRibbon = (yTop: number, yBottom: number, halfWidth: (y: number) => number, lift: number, rows = 24) => {
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= rows; i++) {
    const y = yTop + ((yBottom - yTop) * i) / rows;
    const w = halfWidth(y);
    positions.push(-w, y, chestZ(y, w) + lift, w, y, chestZ(y, w) + lift);
    if (i < rows) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
};

const cloth = (color: string, roughness = 0.75) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, side: THREE.DoubleSide });

// Parks `object` (positioned in the rest pose) under a bone so it follows the animation.
const attachToBone = (root: THREE.Object3D, boneName: string, object: THREE.Object3D) => {
  const bone = root.getObjectByName(boneName);
  if (!bone) return;
  root.add(object);
  root.updateMatrixWorld(true);
  bone.attach(object);
};

const makeShirtAndTie = () => {
  const group = new THREE.Group();
  const shirt = cloth(SHIRT, 0.6);
  const tie = new THREE.MeshPhysicalMaterial({
    color: TIE,
    roughness: 0.5,
    sheen: 0.4,
    sheenColor: new THREE.Color("#ff5a5a"),
    clearcoat: 0.15,
    envMapIntensity: 0.5,
    side: THREE.DoubleSide,
  });
  const vTop = 11.75;
  const vBottom = 9.5;
  group.add(
    new THREE.Mesh(
      chestRibbon(vTop, vBottom, (y) => 0.6 * Math.max(0, (y - vBottom) / (vTop - vBottom)), 0.03),
      shirt
    )
  );
  group.add(
    new THREE.Mesh(chestRibbon(11.62, 11.25, (y) => 0.1 + 0.05 * ((11.62 - y) / 0.37), 0.07, 8), tie)
  );
  group.add(
    new THREE.Mesh(
      chestRibbon(
        11.28,
        9.0,
        (y) => (y > 9.9 ? 0.11 + 0.12 * ((11.28 - y) / 1.38) : 0.23 * Math.max(0, (y - 9.0) / 0.9)),
        0.085
      ),
      tie
    )
  );
  return group;
};

const makeCollar = () => {
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.07, 12, 32), cloth(SHIRT, 0.6));
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 11.78, -0.3);
  collar.scale.set(1, 1.05, 0.9);
  return collar;
};

const makeMustache = () => {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: FACIAL_HAIR, roughness: 0.9 });
  const lobe = new THREE.SphereGeometry(1, 20, 14);
  for (const side of [-1, 1]) {
    const half = new THREE.Mesh(lobe, material);
    half.scale.set(0.3, 0.085, 0.085);
    half.position.set(side * 0.24, 12.62, 0.97);
    half.rotation.z = side * -0.22;
    group.add(half);
  }
  const middle = new THREE.Mesh(lobe, material);
  middle.scale.set(0.11, 0.09, 0.085);
  middle.position.set(0, 12.66, 0.99);
  group.add(middle);
  return group;
};

// Furniture and monitor: graphite and brushed steel instead of the template's white.
const FURNITURE: Record<string, THREE.MeshPhysicalMaterialParameters> = {
  Plane002: { color: "#0a1114", roughness: 0.9, clearcoat: 0, envMapIntensity: 0.06 }, // desk top
  Plane003: { color: "#1a1e29", roughness: 0.6, metalness: 0.25, envMapIntensity: 0.25 }, // desk frame
  Plane: { color: "#12141b", roughness: 0.85 }, // chair
  Cube002: { color: "#232834", roughness: 0.4, metalness: 0.8 }, // chair frame
  Keyboard: { color: "#161922", roughness: 0.5, metalness: 0.3 },
  Plane017: { color: "#232733", roughness: 0.3, metalness: 0.7 }, // monitor shell
};

const styleFurniture = (root: THREE.Object3D) => {
  Object.entries(FURNITURE).forEach(([name, params]) => {
    const obj = root.getObjectByName(name) as THREE.Mesh | undefined;
    if (!obj || !obj.isMesh) return;
    obj.material = new THREE.MeshPhysicalMaterial({ ...params, side: THREE.DoubleSide });
  });
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && /^KEYS/.test(o.name)) {
      m.material = new THREE.MeshStandardMaterial({ color: "#2d3240", roughness: 0.45 });
    }
  });
};

export const styleAvatar = (character: THREE.Object3D) => {
  styleFurniture(character);
  character.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const style = PART_STYLES[child.name];
    if (!mesh.isMesh || !style) return;
    const material = (mesh.material as THREE.MeshStandardMaterial).clone();
    material.color.set(style.color);
    material.roughness = style.roughness;
    material.metalness = style.metalness ?? 0;
    material.envMapIntensity = style.color === SKIN ? 0.5 : 0.12;
    // The template's cloth has a clearcoat that turns black into brown; strip it.
    const phys = material as THREE.MeshPhysicalMaterial;
    if ("clearcoat" in phys) phys.clearcoat = 0;
    if (style.color !== SKIN) material.emissive?.set(0x000000);
    mesh.material = material;
  });

  attachToBone(character, "spine003", makeShirtAndTie());
  attachToBone(character, "spine003", makeCollar());
  attachToBone(character, "spine006", makeMustache());

  const head = character.getObjectByName("Plane007") as THREE.SkinnedMesh | undefined;
  if (head && head.isSkinnedMesh && head.parent) head.parent.add(makeBeard(head));
};
