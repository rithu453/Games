'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

const phases = [
  { label: 'Inhale', color: '#10b981', duration: 4000, instruction: 'Breathe in slowly through your nose' },
  { label: 'Hold', color: '#3b82f6', duration: 4000, instruction: 'Hold your breath gently' },
  { label: 'Exhale', color: '#8b5cf6', duration: 4000, instruction: 'Release slowly through your mouth' },
  { label: 'Hold', color: '#06b6d4', duration: 4000, instruction: 'Rest in the stillness' },
];

function BreathingOrb({ phase, progress }: { phase: number; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const currentPhase = phases[phase];
  const scale = phase === 0 ? 0.8 + 0.6 * progress
                : phase === 1 ? 1.4
                : phase === 2 ? 1.4 - 0.6 * progress
                : 0.8;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.phase.value = phase;
      materialRef.current.uniforms.progress.value = progress;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      float wave = sin(time * 2.0 + pos.y * 5.0) * 0.02;
      pos += normal * wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform float phase;
    uniform float progress;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      // Create aurora-like colors
      vec3 color1 = vec3(0.06, 0.71, 0.51); // Aurora green
      vec3 color2 = vec3(0.23, 0.51, 0.96); // Sky blue
      vec3 color3 = vec3(0.54, 0.36, 0.96); // Cosmic purple
      vec3 color4 = vec3(0.02, 0.71, 0.84); // Cyan
      
      vec3 colors[4];
      colors[0] = color1;
      colors[1] = color2;
      colors[2] = color3;
      colors[3] = color4;
      
      int phaseInt = int(phase);
      vec3 currentColor = colors[phaseInt];
      
      // Pulsing effect
      float pulse = sin(time * 3.0 + dist * 10.0) * 0.1 + 0.9;
      
      // Radial gradient
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha *= pulse;
      
      // Add sparkle effect
      float sparkle = sin(time * 8.0 + vPosition.x * 20.0) * sin(time * 6.0 + vPosition.y * 15.0);
      sparkle = smoothstep(0.8, 1.0, sparkle) * 0.3;
      
      gl_FragColor = vec4(currentColor + sparkle, alpha * 0.8);
    }
  `;

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            time: { value: 0 },
            phase: { value: phase },
            progress: { value: progress }
          }}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </Float>
  );
}

function ParticleSystem({ phase }: { phase: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particles = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 10;
    particles[i * 3 + 1] = (Math.random() - 0.5) * 10;
    particles[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={phases[phase].color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function BreathingGame() {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    let raf: number;
    const start = performance.now();
    
    const animate = (now: number) => {
      const elapsed = now - start;
      const currentProgress = Math.min(elapsed / phases[phase].duration, 1);
      setProgress(currentProgress);
      
      if (elapsed < phases[phase].duration) {
        raf = requestAnimationFrame(animate);
      } else {
        setPhase((p) => (p + 1) % phases.length);
        setProgress(0);
      }
    };
    
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase, isActive]);

  const currentPhase = phases[phase];

  return (
    <div className="w-full h-full bg-gradient-to-br from-deep-slate to-cosmic-purple relative overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <BreathingOrb phase={phase} progress={progress} />
            <ParticleSystem phase={phase} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8">
        {/* Phase indicator */}
        <motion.div
          className="text-center mb-8"
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-4xl font-bold mb-2 text-white drop-shadow-lg"
            style={{ color: currentPhase.color }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            {currentPhase.label}
          </motion.h2>
          <motion.p
            className="text-lg text-white/80 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {currentPhase.instruction}
          </motion.p>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-8"
          initial={{ width: 0 }}
          animate={{ width: 256 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: currentPhase.color }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>

        {/* Control buttons */}
        <div className="flex gap-4">
          <motion.button
            className={`px-6 py-3 rounded-full font-semibold text-white backdrop-blur-sm border border-white/20 transition-all ${
              isActive ? 'bg-red-500/80 hover:bg-red-600/80' : 'bg-aurora-green/80 hover:bg-aurora-green'
            }`}
            onClick={() => setIsActive(!isActive)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive ? 'Pause' : 'Start'}
          </motion.button>
          
          <motion.button
            className="px-6 py-3 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all"
            onClick={() => {
              setPhase(0);
              setProgress(0);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>

        {/* Breathing guide text */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed">
            Focus on the floating orb and let your breath synchronize with its gentle rhythm. 
            Allow yourself to find peace in this moment of mindful breathing.
          </p>
        </motion.div>
      </div>

      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${currentPhase.color}20 0%, transparent 70%)`,
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
