import { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import TokenField from "./TokenField";
import "./Stage.css";

// A second, transparent canvas ABOVE the page text. It only holds the large
// foreground tokens, so they overlap the headlines (the depth trick from the
// Soda reference). It pauses when the hero is off screen.
const Overlay = () => {
  const [on, setOn] = useState(true);

  useEffect(() => {
    const el = document.getElementById("top");
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setOn(en.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="overlay" aria-hidden>
      <Canvas
        frameloop={on ? "always" : "never"}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 0], fov: 30, near: 0.1, far: 100 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[-2, 3, 2]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[3, -1, 1]} intensity={1.2} color="#ffd6c6" />
        <TokenField layer="fg" distance={16} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={7} position={[0, 4, -4]} scale={[12, 4, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={4} position={[-4, 1, 3]} scale={[6, 5, 1]} color="#fff1ea" />
          <Lightformer form="ring" intensity={4} position={[5, -1, 2]} scale={4} color="#ffd6c6" />
        </Environment>
      </Canvas>
    </div>
  );
};

export default Overlay;
