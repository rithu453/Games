'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useAudioStore } from '@/lib/store';

const FOCUS = 25 * 60; // 25 minutes
const BREAK = 5 * 60;  // 5 minutes

function format(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// 3D Island that grows as time progresses
function TimerIsland({ progress, isFocus }: { progress: number; isFocus: boolean }) {
  const islandRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (waterRef.current) {
      waterRef.current.position.y = -2 + (progress * 3);
      if (waterRef.current.material && 'uniforms' in waterRef.current.material) {
        (waterRef.current.material as any).uniforms.time.value = state.clock.elapsedTime;
      }
    }
  });

  const waterShader = {
    vertexShader: `
      varying vec2 vUv;
      uniform float time;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.z += sin(pos.x * 2.0 + time) * 0.1;
        pos.z += cos(pos.y * 3.0 + time * 1.5) * 0.05;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float time;
      
      void main() {
        vec2 uv = vUv;
        vec3 color1 = vec3(0.1, 0.7, 0.9); // Light blue
        vec3 color2 = vec3(0.0, 0.4, 0.8); // Deep blue
        
        float wave = sin(uv.x * 10.0 + time) * sin(uv.y * 8.0 + time * 1.2);
        vec3 color = mix(color1, color2, wave * 0.5 + 0.5);
        
        gl_FragColor = vec4(color, 0.8);
      }
    `
  };

  return (
    <group ref={islandRef}>
      {/* Island base */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
          <meshLambertMaterial color={isFocus ? "#8B5A3C" : "#90EE90"} />
        </Sphere>
        
        {/* Trees that grow based on progress */}
        {[...Array(Math.floor(progress * 8))].map((_, i) => (
          <group key={i} position={[
            Math.cos(i * 0.8) * 0.8,
            0.8,
            Math.sin(i * 0.8) * 0.8
          ]}>
            {/* Tree trunk */}
            <mesh>
              <cylinderGeometry args={[0.05, 0.08, 0.6, 8]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Tree leaves */}
            <Sphere args={[0.2, 16, 16]} position={[0, 0.4, 0]}>
              <meshLambertMaterial color="#228B22" />
            </Sphere>
          </group>
        ))}
      </Float>

      {/* Water plane */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[10, 10, 32, 32]} />
        <shaderMaterial
          vertexShader={waterShader.vertexShader}
          fragmentShader={waterShader.fragmentShader}
          uniforms={{ time: { value: 0 } }}
          transparent
        />
      </mesh>
    </group>
  );
}

// Ambient sounds selection
const ambientSounds = [
  { name: 'Rain', url: '/audio/rain.mp3', icon: '🌧️' },
  { name: 'Forest', url: '/audio/forest.mp3', icon: '🌲' },
  { name: 'Ocean', url: '/audio/ocean.mp3', icon: '🌊' },
  { name: 'Café', url: '/audio/cafe.mp3', icon: '☕' },
  { name: 'Silence', url: null, icon: '🔇' },
];

export default function PomodoroTimer() {
  const [isFocus, setIsFocus] = useState(true);
  const [seconds, setSeconds] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [selectedAmbient, setSelectedAmbient] = useState(ambientSounds[4]);
  const [showAmbientMenu, setShowAmbientMenu] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const { masterVolume, soundEffectsEnabled } = useAudioStore();

  useEffect(() => {
    if (!running) return;
    
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;
        
        // Play completion sound
        if (soundEffectsEnabled && audioRef.current) {
          audioRef.current.volume = masterVolume;
          audioRef.current.play();
        }
        
        // Switch session after brief delay
        setTimeout(() => {
          setIsFocus((f) => !f);
          setSeconds(isFocus ? BREAK : FOCUS);
        }, 1000);
        
        return 0;
      });
    }, 1000);
    
    return () => clearInterval(id);
  }, [running, isFocus, masterVolume, soundEffectsEnabled]);

  // Handle ambient audio
  useEffect(() => {
    if (ambientRef.current) {
      if (selectedAmbient.url && running) {
        ambientRef.current.volume = masterVolume * 0.6;
        ambientRef.current.play();
      } else {
        ambientRef.current.pause();
      }
    }
  }, [selectedAmbient, running, masterVolume]);

  const progress = 1 - (seconds / (isFocus ? FOCUS : BREAK));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="w-full h-full bg-gradient-to-br from-warmth-beige to-ember-orange relative overflow-hidden">
      {/* Audio elements */}
      <audio ref={audioRef} src="/audio/chime.mp3" preload="auto" />
      {selectedAmbient.url && (
        <audio ref={ambientRef} src={selectedAmbient.url} loop preload="auto" />
      )}

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [4, 3, 4], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <pointLight position={[-10, -10, -5]} intensity={0.3} color="#FFB366" />
            <TimerIsland progress={progress} isFocus={isFocus} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className={`text-4xl font-bold mb-2 ${
              isFocus ? 'text-deep-slate' : 'text-aurora-green'
            }`}
            animate={{ scale: seconds <= 10 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: seconds <= 10 ? Infinity : 0 }}
          >
            {isFocus ? 'Focus Session' : 'Break Time'}
          </motion.h2>
          <p className="text-deep-slate/70">
            {isFocus ? 'Deep work mode activated' : 'Time to recharge'}
          </p>
        </motion.div>

        {/* Timer Display */}
        <motion.div
          className="text-center"
          layout
        >
          <motion.div
            className="text-8xl font-mono font-bold text-deep-slate mb-4"
            key={`${minutes}-${remainingSeconds}`}
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {format(seconds)}
          </motion.div>
          
          {/* Progress bar */}
          <div className="w-80 h-3 bg-white/30 rounded-full overflow-hidden mx-auto mb-6">
            <motion.div
              className={`h-full rounded-full ${
                isFocus ? 'bg-aurora-green' : 'bg-cosmic-purple'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          {/* Main controls */}
          <div className="flex gap-4">
            <motion.button
              className={`px-8 py-4 rounded-full font-semibold text-white shadow-lg transition-all ${
                running 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-aurora-green hover:bg-aurora-green/80'
              }`}
              onClick={() => setRunning(!running)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {running ? '⏸️ Pause' : '▶️ Start'}
            </motion.button>
            
            <motion.button
              className="px-8 py-4 rounded-full font-semibold text-deep-slate bg-white/80 hover:bg-white shadow-lg transition-all"
              onClick={() => {
                setRunning(false);
                setSeconds(isFocus ? FOCUS : BREAK);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Reset
            </motion.button>
          </div>

          {/* Ambient sound controls */}
          <div className="relative">
            <motion.button
              className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-deep-slate font-medium transition-all"
              onClick={() => setShowAmbientMenu(!showAmbientMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedAmbient.icon} {selectedAmbient.name}
            </motion.button>

            <AnimatePresence>
              {showAmbientMenu && (
                <motion.div
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/50"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {ambientSounds.map((sound) => (
                      <motion.button
                        key={sound.name}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          selectedAmbient.name === sound.name
                            ? 'bg-aurora-green text-white'
                            : 'bg-white/50 text-deep-slate hover:bg-white/80'
                        }`}
                        onClick={() => {
                          setSelectedAmbient(sound);
                          setShowAmbientMenu(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-lg mb-1">{sound.icon}</div>
                        <div>{sound.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating progress indicator */}
      <motion.div
        className="absolute top-8 right-8 w-16 h-16 rounded-full border-4 border-white/30"
        style={{
          background: `conic-gradient(${isFocus ? '#10b981' : '#8b5cf6'} ${progress * 360}deg, transparent 0deg)`
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full bg-white/80 rounded-full flex items-center justify-center text-deep-slate font-bold text-sm">
          {Math.round(progress * 100)}%
        </div>
      </motion.div>
    </div>
  );
}
