import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { skillBalls } from "../data/content";
import { Reveal, SplitReveal } from "./motion/Reveal";
import { palette } from "../lib/palette";
import "./styles/TechStack.css";

const sphereGeometry = new THREE.SphereGeometry(1, 40, 40);

// Gunmetal ball with an accent ring and the skill name, drawn on a canvas.
const makeLabelTexture = (label: string) => {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const bg = g.createRadialGradient(size * 0.4, size * 0.35, 20, size / 2, size / 2, size * 0.75);
  bg.addColorStop(0, palette.ballTop);
  bg.addColorStop(1, palette.ballBottom);
  g.fillStyle = bg;
  g.fillRect(0, 0, size, size);
  g.strokeStyle = palette.accent;
  g.lineWidth = 7;
  g.globalAlpha = 0.9;
  g.beginPath();
  g.arc(size / 2, size / 2, size * 0.34, 0, Math.PI * 2);
  g.stroke();
  g.globalAlpha = 1;
  g.fillStyle = palette.ink;
  g.textAlign = "center";
  g.textBaseline = "middle";
  let fontSize = 74;
  g.font = `italic 400 ${fontSize}px "Instrument Serif", Georgia, serif`;
  while (g.measureText(label).width > size * 0.54 && fontSize > 30) {
    fontSize -= 4;
    g.font = `italic 400 ${fontSize}px "Instrument Serif", Georgia, serif`;
  }
  g.fillText(label, size / 2, size / 2 + 4);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
};

type BallProps = {
  scale: number;
  material: THREE.Material;
  position: [number, number, number];
  active: boolean;
};

const Ball = ({ scale, material, position, active }: BallProps) => {
  const api = useRef<RapierRigidBody | null>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);

  // Gentle pull toward the centre so the cluster stays together.
  useFrame((_s, delta) => {
    if (!active || !api.current) return;
    const d = Math.min(0.1, delta);
    vec
      .copy(api.current.translation())
      .normalize()
      .multiplyScalar(-90 * d * scale);
    api.current.applyImpulse(vec, true);
  });

  return (
    <RigidBody
      ref={api}
      colliders={false}
      position={position}
      linearDamping={0.8}
      angularDamping={0.2}
      friction={0.2}
    >
      <BallCollider args={[scale]} />
      <mesh scale={scale} geometry={sphereGeometry} material={material} rotation={[0.3, 1, 0.4]} />
    </RigidBody>
  );
};

const Pointer = ({ active }: { active: boolean }) => {
  const ref = useRef<RapierRigidBody>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ pointer, viewport }) => {
    if (!active) return;
    vec.lerp(
      new THREE.Vector3((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0),
      0.2
    );
    ref.current?.setNextKinematicTranslation(vec);
  });
  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} position={[100, 100, 100]}>
      <BallCollider args={[2.2]} />
    </RigidBody>
  );
};

const Pit = ({ active }: { active: boolean }) => {
  const [materials, setMaterials] = useState<THREE.MeshPhysicalMaterial[]>([]);

  useEffect(() => {
    let cancelled = false;
    const build = () => {
      if (cancelled) return;
      setMaterials(
        skillBalls.map((label) => {
          const map = makeLabelTexture(label);
          return new THREE.MeshPhysicalMaterial({
            map,
            roughness: 0.35,
            metalness: 0.35,
            clearcoat: 0.6,
            clearcoatRoughness: 0.2,
            envMapIntensity: 0.9,
          });
        })
      );
    };
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts) fonts.ready.then(build);
    else build();
    return () => {
      cancelled = true;
    };
  }, []);

  const balls = useMemo(
    () =>
      [...Array(26)].map((_, i) => ({
        scale: [0.8, 1, 0.9, 1.1, 1][Math.floor(Math.random() * 5)],
        position: [
          THREE.MathUtils.randFloatSpread(18),
          THREE.MathUtils.randFloatSpread(18) - 22,
          THREE.MathUtils.randFloatSpread(8) - 4,
        ] as [number, number, number],
        label: i % skillBalls.length,
      })),
    []
  );

  if (!materials.length) return null;
  return (
    <Physics gravity={[0, 0, 0]}>
      <Pointer active={active} />
      {balls.map((b, i) => (
        <Ball
          key={i}
          scale={b.scale}
          position={b.position}
          material={materials[b.label]}
          active={active}
        />
      ))}
    </Physics>
  );
};

const TechStack = () => {
  const wrapper = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [desktop, setDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth > 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="stack" className="techstack" ref={wrapper} aria-label="Tech stack">
      <div className="techstack-copy wrap">
        <Reveal>
          <span className="eyebrow">Stack</span>
        </Reveal>
        <SplitReveal
          as="h2"
          className="display techstack-title"
          text="Tools I *reach* for."
        />
        {desktop && (
          <Reveal delay={0.2}>
            <p className="techstack-hint">Move your cursor through them.</p>
          </Reveal>
        )}
      </div>

      {desktop ? (
        <Canvas
          className="techstack-canvas"
          frameloop={active ? "always" : "never"}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 22], fov: 32.5, near: 1, far: 100 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[8, 10, 12]} intensity={2.2} color={palette.keyLight} />
          <Pit active={active} />
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={4} position={[0, 6, 6]} scale={[14, 5, 1]} color={palette.keyLight} />
            <Lightformer form="ring" intensity={3} position={[-6, 0, 4]} scale={5} color={palette.accent} />
            <Lightformer form="rect" intensity={2} position={[6, -3, 4]} scale={[6, 6, 1]} color="#ffffff" />
          </Environment>
        </Canvas>
      ) : (
        <ul className="chips techstack-chips wrap">
          {skillBalls.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TechStack;
