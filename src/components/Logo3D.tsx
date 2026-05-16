"use client";

import { useRef, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function createDisplacedGeometry(
  texture: THREE.Texture,
  segments: number,
  depth: number
): THREE.BufferGeometry | null {
  const img = texture.image as HTMLImageElement | undefined;
  if (!img || !img.width || !img.height) return null;

  const w = img.width;
  const h = img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;

  const geo = new THREE.PlaneGeometry(2, 2, segments, segments);
  const pos = geo.attributes.position.array as Float32Array;
  const uvs = geo.attributes.uv.array as Float32Array;
  const count = pos.length / 3;

  for (let i = 0; i < count; i++) {
    const u = uvs[i * 2];
    const v = uvs[i * 2 + 1];
    const px = Math.round(u * (w - 1));
    const py = Math.round((1 - v) * (h - 1));
    const cx = Math.max(0, Math.min(w - 1, px));
    const cy = Math.max(0, Math.min(h - 1, py));
    const alpha = data[(cy * w + cx) * 4 + 3] / 255;
    pos[i * 3 + 2] = alpha * depth - depth / 2;
  }

  geo.attributes.position.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function LogoMesh({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture("/images/Semadotdev-logo.png");
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(0);
  const rotSpeedRef = useRef(0);
  const timeRef = useRef(0);
  const spinBoost = useRef(1);

  const entranceDone = useRef(false);
  const entranceTimer = useRef(0);

  const displacedGeo = useMemo(
    () => createDisplacedGeometry(texture, 200, 0.3),
    [texture]
  );

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        metalness: 0.1,
        roughness: 0.3,
        alphaTest: 0.01,
      }),
    [texture]
  );

  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        color: "#3b82f6",
        emissive: "#3b82f6",
        emissiveIntensity: 2.0,
        opacity: 0.35,
        alphaTest: 0.01,
        depthWrite: false,
      }),
    [texture]
  );

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      spinBoost.current = 5;
      onClick();
    },
    [onClick]
  );

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    const decay = Math.pow(0.97, delta * 60);
    spinBoost.current = 1 + (spinBoost.current - 1) * decay;

    // ---- DRAMATIC ENTRANCE: falling star ----
    if (!entranceDone.current) {
      entranceTimer.current += delta;
      const et = entranceTimer.current;
      const duration = 1.3;
      const progress = Math.min(1, et / duration);

      const yProgress = Math.min(1, et / 0.7);
      const yEased = 1 - Math.pow(1 - yProgress, 3);
      const y = 2.2 * (1 - yEased);

      let scaleVal: number;
      if (progress < 0.6) {
        const sp = Math.min(1, et / 0.5);
        const se = 1 - Math.pow(1 - sp, 2);
        scaleVal = se * 1.18;
      } else {
        const sp = (progress - 0.6) / 0.4;
        const se = 1 - Math.pow(1 - sp, 3);
        scaleVal = 1.18 - 0.18 * se;
      }

      const spinCurve = 1 - Math.pow(1 - progress, 2);
      rotSpeedRef.current = (1 - spinCurve) * 0.5 + spinCurve * 0.006;

      if (groupRef.current) {
        groupRef.current.position.y = y;
      }
      if (meshRef.current) {
        meshRef.current.scale.setScalar(Math.max(0.01, scaleVal));
        meshRef.current.rotation.y +=
          rotSpeedRef.current * spinBoost.current * delta * 60;
      }
      if (glowRef.current && meshRef.current) {
        glowRef.current.rotation.copy(meshRef.current.rotation);
        glowRef.current.scale.setScalar(meshRef.current.scale.x * 1.03);
      }

      if (progress >= 1) {
        entranceDone.current = true;
        scaleRef.current = 1;
        rotSpeedRef.current = 0.006;
        if (groupRef.current) groupRef.current.position.y = 0;
        if (meshRef.current) meshRef.current.scale.setScalar(1);
      }
      return;
    }

    // ---- IDLE ANIMATION ----
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.08;
    }

    if (meshRef.current) {
      const mesh = meshRef.current;

      const target = hovered ? 0.03 : 0.006;
      rotSpeedRef.current +=
        (target - rotSpeedRef.current) * delta * 3;

      mesh.rotation.y +=
        rotSpeedRef.current * spinBoost.current * delta * 60;

      const tiltX = state.pointer.y * 0.12;
      const tiltZ = -state.pointer.x * 0.08;
      mesh.rotation.x += (tiltX - mesh.rotation.x) * delta * 5;
      mesh.rotation.z += (tiltZ - mesh.rotation.z) * delta * 5;

      const breath = 1 + Math.sin(t * 0.8) * 0.008;
      mesh.scale.setScalar(breath * (hovered ? 1.08 : 1));
    }

    if (glowRef.current && meshRef.current) {
      glowRef.current.rotation.copy(meshRef.current.rotation);
      const s = meshRef.current.scale.x;
      glowRef.current.scale.setScalar(s * 1.03);
    }
  });

  return (
    <group ref={groupRef}>
      {displacedGeo && (
        <mesh
          ref={glowRef}
          geometry={displacedGeo}
          material={glowMat}
          position={[0, 0, -0.05]}
          scale={1.03}
          renderOrder={1}
        />
      )}
      {displacedGeo ? (
        <mesh
          ref={meshRef}
          geometry={displacedGeo}
          material={material}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      ) : (
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[1.6, 1.6]} />
          <meshStandardMaterial
            map={texture}
            alphaTest={0.01}
          />
        </mesh>
      )}
    </group>
  );
}

export default function Logo3D({ onClick }: { onClick: () => void }) {
  return (
    <div className="w-24 h-24 mx-auto cursor-pointer relative z-10">
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={0.8} />
        <directionalLight
          position={[-2, -3, 1]}
          intensity={0.5}
          color="#818cf8"
        />
        <LogoMesh onClick={onClick} />
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.2}
          scale={3}
          blur={2.5}
        />
        <Sparkles
          count={20}
          scale={3}
          size={0.02}
          speed={0.3}
          color="#3b82f6"
          opacity={0.3}
        />
      </Canvas>
    </div>
  );
}
