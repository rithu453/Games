'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CustomIcon } from '@/components/CustomIcon';

const tools = [
  {
    key: 'breathing',
    title: 'Aura Breath',
    desc: 'Ground yourself with guided breathing.',
    icon: 'breath',
    route: '/breathing',
    gradient: 'from-aurora-green to-sage-whisper',
  },
  {
    key: 'pomodoro',
    title: 'Zenith Focus',
    desc: 'Boost productivity with focused work sessions.',
    icon: 'timer',
    route: '/pomodoro',
    gradient: 'from-ember-orange to-warmth-beige',
  },
  {
    key: 'boredom',
    title: 'The Oracle',
    desc: 'Find inspiration for moments of boredom.',
    icon: 'oracle',
    route: '/oracle',
    gradient: 'from-cosmic-purple to-lavender-dream',
  },
  {
    key: 'meditation',
    title: 'Echoes of Stillness',
    desc: 'Find peace with a simple guided meditation.',
    icon: 'meditation',
    route: '/meditation',
    gradient: 'from-mist-blue to-glow-calm-white',
  },
  {
    key: 'maze',
    title: 'Mindful Pac-Man',
    desc: 'Navigate thoughts and collect positivity.',
    icon: 'maze',
    route: '/pacman',
    gradient: 'from-deep-slate to-moonstone-gray',
  },
  {
    key: 'doodle',
    title: 'Soul Canvas',
    desc: 'Express yourself freely without judgment.',
    icon: 'canvas',
    route: '/canvas',
    gradient: 'from-aurora-green to-cosmic-purple',
  },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dawn-sky via-mist-blue to-glow-calm-white text-deep-slate font-sans overflow-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-aurora-green/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{
              y: [null, -100, window.innerHeight + 100],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-center px-4 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Back button */}
        <motion.div
          className="w-full max-w-6xl flex justify-start px-4 pt-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.button
            onClick={() => window.open('https://charakan.online', '_self')}
            className="group flex items-center gap-3 px-6 py-3 bg-moonstone-dark/20 backdrop-blur-lg border border-aurora-green/30 rounded-xl text-aurora-green hover:bg-aurora-green/10 transition-all duration-300"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="text-xl"
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ←
            </motion.span>
            <span className="font-medium">Back to Charakan</span>
          </motion.button>
        </motion.div>

        <motion.header 
          className="pt-8 pb-12 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-aurora-green via-cosmic-purple to-ember-orange bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Mindful Hub
          </motion.h1>
          <motion.p 
            className="text-xl text-moonstone-gray max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Your digital sanctuary for pause, play, and profound peace.
          </motion.p>
        </motion.header>

        <motion.main 
          className="flex-1 w-full max-w-6xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.key}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.6 + index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.button
                  className={`
                    relative group w-full bg-gradient-to-br ${tool.gradient} 
                    rounded-3xl p-8 overflow-hidden backdrop-blur-sm
                    border border-white/20 shadow-ethereal
                    hover:shadow-glow-lg transition-all duration-300
                  `}
                  onClick={() => router.push(tool.route)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shimmer" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                      className="mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <CustomIcon 
                        type={tool.icon} 
                        className="w-16 h-16 text-white drop-shadow-lg" 
                      />
                    </motion.div>
                    
                    <h2 className="font-bold text-2xl mb-3 text-white drop-shadow-sm">
                      {tool.title}
                    </h2>
                    <p className="text-white/90 text-sm leading-relaxed max-w-xs">
                      {tool.desc}
                    </p>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.main>

        <motion.footer 
          className="mt-16 text-moonstone-gray/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          © {new Date().getFullYear()} Mindful Hub - Crafted with intention
        </motion.footer>
      </motion.div>
    </div>
  );
}
