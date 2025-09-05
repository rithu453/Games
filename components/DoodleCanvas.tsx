'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const palette = [
  { color: '#10b981', name: 'Aurora Green', category: 'nature' },
  { color: '#3b82f6', name: 'Sky Blue', category: 'sky' },
  { color: '#8b5cf6', name: 'Cosmic Purple', category: 'cosmic' },
  { color: '#f59e0b', name: 'Ember Orange', category: 'fire' },
  { color: '#ef4444', name: 'Ruby Red', category: 'earth' },
  { color: '#06b6d4', name: 'Ocean Cyan', category: 'water' },
  { color: '#84cc16', name: 'Forest Green', category: 'nature' },
  { color: '#f97316', name: 'Sunset Orange', category: 'fire' },
  { color: '#ec4899', name: 'Rose Pink', category: 'flower' },
  { color: '#6366f1', name: 'Indigo Dream', category: 'cosmic' },
  { color: '#000000', name: 'Deep Night', category: 'shadow' },
  { color: '#ffffff', name: 'Pure Light', category: 'light' },
];

const brushTypes = [
  { name: 'Flowing Ink', type: 'ink', size: [2, 20], opacity: [0.7, 1] },
  { name: 'Soft Watercolor', type: 'watercolor', size: [10, 50], opacity: [0.3, 0.8] },
  { name: 'Charcoal', type: 'charcoal', size: [5, 30], opacity: [0.8, 1] },
  { name: 'Glowing Plasma', type: 'glow', size: [3, 25], opacity: [0.6, 1] },
  { name: 'Fine Pencil', type: 'pencil', size: [1, 8], opacity: [0.9, 1] },
];

interface DrawPoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export default function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawPoint[]>([]);
  
  // Tool states
  const [selectedColor, setSelectedColor] = useState(palette[0]);
  const [selectedBrush, setSelectedBrush] = useState(brushTypes[0]);
  const [brushSize, setBrushSize] = useState(12);
  const [brushOpacity, setBrushOpacity] = useState(0.8);
  
  // UI states
  const [isErasing, setIsErasing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [canvasBackground, setCanvasBackground] = useState('paper');

  // Canvas backgrounds
  const backgrounds = {
    paper: '#fefefe',
    cosmic: '#0f0f23',
    warm: '#fef7ed',
    forest: '#064e3b',
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    // Set initial background
    context.fillStyle = backgrounds[canvasBackground as keyof typeof backgrounds];
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasBackground]);

  const getPointerPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const applyBrushEffect = useCallback((
    ctx: CanvasRenderingContext2D,
    point: DrawPoint,
    prevPoint?: DrawPoint
  ) => {
    const { x, y, pressure } = point;
    const dynamicSize = brushSize * (0.5 + pressure * 0.5);
    const dynamicOpacity = brushOpacity * (0.7 + pressure * 0.3);

    ctx.globalAlpha = dynamicOpacity;

    switch (selectedBrush.type) {
      case 'watercolor':
        // Watercolor effect with multiple layers
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = dynamicOpacity * (0.3 - i * 0.1);
          ctx.beginPath();
          ctx.arc(x, y, dynamicSize + i * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'glow':
        // Glowing effect
        ctx.shadowColor = selectedColor.color;
        ctx.shadowBlur = dynamicSize * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, dynamicSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;

      case 'charcoal':
        // Textured charcoal effect
        for (let i = 0; i < 5; i++) {
          ctx.globalAlpha = dynamicOpacity * Math.random() * 0.3;
          const offsetX = (Math.random() - 0.5) * dynamicSize * 0.3;
          const offsetY = (Math.random() - 0.5) * dynamicSize * 0.3;
          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, dynamicSize * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'ink':
        // Flowing ink effect
        if (prevPoint) {
          ctx.lineWidth = dynamicSize;
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, dynamicSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'pencil':
        // Precise pencil effect
        ctx.lineWidth = dynamicSize;
        if (prevPoint) {
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        break;

      default:
        ctx.beginPath();
        ctx.arc(x, y, dynamicSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [selectedBrush, selectedColor, brushSize, brushOpacity]);

  const startDrawing = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    setDrawing(true);
    const pos = getPointerPos(e);
    const point: DrawPoint = {
      x: pos.x,
      y: pos.y,
      pressure: (e as any).pressure || 0.5,
      timestamp: Date.now(),
    };

    setCurrentPath([point]);

    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = selectedBrush.type === 'glow' ? 'lighter' : 'source-over';
      ctx.fillStyle = selectedColor.color;
      ctx.strokeStyle = selectedColor.color;
      applyBrushEffect(ctx, point);
    }
  }, [getPointerPos, applyBrushEffect, isErasing, selectedColor, selectedBrush, brushSize]);

  const draw = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const ctx = contextRef.current;
    if (!ctx) return;

    const pos = getPointerPos(e);
    const point: DrawPoint = {
      x: pos.x,
      y: pos.y,
      pressure: (e as any).pressure || 0.5,
      timestamp: Date.now(),
    };

    setCurrentPath(prev => {
      const newPath = [...prev, point];
      const prevPoint = prev[prev.length - 1];

      if (isErasing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalCompositeOperation = selectedBrush.type === 'glow' ? 'lighter' : 'source-over';
        ctx.fillStyle = selectedColor.color;
        ctx.strokeStyle = selectedColor.color;
        applyBrushEffect(ctx, point, prevPoint);
      }

      return newPath;
    });
  }, [drawing, getPointerPos, applyBrushEffect, isErasing, selectedColor, selectedBrush, brushSize]);

  const stopDrawing = useCallback(() => {
    setDrawing(false);
    setCurrentPath([]);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgrounds[canvasBackground as keyof typeof backgrounds];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setShowClearConfirm(false);
  }, [canvasBackground]);

  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `soul-canvas-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-deep-slate to-cosmic-purple relative overflow-hidden">
      {/* Canvas */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden shadow-ethereal">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair touch-none"
            style={{ 
              touchAction: 'none',
              background: backgrounds[canvasBackground as keyof typeof backgrounds]
            }}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>
      </div>

      {/* UI Controls - Only show if not in zen mode */}
      <AnimatePresence>
        {!zenMode && (
          <>
            {/* Top toolbar */}
            <motion.div
              className="absolute top-6 left-6 right-6 flex justify-between items-start z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Title */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <h1 className="text-2xl font-bold text-white">Soul Canvas</h1>
                <p className="text-white/70 text-sm">Express freely without judgment</p>
              </div>

              {/* Background selector */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <div className="flex gap-2">
                  {Object.entries(backgrounds).map(([name, color]) => (
                    <motion.button
                      key={name}
                      className={`w-8 h-8 rounded-full border-2 ${
                        canvasBackground === name ? 'border-white scale-110' : 'border-white/30'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCanvasBackground(name)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Left toolbar - Brushes */}
            <motion.div
              className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-4">
                <h3 className="text-white font-semibold text-sm">Brushes</h3>
                {brushTypes.map((brush) => (
                  <motion.button
                    key={brush.name}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedBrush.name === brush.name
                        ? 'bg-aurora-green text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                    onClick={() => setSelectedBrush(brush)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-xs font-medium">{brush.name}</div>
                  </motion.button>
                ))}
                
                {/* Eraser */}
                <motion.button
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    isErasing
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  onClick={() => setIsErasing(!isErasing)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-xs font-medium">Eraser</div>
                </motion.button>
              </div>
            </motion.div>

            {/* Right toolbar - Colors */}
            <motion.div
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-semibold text-sm mb-4">Colors</h3>
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {palette.map((color) => (
                    <motion.button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor.name === color.name ? 'border-white scale-110' : 'border-white/30'
                      }`}
                      style={{ backgroundColor: color.color }}
                      onClick={() => setSelectedColor(color)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bottom toolbar - Controls */}
            <motion.div
              className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {/* Brush settings */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-white text-xs block mb-1">Size</label>
                    <input
                      type="range"
                      min={selectedBrush.size[0]}
                      max={selectedBrush.size[1]}
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20"
                    />
                    <div className="text-white/70 text-xs mt-1">{brushSize}px</div>
                  </div>
                  <div>
                    <label className="text-white text-xs block mb-1">Opacity</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={brushOpacity}
                      onChange={(e) => setBrushOpacity(Number(e.target.value))}
                      className="w-20"
                    />
                    <div className="text-white/70 text-xs mt-1">{Math.round(brushOpacity * 100)}%</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  className="px-6 py-3 bg-aurora-green hover:bg-aurora-green/80 text-white rounded-full font-semibold transition-all shadow-glow"
                  onClick={saveCanvas}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💾 Save Art
                </motion.button>
                
                <motion.button
                  className="px-6 py-3 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white rounded-full font-semibold transition-all"
                  onClick={() => setZenMode(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🧘 Zen Mode
                </motion.button>
                
                <motion.button
                  className="px-6 py-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full font-semibold transition-all"
                  onClick={() => setShowClearConfirm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🗑️ Clear
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Zen mode exit button */}
      <AnimatePresence>
        {zenMode && (
          <motion.button
            className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20 text-white transition-all"
            onClick={() => setZenMode(false)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        )}
      </AnimatePresence>

      {/* Clear confirmation modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-ethereal border border-white/50 text-center max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-deep-slate mb-4">Clear Your Canvas?</h3>
              <p className="text-deep-slate/70 mb-6">
                This will permanently erase your current creation. This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all"
                  onClick={clearCanvas}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes, Clear It
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-white/50 hover:bg-white/70 text-deep-slate rounded-full font-semibold transition-all"
                  onClick={() => setShowClearConfirm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Keep Creating
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
