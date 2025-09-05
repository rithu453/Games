'use client';
import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/lib/store';

interface Props {
  children: ReactNode;
}

export default function GameModal({ children }: Props) {
  const { currentModal, setCurrentModal } = useUIStore();

  useEffect(() => {
    if (!currentModal) return;
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCurrentModal(null);
    };
    
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentModal, setCurrentModal]);

  return (
    <AnimatePresence mode="wait">
      {currentModal && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-deep-slate/80 via-cosmic-purple/40 to-aurora-green/20 backdrop-blur-xl"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            onClick={() => setCurrentModal(null)}
          />

          {/* Floating particles in modal */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-aurora-green/40 rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  scale: 0 
                }}
                animate={{
                  y: [null, -50, (typeof window !== 'undefined' ? window.innerHeight : 800) + 50],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 8 + 6,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Close button */}
          <motion.button
            className="absolute top-8 right-8 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20 shadow-ethereal transition-all duration-300 group"
            onClick={() => setCurrentModal(null)}
            aria-label="Close"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </motion.svg>
          </motion.button>

          {/* Modal content */}
          <motion.div
            className="relative z-10 w-full h-full max-w-7xl max-h-[95vh] mx-4 bg-gradient-to-br from-glow-calm-white/95 to-dawn-sky/90 backdrop-blur-2xl rounded-3xl shadow-cosmic border border-white/30 overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.23, 1, 0.32, 1] // Custom easing for smooth feel
            }}
          >
            {/* Ambient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/5 via-transparent to-cosmic-purple/5 rounded-3xl" />
            
            {/* Content container */}
            <div className="relative z-10 w-full h-full p-8 flex flex-col overflow-auto">
              <motion.div
                className="flex-1 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
