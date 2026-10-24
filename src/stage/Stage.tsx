import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { palette } from "../lib/palette";
import Avatar from "./avatar/Avatar";
import { sampleCamera, sampleMood, stageState } from "./script";
import TokenField from "./TokenField";
import { pointer as worldPointer } from "./world";
import "./Stage.css";

const compactNow = () => window.innerWidth < 900;
const fireReady = () => window.dispatchEvent(new Event("hero-ready"));

// Dev helper: /?p=0.42 freezes the story at that point (used for screenshots).
const debugP = (() => {
  const v = new URLSearchParams(window.location.search).get("p");
  return v === null ? null : Math.min(1, Math.max(0, parseFloat(v)));
})();

// Smooths the scroll value, then drives camera and key lights from the script.
const Director = ({ compact }: { compact: boolean }) => {
  const { camera } = useThree();
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const frames = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const forced = (window as unknown as { __debugP?: number }).__debugP ?? debugP;
    if (forced !== undefined && forced !== null) {
      stageState.target = forced;
      stageState.p = forced;
    } else {
      stageState.p = THREE.MathUtils.damp(stageState.p, stageState.target, 5, Math.min(dt, 0.05));
    }
    const p = stageState.p;
    const dbg = (window as unknown as { __debugCam?: { pos: number[]; look: number[]; fov: number } }).__debugCam;
    const cam = dbg ? { pos: dbg.pos as [number, number, number], look: dbg.look as [number, number, number], fov: dbg.fov } : sampleCamera(p);
    // On narrow screens pull back and centre so the figure sits above the text.
    const spread = compact ? 1.85 : 1;
    camera.position.set(cam.pos[0], cam.pos[1], cam.pos[2] * spread);
    // Looking below the figure pushes him up into the top half of a phone screen.
    target.set(cam.look[0], cam.look[1] - (compact ? 3.6 : 0), cam.look[2]);
    camera.lookAt(target);
    const pc = camera as THREE.PerspectiveCamera;
    if (Math.abs(pc.fov - cam.fov) > 0.01) {
      pc.fov = cam.fov;
      pc.updateProjectionMatrix();
    }
    const mood = sampleMood(p);
    if (key.current) key.current.intensity = 1.5 * mood.key;
    if (rim.current) rim.current.intensity = 2.2 * mood.key;
    frames.current += 1;
  });

  return (
    <>
      <directionalLight ref={key} position={[-3, 6, 7]} intensity={2.4} color={palette.keyLight} />
      <directionalLight ref={rim} position={[5, 4, -4]} intensity={3} color={palette.rimLight} />
    </>
  );
};

const Stage = () => {
  const [compact] = useState(compactNow);
  const [visible, setVisible] = useState(true);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      worldPointer.px = e.clientX;
      worldPointer.py = e.clientY;
      worldPointer.nx = e.clientX / window.innerWidth - 0.5;
      worldPointer.ny = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move, { passive: true });
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="stage" aria-hidden>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, compact ? 1.4 : 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [-1.3, 4.7, 7.4], fov: 30, near: 0.1, far: 120 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.92;
        }}
      >
        <ambientLight intensity={0.16} />
        <Director compact={compact} />
        <Avatar pointer={pointer} compact={compact} onLoaded={() => setTimeout(fireReady, 600)} />
        <TokenField layer="bg" distance={40} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={9} position={[0, 5, -4]} scale={[14, 4, 1]} color={palette.keyLight} />
          <Lightformer form="rect" intensity={6} position={[-3, 2, 6]} scale={[8, 5, 1]} color="#ffffff" />
          <Lightformer form="ring" intensity={7} position={[-5, 1, 2]} scale={4} color={palette.accent} />
          <Lightformer form="rect" intensity={3} position={[6, -2, 3]} scale={[5, 7, 1]} color={palette.coolFill} />
        </Environment>
      </Canvas>
    </div>
  );
};

export default Stage;
