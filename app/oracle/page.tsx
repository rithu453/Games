'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const BoredomBuster = () => {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const activities = [
    {
      title: "5-Minute Meditation",
      description: "Close your eyes and focus on your breath for just 5 minutes.",
      category: "Mindfulness",
      color: "from-aurora-green to-cosmic-blue"
    },
    {
      title: "Gratitude Journal",
      description: "Write down 3 things you're grateful for today.",
      category: "Reflection",
      color: "from-cosmic-blue to-cosmic-purple"
    },
    {
      title: "Mindful Walking",
      description: "Take a 10-minute walk and notice everything around you.",
      category: "Movement",
      color: "from-cosmic-purple to-aurora-green"
    },
    {
      title: "Creative Doodling",
      description: "Let your hand move freely and create abstract art for 15 minutes.",
      category: "Creativity",
      color: "from-aurora-green to-cosmic-purple"
    },
    {
      title: "Breathing Exercise",
      description: "Practice the 4-7-8 breathing technique: inhale 4, hold 7, exhale 8.",
      category: "Wellness",
      color: "from-cosmic-blue to-aurora-green"
    },
    {
      title: "Positive Affirmations",
      description: "Repeat 5 positive statements about yourself.",
      category: "Self-Care",
      color: "from-cosmic-purple to-cosmic-blue"
    },
    {
      title: "Nature Connection",
      description: "Find a plant or look outside and observe nature for 5 minutes.",
      category: "Grounding",
      color: "from-aurora-green to-cosmic-blue"
    },
    {
      title: "Body Scan",
      description: "Lie down and mentally scan your body from head to toe.",
      category: "Relaxation",
      color: "from-cosmic-blue to-cosmic-purple"
    },
    {
      title: "Mindful Tea/Coffee",
      description: "Prepare and drink your beverage with complete awareness.",
      category: "Mindfulness",
      color: "from-cosmic-purple to-aurora-green"
    },
    {
      title: "Random Act of Kindness",
      description: "Do something nice for someone, even if it's just a smile.",
      category: "Connection",
      color: "from-aurora-green to-cosmic-purple"
    },
    {
      title: "Stretch Session",
      description: "Do gentle stretches for 10 minutes to release tension.",
      category: "Movement",
      color: "from-cosmic-blue to-aurora-green"
    },
    {
      title: "Mindful Listening",
      description: "Play a song and listen to every instrument and detail.",
      category: "Awareness",
      color: "from-cosmic-purple to-cosmic-blue"
    }
  ];

  const generateActivity = () => {
    setIsRevealing(true);
    
    setTimeout(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setCurrentActivity(randomActivity.title);
      setIsRevealing(false);
    }, 1000);
  };

  const getActivityData = () => {
    return activities.find(activity => activity.title === currentActivity);
  };

  const activityData = getActivityData();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      {/* Oracle Crystal */}
      <motion.div
        className="relative mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-48 h-48 rounded-full bg-gradient-to-br from-aurora-green/30 via-cosmic-blue/40 to-cosmic-purple/30 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center"
          animate={{
            rotate: isRevealing ? 360 : 0,
            scale: isRevealing ? 1.1 : 1,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center"
            animate={{
              opacity: isRevealing ? [1, 0.3, 1] : 1,
            }}
            transition={{ duration: 1, repeat: isRevealing ? 2 : 0 }}
          >
            <Sparkles className="w-12 h-12 text-aurora-green" />
          </motion.div>
        </motion.div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-aurora-green/60 rounded-full"
            style={{
              top: `${20 + Math.sin(i * 60) * 30}%`,
              left: `${20 + Math.cos(i * 60) * 30}%`,
            }}
            animate={{
              y: [-10, 10],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Activity Display */}
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {currentActivity && activityData ? (
          <motion.div
            className={`p-8 rounded-2xl bg-gradient-to-br ${activityData.color} bg-opacity-20 backdrop-blur-lg border border-white/20 text-center`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium text-white mb-4"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {activityData.category}
            </motion.div>
            
            <motion.h3
              className="text-2xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {activityData.title}
            </motion.h3>
            
            <motion.p
              className="text-white/90 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {activityData.description}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            className="p-8 rounded-2xl bg-moonstone-dark/30 backdrop-blur-lg border border-white/10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-moonstone-gray text-lg">
              Ask the Oracle for a mindful activity to brighten your day...
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={generateActivity}
          disabled={isRevealing}
          className="flex items-center gap-2 px-8 py-3 bg-aurora-green/80 text-white rounded-xl font-semibold hover:bg-aurora-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isRevealing ? 1 : 1.05 }}
          whileTap={{ scale: isRevealing ? 1 : 0.95 }}
        >
          <Sparkles className="w-5 h-5" />
          {isRevealing ? 'Consulting Oracle...' : 'Ask Oracle'}
        </motion.button>
        
        {currentActivity && (
          <motion.button
            onClick={() => setCurrentActivity(null)}
            className="flex items-center gap-2 px-6 py-3 bg-moonstone-gray/80 text-white rounded-xl font-semibold hover:bg-moonstone-gray transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </motion.button>
        )}
      </motion.div>

      {/* Oracle Wisdom */}
      <motion.div
        className="mt-12 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-moonstone-gray/80 text-sm italic">
          "The oracle reveals what your soul already knows - sometimes we just need a gentle nudge toward mindfulness."
        </p>
      </motion.div>
    </div>
  );
};

export default function OraclePage() {
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
          Mindfulness Oracle
        </motion.h1>
        
        <div className="w-32" /> {/* Spacer for centering */}
      </motion.header>

      {/* Game Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <BoredomBuster />
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
