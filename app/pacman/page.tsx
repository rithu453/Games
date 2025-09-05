'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PacmanGame2D from '../../components/PacmanGameStructured';

export default function PacmanPage() {
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
          Mindful Pacman
        </motion.h1>
        
        <div className="w-32" /> {/* Spacer for centering */}
      </motion.header>

      {/* Game Container */}
      <div className="w-full">
        <PacmanGame2D />
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-aurora-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cosmic-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cosmic-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
