'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const modes = {
    work: { duration: 25, label: 'Focus Time', color: 'from-cosmic-purple to-cosmic-blue' },
    shortBreak: { duration: 5, label: 'Short Break', color: 'from-aurora-green to-cosmic-blue' },
    longBreak: { duration: 15, label: 'Long Break', color: 'from-cosmic-blue to-aurora-green' }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            if (minutes === 0) {
              // Timer finished
              setIsActive(false);
              if (mode === 'work') {
                setSessionsCompleted(prev => prev + 1);
                const nextMode = (sessionsCompleted + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
                setMode(nextMode);
                setMinutes(modes[nextMode].duration);
              } else {
                setMode('work');
                setMinutes(modes.work.duration);
              }
              setSeconds(0);
              return 0;
            } else {
              setMinutes(prev => prev - 1);
              return 59;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, mode, sessionsCompleted]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(modes[mode].duration);
    setSeconds(0);
  };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(modes[newMode].duration);
    setSeconds(0);
  };

  const progress = 1 - (minutes * 60 + seconds) / (modes[mode].duration * 60);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      {/* Timer Circle */}
      <motion.div
        className="relative w-80 h-80 mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 140}`}
            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress)}`}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-6xl font-bold text-white mb-2"
            key={`${minutes}:${seconds}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.div>
          <div className="text-lg text-moonstone-gray font-medium">
            {modes[mode].label}
          </div>
        </div>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {Object.entries(modes).map(([key, modeData]) => (
          <motion.button
            key={key}
            onClick={() => switchMode(key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              mode === key
                ? 'bg-aurora-green text-moonstone-dark'
                : 'bg-moonstone-dark/30 text-moonstone-gray hover:bg-moonstone-dark/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {modeData.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        className="flex gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-8 py-3 bg-aurora-green/80 text-white rounded-xl font-semibold hover:bg-aurora-green transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isActive ? 'Pause' : 'Start'}
        </motion.button>
        
        <motion.button
          onClick={resetTimer}
          className="flex items-center gap-2 px-8 py-3 bg-moonstone-gray/80 text-white rounded-xl font-semibold hover:bg-moonstone-gray transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </motion.button>
      </motion.div>

      {/* Session Counter */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-aurora-green text-xl font-semibold mb-2">
          Sessions Completed: {sessionsCompleted}
        </div>
        <div className="text-moonstone-gray/80 text-sm max-w-md">
          Complete 4 focus sessions to earn a long break. Stay focused and productive!
        </div>
      </motion.div>
    </div>
  );
};

export default function PomodoroPage() {
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
          Pomodoro Focus
        </motion.h1>
        
        <div className="w-32" /> {/* Spacer for centering */}
      </motion.header>

      {/* Game Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <PomodoroTimer />
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
