'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const BreathingGame = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return 4;
              case 'hold':
                setPhase('exhale');
                return 6;
              case 'exhale':
                setPhase('pause');
                return 2;
              case 'pause':
                setPhase('inhale');
                setCycles(c => c + 1);
                return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-aurora-green to-cosmic-blue';
      case 'hold': return 'from-cosmic-blue to-cosmic-purple';
      case 'exhale': return 'from-cosmic-purple to-moonstone-gray';
      case 'pause': return 'from-moonstone-gray to-aurora-green';
    }
  };

  const circleScale = phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      {/* Breathing Circle */}
      <motion.div
        className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl mb-8`}
        animate={{ scale: circleScale }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-4 rounded-full bg-moonstone-dark/30 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            className="text-6xl font-bold text-white"
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {count}
          </motion.div>
        </div>
      </motion.div>

      {/* Phase Indicator */}
      <motion.h2
        className="text-3xl font-bold text-white mb-8"
        key={phase}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {getPhaseText()}
      </motion.h2>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <motion.button
          onClick={() => setIsActive(!isActive)}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isActive 
              ? 'bg-cosmic-purple/80 text-white hover:bg-cosmic-purple' 
              : 'bg-aurora-green/80 text-white hover:bg-aurora-green'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? 'Pause' : 'Start'}
        </motion.button>
        
        <motion.button
          onClick={() => {
            setIsActive(false);
            setPhase('inhale');
            setCount(4);
            setCycles(0);
          }}
          className="px-8 py-3 bg-moonstone-gray/80 text-white rounded-xl font-semibold hover:bg-moonstone-gray transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>

      {/* Cycle Counter */}
      <motion.div
        className="text-aurora-green text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Completed Cycles: {cycles}
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mt-8 max-w-md text-center text-moonstone-gray/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-sm leading-relaxed">
          Follow the breathing pattern: Inhale for 4 counts, hold for 4, exhale for 6, pause for 2. 
          This technique helps reduce stress and promotes mindfulness.
        </p>
      </motion.div>
    </div>
  );
};

export default function BreathingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/20 via-cosmic-blue/30 to-aurora-green/20">
      {/* Navigation Header */}
      <motion.header 
        className="p-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={() => router.push('/')}
          className="group flex items-center gap-3 px-6 py-3 bg-moonstone-dark/20 backdrop-blur-lg border border-aurora-green/30 rounded-xl text-aurora-green hover:bg-aurora-green/10 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Hub
        </motion.button>
        
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-aurora-green via-cosmic-blue to-cosmic-purple bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Mindful Breathing
        </motion.h1>
        
        <div className="w-32" /> {/* Spacer for centering */}
      </motion.header>

      {/* Game Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <BreathingGame />
      </motion.div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-aurora-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cosmic-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cosmic-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
