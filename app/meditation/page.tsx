'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const MeditationPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const tracks = [
    {
      title: "Forest Serenity",
      duration: "∞",
      description: "Peaceful forest ambience for deep relaxation",
      color: "from-cosmic-blue to-aurora-green",
      url: "/audio/forest-nature-322637.mp3"
    },
    {
      title: "Jungle Awakening",
      duration: "∞",
      description: "Immersive jungle sounds to ground your spirit",
      color: "from-aurora-green to-cosmic-blue",
      url: "/audio/jungle-nature-229896.mp3"
    },
    {
      title: "Nature's Harmony",
      duration: "∞",
      description: "Soothing natural ambience for mindful presence",
      color: "from-cosmic-purple to-cosmic-blue",
      url: "/audio/nature-ambience-323729.mp3"
    },
    {
      title: "Wetland Whispers",
      duration: "∞",
      description: "Tranquil swamp sounds with gentle bird calls",
      color: "from-cosmic-blue to-cosmic-purple",
      url: "/audio/nature-swamp-birds-399635.mp3"
    },
    {
      title: "Spring Forest Dreams",
      duration: "∞",
      description: "Rejuvenating spring forest soundscape",
      color: "from-aurora-green to-cosmic-purple",
      url: "/audio/spring-forest-nature-2-377741.mp3"
    },
    {
      title: "Woodland Meditation",
      duration: "∞",
      description: "Classic spring forest sounds for deep contemplation",
      color: "from-cosmic-purple to-aurora-green",
      url: "/audio/spring-forest-nature-332842.mp3"
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // Auto-play next track
      if (currentTrack < tracks.length - 1) {
        setCurrentTrack(currentTrack + 1);
      }
    };

    if (isPlaying) {
      progressInterval.current = setInterval(updateProgress, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', updateProgress);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [isPlaying, currentTrack, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setProgress(0);
    setIsPlaying(false);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const currentTrackData = tracks[currentTrack];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentTrackData.url}
        preload="metadata"
      />

      {/* Main Player */}
      <motion.div
        className={`w-full max-w-md p-8 rounded-3xl bg-gradient-to-br ${currentTrackData.color} bg-opacity-20 backdrop-blur-lg border border-white/20 mb-8`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Track Info */}
        <motion.div
          className="text-center mb-6"
          key={currentTrack}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            {currentTrackData.title}
          </h3>
          <p className="text-white/80 text-sm">
            {currentTrackData.description}
          </p>
          <p className="text-white/60 text-xs mt-1">
            Duration: {currentTrackData.duration}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/80 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={() => selectTrack(currentTrack > 0 ? currentTrack - 1 : tracks.length - 1)}
            className="text-white/80 hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-2xl">⏮</span>
          </motion.button>

          <motion.button
            onClick={togglePlay}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </motion.button>

          <motion.button
            onClick={() => selectTrack(currentTrack < tracks.length - 1 ? currentTrack + 1 : 0)}
            className="text-white/80 hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-2xl">⏭</span>
          </motion.button>
        </motion.div>

        {/* Volume Control */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={toggleMute}
            className="text-white/80 hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-2 bg-white/20 rounded-full outline-none slider"
          />
        </motion.div>
      </motion.div>

      {/* Track List */}
      <motion.div
        className="w-full max-w-md space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="text-white font-semibold mb-4 text-center">Select Track</h4>
        {tracks.map((track, index) => (
          <motion.button
            key={index}
            onClick={() => selectTrack(index)}
            className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
              currentTrack === index
                ? 'bg-aurora-green/30 border border-aurora-green/50 text-white'
                : 'bg-moonstone-dark/30 border border-white/10 text-white/80 hover:bg-moonstone-dark/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{track.title}</span>
              <span className="text-sm opacity-70">{track.duration}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default function MeditationPage() {
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
          Meditation Sounds
        </motion.h1>
        
        <div className="w-32" /> {/* Spacer for centering */}
      </motion.header>

      {/* Game Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <MeditationPlayer />
      </motion.div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-aurora-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cosmic-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cosmic-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10B981;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10B981;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
