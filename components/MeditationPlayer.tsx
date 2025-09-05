'use client';
import { useRef, useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

const meditations = [
  {
    name: 'Forest Serenity',
    duration: '∞',
    description: 'Peaceful forest ambience for deep relaxation',
    src: '/audio/forest-nature-322637.mp3',
  },
  {
    name: 'Jungle Awakening',
    duration: '∞', 
    description: 'Immersive jungle sounds to ground your spirit',
    src: '/audio/jungle-nature-229896.mp3',
  },
  {
    name: 'Nature\'s Harmony',
    duration: '∞',
    description: 'Soothing natural ambience for mindful presence',
    src: '/audio/nature-ambience-323729.mp3',
  },
  {
    name: 'Wetland Whispers',
    duration: '∞',
    description: 'Tranquil swamp sounds with gentle bird calls',
    src: '/audio/nature-swamp-birds-399635.mp3',
  },
  {
    name: 'Spring Forest Dreams',
    duration: '∞',
    description: 'Rejuvenating spring forest soundscape',
    src: '/audio/spring-forest-nature-2-377741.mp3',
  },
  {
    name: 'Woodland Meditation',
    duration: '∞',
    description: 'Classic spring forest sounds for deep contemplation',
    src: '/audio/spring-forest-nature-332842.mp3',
  },
];

// Generative art visualizer
function MeditationVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const spheresRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (groupRef.current && isPlaying) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      spheresRef.current.forEach((sphere, i) => {
        if (sphere) {
          sphere.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
          sphere.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2);
        }
      });
    }
  });

  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b'];

  return (
    <group ref={groupRef}>
      {colors.map((color, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.3} floatIntensity={0.5}>
          <Sphere
            ref={(ref) => {
              if (ref) spheresRef.current[i] = ref;
            }}
            args={[0.2 + i * 0.1, 32, 32]}
            position={[
              Math.cos((i / colors.length) * Math.PI * 2) * 2,
              0,
              Math.sin((i / colors.length) * Math.PI * 2) * 2
            ]}
          >
            <meshLambertMaterial 
              color={color} 
              transparent 
              opacity={0.7}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </Sphere>
        </Float>
      ))}
      
      {/* Central orb */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Sphere args={[0.5, 64, 64]}>
          <meshLambertMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.3}
            emissive="#ffffff"
            emissiveIntensity={isPlaying ? 0.2 : 0.1}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export default function MeditationPlayer() {
  const [selectedMeditation, setSelectedMeditation] = useState(meditations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [selectedMeditation]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full h-full bg-gradient-to-br from-mist-blue via-lavender-dream to-sage-whisper relative overflow-hidden">
      {/* 3D Visualizer */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.6} />
            <pointLight position={[-10, -5, -10]} intensity={0.3} color="#8b5cf6" />
            <MeditationVisualizer isPlaying={isPlaying} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-deep-slate to-aurora-green bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Echoes of Stillness
          </motion.h1>
          <p className="text-deep-slate/70 text-lg max-w-md mx-auto leading-relaxed">
            Journey inward with guided meditations and ambient soundscapes
          </p>
        </motion.div>

        {/* Meditation selection */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
          <motion.div
            className="grid gap-4 mb-8 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {meditations.map((meditation) => (
              <motion.button
                key={meditation.name}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedMeditation.name === meditation.name
                    ? 'bg-white/30 border-aurora-green shadow-glow'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                onClick={() => {
                  setSelectedMeditation(meditation);
                  setIsPlaying(false);
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-deep-slate mb-2">
                      {meditation.name}
                    </h3>
                    <p className="text-deep-slate/70 text-sm mb-2">
                      {meditation.description}
                    </p>
                    <span className="text-aurora-green font-medium text-sm">
                      {meditation.duration}
                    </span>
                  </div>
                  {selectedMeditation.name === meditation.name && (
                    <div className="w-4 h-4 bg-aurora-green rounded-full animate-pulse" />
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Audio player */}
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md border border-white/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-deep-slate mb-4 text-center">
              {selectedMeditation.name}
            </h3>

            {/* Progress bar */}
            <div className="w-full h-2 bg-white/30 rounded-full mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-aurora-green rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Time display */}
            <div className="flex justify-between text-sm text-deep-slate/70 mb-6">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : selectedMeditation.duration}</span>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                  isPlaying 
                    ? 'bg-deep-slate hover:bg-deep-slate/80' 
                    : 'bg-aurora-green hover:bg-aurora-green/80'
                }`}
                onClick={togglePlayback}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-deep-slate/60 text-sm max-w-lg mx-auto leading-relaxed">
            Find a comfortable position, close your eyes, and let the gentle guidance
            lead you to a place of deep peace and awareness.
          </p>
        </motion.div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={selectedMeditation.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-aurora-green/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              y: [0, -100],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
