'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Palette, RotateCcw, Download, Brush } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const DoodleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#10B981'); // aurora-green
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  const colors = [
    '#10B981', // aurora-green
    '#3B82F6', // cosmic-blue
    '#8B5CF6', // cosmic-purple
    '#F59E0B', // amber
    '#EF4444', // red
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#6366F1', // indigo
    '#FFFFFF', // white
    '#000000', // black
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set initial canvas style
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = brushSize;
      
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
      }
      
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'mindful-doodle.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      {/* Canvas */}
      <motion.div
        className="w-full max-w-4xl bg-moonstone-dark/30 rounded-2xl p-4 backdrop-blur-lg border border-white/20 mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-96 rounded-xl cursor-crosshair border border-white/10"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </motion.div>

      {/* Controls */}
      <motion.div
        className="w-full max-w-4xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Tool Selection */}
        <div className="flex justify-center gap-4">
          <motion.button
            onClick={() => setTool('brush')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              tool === 'brush'
                ? 'bg-aurora-green text-moonstone-dark'
                : 'bg-moonstone-dark/30 text-white hover:bg-moonstone-dark/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Brush className="w-5 h-5" />
            Brush
          </motion.button>
          
          <motion.button
            onClick={() => setTool('eraser')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              tool === 'eraser'
                ? 'bg-cosmic-purple text-white'
                : 'bg-moonstone-dark/30 text-white hover:bg-moonstone-dark/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">🧽</span>
            Eraser
          </motion.button>
        </div>

        {/* Color Palette */}
        <div className="flex flex-wrap justify-center gap-3">
          {colors.map((color) => (
            <motion.button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                currentColor === color
                  ? 'border-white scale-110'
                  : 'border-white/30 hover:border-white/60'
              }`}
              style={{ backgroundColor: color }}
              whileHover={{ scale: currentColor === color ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center justify-center gap-4">
          <span className="text-white font-medium">Size:</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-32 h-2 bg-moonstone-dark/50 rounded-full outline-none slider"
          />
          <span className="text-white text-sm w-8">{brushSize}px</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <motion.button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-6 py-3 bg-cosmic-purple/80 text-white rounded-xl font-semibold hover:bg-cosmic-purple transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            Clear
          </motion.button>
          
          <motion.button
            onClick={downloadCanvas}
            className="flex items-center gap-2 px-6 py-3 bg-cosmic-blue/80 text-white rounded-xl font-semibold hover:bg-cosmic-blue transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            Save
          </motion.button>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mt-8 max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-moonstone-gray/80 text-sm leading-relaxed">
          Let your creativity flow freely. Draw whatever comes to mind - abstract patterns, 
          mandalas, or simple doodles. There&apos;s no wrong way to express yourself here.
        </p>
      </motion.div>
    </div>
  );
};

export default function CanvasPage() {
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
          Creative Canvas
        </motion.h1>
        
        <div className="w-32" /> {/* Spacer for centering */}
      </motion.header>

      {/* Game Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <DoodleCanvas />
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
