import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { eyebrowBoneNames, typingBoneNames } from "../../data/boneData";
import { decryptFile } from "./decrypt";
import { styleAvatar } from "./styleAvatar";
import { sampleMood, sampleScreen, stageState } from "../script";
import { worldState } from "../world";
import { createScreen, type ScreenHandle } from "../ScreenTexture";

const AVATAR_URL = "/models/character.enc";
const AVATAR_KEY = "Character3D#@";

const filterClip = (clip: THREE.AnimationClip, names: string[]) =>
  new THREE.AnimationClip(
    clip.name + "_filtered",
    clip.duration,
    clip.tracks.filter((t) => names.some((n) => t.name.includes(n)))
  );

interface AvatarProps {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  compact: boolean;
  onLoaded?: () => void;
}

const Avatar = ({ pointer, compact, onLoaded }: AvatarProps) => {
  const [gltf, setGltf] = useState<GLTF | null>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const head = useRef<THREE.Object3D | null>(null);
  const screen = useRef<THREE.Mesh | null>(null);
  const brow = useRef<THREE.AnimationAction | null>(null);
  const body = useRef<THREE.Object3D | null>(null);
  const monitor = useRef<{ shell: THREE.MeshStandardMaterial | null; display: THREE.MeshBasicMaterial | null; group: THREE.Object3D | null }>({
    shell: null,
    display: null,
    group: null,
  });
  const screenFx = useRef<ScreenHandle | null>(null);
  const glow = useRef<THREE.PointLight>(null);

  useEffect(() => {
    let cancelled = false;
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    decryptFile(AVATAR_URL, AVATAR_KEY)
      .then(
        (buf) =>
          new Promise<GLTF>((resolve, reject) => loader.parse(buf, "", resolve, reject))
      )
      .then((g) => {
        if (cancelled) return;
        g.scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
          }
        });
        styleAvatar(g.scene);
        head.current = g.scene.getObjectByName("spine006") ?? null;
        screen.current = (g.scene.getObjectByName("screenlight") as THREE.Mesh) ?? null;
        body.current = g.scene.getObjectByName("metarig002") ?? null;

        // Monitor: fade the shell in, and paint the live screen on the display plane.
        const group = g.scene.getObjectByName("Plane004") ?? null;
        const shellMesh = g.scene.getObjectByName("Plane017") as THREE.Mesh | undefined;
        const displayMesh = g.scene.getObjectByName("Plane017_1") as THREE.Mesh | undefined;
        if (shellMesh) {
          const mat = (shellMesh.material as THREE.MeshStandardMaterial).clone();
          mat.transparent = true;
          shellMesh.material = mat;
          monitor.current.shell = mat;
        }
        if (displayMesh) {
          // Map the whole texture onto the display (the model's own UVs only cover a sliver).
          const geo = displayMesh.geometry;
          geo.computeBoundingBox();
          const bb = geo.boundingBox!;
          const pos = geo.attributes.position as THREE.BufferAttribute;
          const uv = new Float32Array(pos.count * 2);
          for (let i = 0; i < pos.count; i++) {
            uv[i * 2] = (bb.max.x - pos.getX(i)) / (bb.max.x - bb.min.x); // viewed from the man's side
            uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y);
          }
          geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
          const fx = createScreen();
          screenFx.current = fx;
          const mat = new THREE.MeshBasicMaterial({ map: fx.texture, toneMapped: false, transparent: true, side: THREE.DoubleSide });
          displayMesh.material = mat;
          monitor.current.display = mat;
        }
        monitor.current.group = group;

        const m = new THREE.AnimationMixer(g.scene);
        mixer.current = m;
        // He starts slumped over the desk (frame 0 of the intro) and wakes up
        // when the loader curtain opens.
        const intro = THREE.AnimationClip.findByName(g.animations, "introAnimation");
        const introAction = intro ? m.clipAction(intro) : null;
        if (introAction) {
          introAction.setLoop(THREE.LoopOnce, 1);
          introAction.clampWhenFinished = true;
          introAction.play();
          introAction.paused = true;
          introAction.time = 0;
          m.update(0);
        }
        const start = () => {
          if (introAction) {
            introAction.paused = false;
            introAction.reset().play();
          }
          ["key1", "key2", "key5", "key6"].forEach((name) => {
            const c = THREE.AnimationClip.findByName(g.animations, name);
            if (c) {
              const a = m.clipAction(c);
              a.timeScale = 1.2;
              a.play();
            }
          });
          const typing = THREE.AnimationClip.findByName(g.animations, "typing");
          if (typing) {
            const a = m.clipAction(filterClip(typing, typingBoneNames));
            a.timeScale = 1.2;
            a.play();
          }
          const blink = THREE.AnimationClip.findByName(g.animations, "Blink");
          if (blink) m.clipAction(blink).play();
        };
        if (!document.body.classList.contains("is-locked")) start();
        else window.addEventListener("site-ready", start, { once: true });
        const up = THREE.AnimationClip.findByName(g.animations, "browup");
        if (up) {
          const a = m.clipAction(filterClip(up, eyebrowBoneNames));
          a.setLoop(THREE.LoopOnce, 1);
          a.clampWhenFinished = true;
          brow.current = a;
        }
        if (import.meta.env.DEV) (window as unknown as { __avatar?: unknown }).__avatar = { mixer: m, clips: g.animations, root: g.scene };
        const raiseBrow = () => {
          const a = brow.current;
          if (a) a.reset().fadeIn(0.25).play();
        };
        window.addEventListener("world-swap", raiseBrow);
        (g.scene.userData as { cleanup?: () => void }).cleanup = () => window.removeEventListener("world-swap", raiseBrow);
        setGltf(g);
        onLoaded?.();
      })
      .catch((e) => console.error("Avatar failed to load", e));
    return () => {
      cancelled = true;
      draco.dispose();
    };
  }, [onLoaded]);

  const look = useRef({ x: 0, y: 0 });
  useFrame(({ clock }, dt) => {
    if (!gltf) return;
    mixer.current?.update(dt);
    const p = stageState.p;
    const mood = sampleMood(p);
    // Head follows the cursor in the close-up chapters only.
    const k = compact ? 0 : THREE.MathUtils.clamp(1 - Math.max(0, p - 0.12) / 0.1, 0, 1);
    look.current.x = THREE.MathUtils.damp(look.current.x, pointer.current.x * k, 5, dt);
    look.current.y = THREE.MathUtils.damp(look.current.y, pointer.current.y * k, 5, dt);
    const h = head.current;
    if (h && k > 0.001) {
      const max = Math.PI / 6;
      h.rotation.y = look.current.x * max;
      h.rotation.x = -look.current.y * 0.6 - 0.2 * k;
    }
    // Eyebrow raise on the first few cursor moves.
    if (brow.current && k > 0.5 && Math.abs(pointer.current.y) > 0.6 && !brow.current.isRunning()) {
      brow.current.reset().fadeIn(0.4).play();
    }
    // Whole scene tilts toward the pointer in the hero (Soda's can tilt) and
    // swings during a world switch.
    const heroK = THREE.MathUtils.clamp(1 - (p - 0.04) / 0.08, 0, 1);
    const root = gltf.scene;
    const tiltY = compact ? 0 : pointer.current.x * 0.42 * heroK;
    const tiltX = compact ? 0 : -pointer.current.y * 0.05 * heroK;
    root.rotation.y = THREE.MathUtils.damp(root.rotation.y, tiltY + worldState.swing * 0.9 * (p < 0.3 ? 1 : 0), 4, dt);
    root.rotation.x = THREE.MathUtils.damp(root.rotation.x, tiltX, 4, dt);

    // Monitor and screen follow the story.
    const m = monitor.current;
    if (m.group) m.group.visible = mood.room > 0.01;
    if (m.shell) m.shell.opacity = mood.room;
    if (m.display) {
      m.display.opacity = mood.room;
      m.display.color.setScalar(0.35 + 0.65 * mood.screen);
    }
    if (screenFx.current && mood.room > 0.01) screenFx.current.update(sampleScreen(p), clock.elapsedTime);
    if (screen.current) {
      const mat = screen.current.material as THREE.MeshStandardMaterial;
      mat.transparent = true;
      mat.opacity = 0.18 * mood.screen * (p > 0.68 && p < 0.84 ? 0 : 1);
    }
    if (body.current) body.current.visible = mood.man > 0.02;
    if (glow.current) glow.current.intensity = mood.screen * 55;
  });

  return gltf ? (
    <>
      <primitive object={gltf.scene} />
      <pointLight ref={glow} position={[0, 11.7, 2.4]} color="#8fa8ff" distance={16} decay={1.6} intensity={0} />
    </>
  ) : null;
};

export default Avatar;
