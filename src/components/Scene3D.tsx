"use client";
import React, { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3, Group, Object3D } from "three";
import * as THREE from "three";

// ─── 粒子集群 ─────────────────────────────────
function ParticleCloud({ count = 1500, isDark = true }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3 + Math.random() * 6;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.04;
    pointsRef.current.rotation.x += delta * 0.015;
    const t = state.clock.getElapsedTime();
    const s = 1 + Math.sin(t * 0.4) * 0.015;
    pointsRef.current.scale.set(s, s, s);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={isDark ? "#ffffff" : "#111111"}
        transparent
        opacity={isDark ? 0.5 : 0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── 漂浮碎片 (InstancedMesh) ──────────────────
function FloatingShards({ isDark = true }) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 80;
  const dummy = useMemo(() => new Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      t: Math.random() * 100,
      factor: 0.5 + Math.random() * 1.5,
      speed: 0.03 + Math.random() * 0.06,
      xFactor: -8 + Math.random() * 16,
      yFactor: -8 + Math.random() * 16,
      zFactor: -8 + Math.random() * 16,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      p.t += p.speed / 2;
      const s = Math.max(Math.abs(Math.cos(p.t)), 0.15);
      dummy.position.set(
        p.xFactor / 2 + Math.cos((p.t / 10) * p.factor) * 1.5,
        p.yFactor / 2 + Math.sin((p.t / 10) * p.factor) * 1.5,
        p.zFactor / 2 + Math.cos((p.t / 10) * p.factor) * 1.5
      );
      dummy.scale.setScalar(s * 0.12);
      dummy.rotation.set(p.t * 0.3, p.t * 0.2, p.t * 0.1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={isDark ? "#333333" : "#cccccc"}
          emissive={isDark ? "#222222" : "#999999"}
          emissiveIntensity={isDark ? 0.6 : 0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </instancedMesh>
    </group>
  );
}

// ─── 鼠标驱动的相机 + 追踪光源 ──────────────────
function MouseRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera, pointer } = useThree();
  const lightRef = useRef<THREE.PointLight>(null);
  const lightPos = useRef(new Vector3(0, 0, 5));

  useFrame(() => {
    const targetX = pointer.x * 1.5;
    const targetY = pointer.y * 1.5;
    const baseZ = 12;
    const targetZ = baseZ - scrollProgress * 22;

    camera.position.x = MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ, 0.04);
    camera.lookAt(0, 0, 0);

    if (lightRef.current) {
      lightPos.current.set(pointer.x * 6, pointer.y * 6, camera.position.z + 2);
      lightRef.current.position.lerp(lightPos.current, 0.08);
    }
  });

  return <pointLight ref={lightRef} intensity={3} color="#ffffff" distance={25} decay={2} />;
}

// ─── 主组件导出 ─────────────────────────────────
export default function Scene3D({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const check = () => setIsDark(html.classList.contains("theme-inverted"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const bgColor = isDark ? "#ffffff" : "#050505";

  return (
    <div
      className="absolute inset-0 w-full h-full z-0 transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 12], fov: 45 }}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isDark ? 1.5 : 0.4} />
          <MouseRig scrollProgress={scrollProgress} />

          <ParticleCloud isDark={isDark} />
          <FloatingShards isDark={isDark} />

          {/* 简单的雾效增加深度感 */}
          <fog attach="fog" args={[isDark ? "#ffffff" : "#050505", 8, 30]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
