'use client';
import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Box } from '@react-three/drei';
import * as THREE from 'three';

const ideas = [
  { text: 'Draw a self-portrait with your non-dominant hand', category: 'Creative', illustration: '🎨' },
  { text: 'Write a haiku about your current emotion', category: 'Creative', illustration: '📝' },
  { text: 'Practice mindful breathing for 3 minutes', category: 'Mindful', illustration: '🧘' },
  { text: 'Take a walk and notice 5 new details', category: 'Mindful', illustration: '🚶' },
  { text: 'Do 10 gentle stretches while breathing deeply', category: 'Active', illustration: '🤸' },
  { text: 'Dance to your favorite song with abandon', category: 'Active', illustration: '💃' },
  { text: 'Watch a 10-minute documentary about something fascinating', category: 'Learning', illustration: '📺' },
  { text: 'Learn to say "hello" in a new language', category: 'Learning', illustration: '🌍' },
  { text: 'Organize one small space with intention', category: 'Active', illustration: '📦' },
  { text: 'Try creating a mandala pattern', category: 'Creative', illustration: '🎯' },
  { text: 'Listen to nature sounds with eyes closed', category: 'Mindful', illustration: '🎵' },
  { text: 'Write a letter to your past or future self', category: 'Creative', illustration: '✉️' },
  { text: 'Research a historical event that intrigues you', category: 'Learning', illustration: '📚' },
  { text: 'Practice gratitude by listing 5 specific things', category: 'Mindful', illustration: '🙏' },
  { text: 'Try progressive muscle relaxation', category: 'Mindful', illustration: '💆' },
  { text: 'Create a new snack combination', category: 'Creative', illustration: '🍎' },
  { text: 'Perform a random act of kindness', category: 'Mindful', illustration: '💝' },
  { text: 'Fold an origami creation', category: 'Creative', illustration: '🦢' },
  { text: 'Stargaze and identify one constellation', category: 'Learning', illustration: '⭐' },
  { text: 'Write a micro-story in exactly 50 words', category: 'Creative', illustration: '📖' },
  { text: 'Practice a new yoga pose', category: 'Active', illustration: '🧘‍♀️' },
  { text: 'Learn about a culture different from yours', category: 'Learning', illustration: '🌏' },
  { text: 'Create a playlist for a specific mood', category: 'Creative', illustration: '🎶' },
  { text: 'Practice mindful eating with one small item', category: 'Mindful', illustration: '🍇' },
  { text: 'Do a 5-minute declutter of your digital space', category: 'Active', illustration: '💻' },
  
  // CRAZY NEW IDEAS! 🚀
  { text: 'Create a dramatic monologue as a talking houseplant', category: 'Creative', illustration: '🪴' },
  { text: 'Invent a new sport using only office supplies', category: 'Creative', illustration: '📎' },
  { text: 'Write your autobiography from the perspective of your pet (or dream pet)', category: 'Creative', illustration: '🐕' },
  { text: 'Design a theme park attraction based on your biggest fear', category: 'Creative', illustration: '🎢' },
  { text: 'Practice walking like different animals for 2 minutes each', category: 'Active', illustration: '🦆' },
  { text: 'Create a cooking show episode using only what\'s in your fridge', category: 'Creative', illustration: '👨‍🍳' },
  { text: 'Write a love letter to your favorite childhood toy', category: 'Creative', illustration: '🧸' },
  { text: 'Compose a rap battle between historical figures', category: 'Creative', illustration: '🎤' },
  { text: 'Design your dream zombie apocalypse survival kit', category: 'Learning', illustration: '🧟' },
  { text: 'Create interpretive dance for your morning routine', category: 'Active', illustration: '🕺' },
  { text: 'Build a pillow fort and declare yourself its ruler', category: 'Creative', illustration: '👑' },
  { text: 'Write a Yelp review for your own existence', category: 'Creative', illustration: '⭐' },
  { text: 'Meditate while imagining you\'re a tree growing backwards', category: 'Mindful', illustration: '🌳' },
  { text: 'Create a conspiracy theory about why socks disappear', category: 'Creative', illustration: '🧦' },
  { text: 'Practice giving a TED talk about the secret life of doorknobs', category: 'Learning', illustration: '🚪' },
  { text: 'Design a superhero whose power is extreme punctuality', category: 'Creative', illustration: '⚡' },
  { text: 'Write a travel guide for visiting your own bedroom', category: 'Creative', illustration: '🛏️' },
  { text: 'Create a new emoji by combining three random objects', category: 'Creative', illustration: '😎' },
  { text: 'Practice arguing with yourself about pizza toppings', category: 'Active', illustration: '🍕' },
  { text: 'Design a reality TV show starring your houseplants', category: 'Creative', illustration: '📺' },
  { text: 'Write a breaking news report about your cat\'s daily activities', category: 'Creative', illustration: '📰' },
  { text: 'Create a workout routine inspired by washing dishes', category: 'Active', illustration: '🍽️' },
  { text: 'Compose a lullaby for your electronic devices', category: 'Creative', illustration: '📱' },
  { text: 'Practice speed-folding laundry like it\'s a competitive sport', category: 'Active', illustration: '👕' },
  { text: 'Design a dating profile for your favorite kitchen appliance', category: 'Creative', illustration: '☕' },
  { text: 'Write a weather forecast for your emotional state', category: 'Mindful', illustration: '🌦️' },
  { text: 'Create a documentary pitch about the secret society of dust bunnies', category: 'Creative', illustration: '🐰' },
  { text: 'Practice being a motivational speaker for inanimate objects', category: 'Active', illustration: '📢' },
  { text: 'Design a board game based on your daily commute', category: 'Creative', illustration: '🎲' },
  { text: 'Write acceptance speeches for everyday achievements', category: 'Creative', illustration: '🏆' },
  { text: 'Create a meditation on what it feels like to be a charging cable', category: 'Mindful', illustration: '🔌' },
  { text: 'Practice narrating your life like a nature documentary', category: 'Active', illustration: '🎥' },
  { text: 'Design a theme song for each room in your house', category: 'Creative', illustration: '🎵' },
  { text: 'Write a user manual for being human', category: 'Learning', illustration: '👤' },
  { text: 'Create a horror story about losing WiFi signal', category: 'Creative', illustration: '📶' },
  { text: 'Practice giving Oscar acceptance speeches in different accents', category: 'Active', illustration: '🏅' },
  { text: 'Design a social media platform for plants only', category: 'Creative', illustration: '🌱' },
  { text: 'Write a complaint letter to gravity', category: 'Creative', illustration: '🍎' },
  { text: 'Create a cooking show where you only use one utensil', category: 'Creative', illustration: '🥄' },
  { text: 'Practice walking like you\'re on different planets', category: 'Active', illustration: '🪐' },
  { text: 'Design a business plan for selling bottled silence', category: 'Learning', illustration: '🤫' },
  { text: 'Write a haiku from the perspective of your WiFi router', category: 'Creative', illustration: '📡' },
  { text: 'Create a workout routine using only facial expressions', category: 'Active', illustration: '😤' },
  { text: 'Design a time machine that only goes back 30 seconds', category: 'Learning', illustration: '⏰' },
  { text: 'Practice being a sports commentator for mundane activities', category: 'Active', illustration: '🎙️' },
  { text: 'Write a sequel to your favorite nursery rhyme', category: 'Creative', illustration: '🐑' },
  { text: 'Create a meditation about being a sock in the dryer', category: 'Mindful', illustration: '🧦' },
  { text: 'Design a restaurant that only serves foods that start with the same letter', category: 'Creative', illustration: '🥨' },
];

const categories = {
  Creative: { color: '#8b5cf6', bgColor: 'from-cosmic-purple to-lavender-dream' },
  Mindful: { color: '#10b981', bgColor: 'from-aurora-green to-sage-whisper' },
  Active: { color: '#f97316', bgColor: 'from-ember-orange to-warmth-beige' },
  Learning: { color: '#3b82f6', bgColor: 'from-mist-blue to-glow-calm-white' },
};

// 3D Card component
function FloatingCard({ 
  idea, 
  position, 
  isSelected, 
  onClick 
}: { 
  idea: typeof ideas[0]; 
  position: [number, number, number]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cardRef.current && !isSelected) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={isSelected ? 0 : 0.3} floatIntensity={isSelected ? 0.1 : 0.5}>
      <group 
        ref={cardRef} 
        position={position}
        onClick={onClick}
        scale={isSelected ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      >
        {/* Card base */}
        <Box args={[2, 3, 0.1]}>
          <meshLambertMaterial 
            color={categories[idea.category as keyof typeof categories].color} 
            transparent 
            opacity={0.9} 
          />
        </Box>
        
        {/* Card highlight when selected */}
        {isSelected && (
          <Box args={[2.2, 3.2, 0.05]} position={[0, 0, -0.1]}>
            <meshLambertMaterial color="#ffffff" transparent opacity={0.3} />
          </Box>
        )}
        
        {/* Illustration */}
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.3}
          height={0.02}
          position={[0, 0.8, 0.06]}
        >
          {idea.illustration}
          <meshLambertMaterial color="#ffffff" />
        </Text3D>
      </group>
    </Float>
  );
}

export default function BoredomBuster() {
  const [selectedIdea, setSelectedIdea] = useState<typeof ideas[0] | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [favoriteIdeas, setFavoriteIdeas] = useState<typeof ideas[0][]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const shuffleCards = async () => {
    setIsShuffling(true);
    setSelectedIdea(null);
    
    // Simulate card shuffling animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    setSelectedIdea(randomIdea);
    setIsShuffling(false);
  };

  const addToFavorites = (idea: typeof ideas[0]) => {
    if (!favoriteIdeas.find(fav => fav.text === idea.text)) {
      setFavoriteIdeas([...favoriteIdeas, idea]);
    }
  };

  // Generate card positions for 3D scene
  const cardPositions: [number, number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 4;
    cardPositions.push([
      Math.cos(angle) * radius,
      Math.sin(i * 0.5) * 0.5,
      Math.sin(angle) * radius
    ]);
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-deep-slate via-cosmic-purple to-aurora-green relative overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -5, -10]} intensity={0.3} color="#8b5cf6" />
            
            {/* Floating cards */}
            {!isShuffling && ideas.slice(0, 8).map((idea, index) => (
              <FloatingCard
                key={idea.text}
                idea={idea}
                position={cardPositions[index]}
                isSelected={selectedIdea?.text === idea.text}
                onClick={() => setSelectedIdea(idea)}
              />
            ))}
            
            {/* Shuffling effect */}
            {isShuffling && (
              <group>
                {[...Array(20)].map((_, i) => (
                  <Float key={i} speed={3} rotationIntensity={2} floatIntensity={2}>
                    <Box 
                      args={[0.3, 0.4, 0.02]} 
                      position={[
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 6,
                        (Math.random() - 0.5) * 8
                      ]}
                    >
                      <meshLambertMaterial color={Object.values(categories)[i % 4].color} />
                    </Box>
                  </Float>
                ))}
              </group>
            )}
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
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-glow-calm-white to-aurora-green bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            The Oracle
          </motion.h1>
          <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
            Seek wisdom in the floating cards. Each holds a path to inspiration.
          </p>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!selectedIdea && !isShuffling && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  className="px-12 py-6 bg-gradient-to-r from-aurora-green to-cosmic-purple text-white rounded-full text-xl font-bold shadow-glow-lg hover:shadow-glow transition-all duration-300"
                  onClick={shuffleCards}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isShuffling}
                >
                  ✨ Consult the Oracle ✨
                </motion.button>
                <p className="text-white/60 mt-4">
                  Click on floating cards or shuffle for a random inspiration
                </p>
              </motion.div>
            )}

            {isShuffling && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-4xl mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🔮
                </motion.div>
                <p className="text-white text-xl">The cards are revealing your path...</p>
              </motion.div>
            )}

            {selectedIdea && (
              <motion.div
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className={`bg-gradient-to-br ${categories[selectedIdea.category as keyof typeof categories].bgColor} rounded-3xl p-8 shadow-ethereal border border-white/20 backdrop-blur-sm`}
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="text-6xl mb-4">{selectedIdea.illustration}</div>
                  <motion.div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 text-white`}
                    style={{ backgroundColor: categories[selectedIdea.category as keyof typeof categories].color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedIdea.category}
                  </motion.div>
                  <motion.p
                    className="text-2xl text-deep-slate font-medium mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {selectedIdea.text}
                  </motion.p>
                  
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-deep-slate font-semibold border border-white/30 transition-all"
                      onClick={() => addToFavorites(selectedIdea)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ⭐ Save to Favorites
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 bg-deep-slate/20 hover:bg-deep-slate/30 backdrop-blur-sm rounded-full text-deep-slate font-semibold border border-deep-slate/30 transition-all"
                      onClick={shuffleCards}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🔄 Draw Another
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/20 transition-all"
            onClick={() => setShowFavorites(!showFavorites)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⭐ Favorites ({favoriteIdeas.length})
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/20 transition-all"
            onClick={() => setSelectedIdea(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🌌 View All Cards
          </motion.button>
        </motion.div>
      </div>

      {/* Favorites panel */}
      <AnimatePresence>
        {showFavorites && (
          <motion.div
            className="absolute inset-0 bg-deep-slate/80 backdrop-blur-xl z-20 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFavorites(false)}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-auto"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold text-deep-slate mb-6 text-center">Your Favorite Inspirations</h3>
              {favoriteIdeas.length === 0 ? (
                <p className="text-center text-moonstone-gray text-lg">No favorites yet. Start exploring!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteIdeas.map((idea, index) => (
                    <motion.div
                      key={index}
                      className={`p-4 rounded-xl bg-gradient-to-br ${categories[idea.category as keyof typeof categories].bgColor}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-2xl mb-2">{idea.illustration}</div>
                      <div className="text-sm font-bold text-deep-slate mb-2">{idea.category}</div>
                      <p className="text-deep-slate">{idea.text}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mystical background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-radial from-aurora-green/20 to-transparent"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.05, 0.2],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
