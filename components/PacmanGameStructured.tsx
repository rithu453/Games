'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const maze = [
  '######################',
  '#..........##........#',
  '#.####.###.##.###.####',
  '#P..................P#',
  '#.####.#.######.#.####',
  '#......#...##...#....#',
  '######.###.##.###.####',
  '     #.#..........#   ',
  '######.#.###  ###.####',
  '#........#GGGG#......#',
  '######.#.######.#.####',
  '     #.#........#     ',
  '######.#.######.#.####',
  '#..........##........#',
  '#.####.###.##.###.####',
  '#...##.......F.......#',
  '###.##.#.######.#.##.#',
  '#......#...##...#....#',
  '#.##########.#########',
  '#S...................#',
  '######################',
];

const cellSize = 30;

type GhostMode = 'chase' | 'scatter' | 'frightened' | 'eaten';

interface GameState {
  pacmanPos: { x: number; y: number };
  direction: { x: number; y: number };
  nextDirection: { x: number; y: number };
  dots: Set<string>;
  powerPellets: Set<string>;
  ghosts: Array<{ 
    x: number; 
    y: number; 
    color: string;
    mode: GhostMode;
    targetPos: { x: number; y: number };
    scatterPos: { x: number; y: number };
  }>;
  score: number;
  gameOver: boolean;
  won: boolean;
  lives: number;
  powerMode: boolean;
  powerModeTimer: number;
  level: number;
  fruitsEaten: number;
  highScore: number;
  ghostModeTimer: number;
  ghostMode: 'scatter' | 'chase';
  tunnel: boolean;
}

function findPos(char: string) {
  for (let y = 0; y < maze.length; y++) {
    const x = maze[y].indexOf(char);
    if (x !== -1) return { x, y };
  }
  return { x: 1, y: 19 };
}

function initializeDots() {
  const dots = new Set<string>();
  const powerPellets = new Set<string>();
  
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = maze[y][x];
      if (cell === '.' || cell === 'S') {
        dots.add(`${x},${y}`);
      } else if (cell === 'P') {
        powerPellets.add(`${x},${y}`);
      }
    }
  }
  
  return { dots, powerPellets };
}

function initializeGhosts() {
  return [
    { 
      x: 9, y: 9, 
      color: '#ff0000', 
      mode: 'chase' as const,
      targetPos: { x: 1, y: 1 },
      scatterPos: { x: 1, y: 1 }
    },
    { 
      x: 10, y: 9, 
      color: '#ffb8ff', 
      mode: 'chase' as const,
      targetPos: { x: 20, y: 1 },
      scatterPos: { x: 20, y: 1 }
    },
    { 
      x: 11, y: 9, 
      color: '#00ffff', 
      mode: 'chase' as const,
      targetPos: { x: 1, y: 19 },
      scatterPos: { x: 1, y: 19 }
    },
    { 
      x: 12, y: 9, 
      color: '#ffb852', 
      mode: 'chase' as const,
      targetPos: { x: 20, y: 19 },
      scatterPos: { x: 20, y: 19 }
    },
  ];
}

// Enhanced 2D Pacman Game Canvas
function PacmanGameCanvas({ gameState }: { gameState: GameState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = maze[0].length * cellSize;
    canvas.height = maze.length * cellSize;

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze walls with enhanced styling
    ctx.fillStyle = '#1e40af';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 5;
    
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === '#') {
          const worldX = x * cellSize;
          const worldY = y * cellSize;
          
          ctx.fillRect(worldX, worldY, cellSize, cellSize);
          ctx.strokeRect(worldX, worldY, cellSize, cellSize);
        }
      }
    }
    ctx.shadowBlur = 0;

    // Draw dots with glow
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
    Array.from(gameState.dots).forEach(dotKey => {
      const [x, y] = dotKey.split(',').map(Number);
      const worldX = x * cellSize + cellSize / 2;
      const worldY = y * cellSize + cellSize / 2;
      
      ctx.beginPath();
      ctx.arc(worldX, worldY, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Draw power pellets with enhanced glow
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    Array.from(gameState.powerPellets).forEach(pelletKey => {
      const [x, y] = pelletKey.split(',').map(Number);
      const worldX = x * cellSize + cellSize / 2;
      const worldY = y * cellSize + cellSize / 2;
      
      ctx.beginPath();
      ctx.arc(worldX, worldY, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Draw Pacman with enhanced graphics
    const pacX = gameState.pacmanPos.x * cellSize + cellSize / 2;
    const pacY = gameState.pacmanPos.y * cellSize + cellSize / 2;
    
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    
    // Calculate mouth direction
    let startAngle = 0;
    let endAngle = Math.PI * 2;
    
    if (gameState.direction.x === 1) {
      startAngle = 0.2 * Math.PI;
      endAngle = 1.8 * Math.PI;
    } else if (gameState.direction.x === -1) {
      startAngle = 1.2 * Math.PI;
      endAngle = 0.8 * Math.PI;
    } else if (gameState.direction.y === -1) {
      startAngle = 1.7 * Math.PI;
      endAngle = 1.3 * Math.PI;
    } else if (gameState.direction.y === 1) {
      startAngle = 0.7 * Math.PI;
      endAngle = 0.3 * Math.PI;
    }
    
    ctx.arc(pacX, pacY, cellSize / 2 - 2, startAngle, endAngle);
    ctx.lineTo(pacX, pacY);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw ghosts with enhanced styling
    gameState.ghosts.forEach(ghost => {
      const ghostX = ghost.x * cellSize + cellSize / 2;
      const ghostY = ghost.y * cellSize + cellSize / 2;
      
      const ghostColor = gameState.powerMode ? '#0066ff' : ghost.color;
      ctx.fillStyle = ghostColor;
      ctx.shadowColor = ghostColor;
      ctx.shadowBlur = 10;
      
      // Ghost body
      ctx.beginPath();
      ctx.arc(ghostX, ghostY - 2, cellSize / 2 - 2, Math.PI, 0);
      ctx.rect(ghostX - (cellSize / 2 - 2), ghostY - 2, cellSize - 4, cellSize / 2);
      ctx.fill();
      
      // Ghost bottom wavy part
      ctx.beginPath();
      ctx.moveTo(ghostX - (cellSize / 2 - 2), ghostY + cellSize / 2 - 2);
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(
          ghostX - (cellSize / 2 - 2) + (i + 0.5) * (cellSize - 4) / 4,
          ghostY + cellSize / 2 - 6
        );
        ctx.lineTo(
          ghostX - (cellSize / 2 - 2) + (i + 1) * (cellSize - 4) / 4,
          ghostY + cellSize / 2 - 2
        );
      }
      ctx.fill();
      
      // Ghost eyes
      ctx.fillStyle = 'white';
      ctx.shadowBlur = 0;
      ctx.fillRect(ghostX - 6, ghostY - 6, 4, 6);
      ctx.fillRect(ghostX + 2, ghostY - 6, 4, 6);
      
      ctx.fillStyle = 'black';
      ctx.fillRect(ghostX - 5, ghostY - 4, 2, 3);
      ctx.fillRect(ghostX + 3, ghostY - 4, 2, 3);
    });
    ctx.shadowBlur = 0;

  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-white/20 rounded-xl bg-black/20"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}

// Main Pacman Game Component
export default function PacmanGame2D() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const { dots, powerPellets } = initializeDots();
    return {
      pacmanPos: findPos('S'),
      direction: { x: 0, y: 0 },
      nextDirection: { x: 0, y: 0 },
      dots: new Set(dots),
      powerPellets: new Set(powerPellets),
      ghosts: initializeGhosts(),
      score: 0,
      gameOver: false,
      won: false,
      lives: 3,
      powerMode: false,
      powerModeTimer: 0,
      level: 1,
      fruitsEaten: 0,
      highScore: typeof window !== 'undefined' && localStorage.getItem('pacman-high-score') ? parseInt(localStorage.getItem('pacman-high-score')!) : 0,
      ghostModeTimer: 7000, // 7 seconds in chase mode initially
      ghostMode: 'chase' as const,
      tunnel: false,
    };
  });

  const [gameRunning, setGameRunning] = useState(false);

  // Game logic functions
  const isValidMove = (x: number, y: number) => {
    if (y < 0 || y >= maze.length || x < 0 || x >= maze[y].length) {
      return false;
    }
    return maze[y][x] !== '#';
  };

  // Enhanced ghost AI inspired by Google Pacman
  const updateGhostTargets = () => {
    setGameState(prev => ({
      ...prev,
      ghosts: prev.ghosts.map((ghost, index) => {
        let targetPos = ghost.scatterPos;
        
        if (prev.ghostMode === 'chase' && !prev.powerMode) {
          switch (index) {
            case 0: // Red ghost (Blinky) - targets Pacman directly
              targetPos = { x: prev.pacmanPos.x, y: prev.pacmanPos.y };
              break;
            case 1: // Pink ghost (Pinky) - targets 4 tiles ahead of Pacman
              targetPos = {
                x: prev.pacmanPos.x + prev.direction.x * 4,
                y: prev.pacmanPos.y + prev.direction.y * 4
              };
              break;
            case 2: // Cyan ghost (Inky) - complex targeting
              const redGhost = prev.ghosts[0];
              const aheadPos = {
                x: prev.pacmanPos.x + prev.direction.x * 2,
                y: prev.pacmanPos.y + prev.direction.y * 2
              };
              targetPos = {
                x: aheadPos.x + (aheadPos.x - redGhost.x),
                y: aheadPos.y + (aheadPos.y - redGhost.y)
              };
              break;
            case 3: // Orange ghost (Clyde) - distance-based behavior
              const distance = Math.sqrt(
                Math.pow(ghost.x - prev.pacmanPos.x, 2) + 
                Math.pow(ghost.y - prev.pacmanPos.y, 2)
              );
              targetPos = distance > 8 
                ? { x: prev.pacmanPos.x, y: prev.pacmanPos.y }
                : ghost.scatterPos;
              break;
          }
        }
        
        return { ...ghost, targetPos };
      })
    }));
  };

  const moveGhosts = () => {
    setGameState(prev => ({
      ...prev,
      ghosts: prev.ghosts.map(ghost => {
        const directions = [
          { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
        ];
        
        const validMoves = directions.filter(dir => 
          isValidMove(ghost.x + dir.x, ghost.y + dir.y)
        );
        
        if (validMoves.length === 0) return ghost;
        
        // Choose move based on target (inspired by Google Pacman AI)
        let bestMove = validMoves[0];
        let bestDistance = Infinity;
        
        if (prev.powerMode) {
          // Run away from Pacman when frightened
          validMoves.forEach(move => {
            const newX = ghost.x + move.x;
            const newY = ghost.y + move.y;
            const distance = Math.sqrt(
              Math.pow(newX - prev.pacmanPos.x, 2) + 
              Math.pow(newY - prev.pacmanPos.y, 2)
            );
            if (distance > bestDistance) {
              bestDistance = distance;
              bestMove = move;
            }
          });
        } else {
          // Move towards target
          validMoves.forEach(move => {
            const newX = ghost.x + move.x;
            const newY = ghost.y + move.y;
            const distance = Math.sqrt(
              Math.pow(newX - ghost.targetPos.x, 2) + 
              Math.pow(newY - ghost.targetPos.y, 2)
            );
            if (distance < bestDistance) {
              bestDistance = distance;
              bestMove = move;
            }
          });
        }
        
        return {
          ...ghost,
          x: ghost.x + bestMove.x,
          y: ghost.y + bestMove.y,
          mode: prev.powerMode ? 'frightened' : prev.ghostMode as 'chase' | 'scatter'
        };
      }),
    }));
  };

  const checkCollisions = () => {
    setGameState(prev => {
      const pacKey = `${prev.pacmanPos.x},${prev.pacmanPos.y}`;
      const newState = { ...prev };
      
      // Check dot collection with enhanced feedback
      if (newState.dots.has(pacKey)) {
        newState.dots = new Set(newState.dots);
        newState.dots.delete(pacKey);
        newState.score += 10;
        
        // Visual feedback for dot collection (could add sound here)
        // TODO: Add dot collection sound effect
        
        // Show fruit after certain dots eaten (inspired by Google Pacman)
        const dotsEaten = 244 - newState.dots.size; // Total dots minus remaining
        if (dotsEaten === 70 || dotsEaten === 170) {
          // TODO: Add fruit spawning logic here
          console.log('Fruit should appear!');
        }
        
        if (newState.dots.size === 0) {
          newState.won = true;
          // Level progression with Google Pacman inspired mechanics
          newState.level += 1;
          const levelBonus = newState.level * 100;
          newState.score += levelBonus;
          
          // Auto-start next level after a brief pause (inspired by Google Pacman)
          setTimeout(() => {
            const { dots, powerPellets } = initializeDots();
            setGameState(prev => ({
              ...prev,
              won: false,
              dots,
              powerPellets,
              pacmanPos: findPos('S'),
              ghosts: initializeGhosts(),
              direction: { x: 0, y: 0 },
              nextDirection: { x: 0, y: 0 },
              powerMode: false,
              powerModeTimer: 0,
              ghostMode: 'scatter',
              ghostModeTimer: 7000, // Start with scatter mode
              lives: Math.min(prev.lives + 1, 5), // Bonus life every level (max 5)
            }));
          }, 3000); // 3 second pause to show victory screen
        }
      }
      
      // Check power pellet collection
      if (newState.powerPellets.has(pacKey)) {
        newState.powerPellets = new Set(newState.powerPellets);
        newState.powerPellets.delete(pacKey);
        newState.score += 50;
        newState.powerMode = true;
        newState.powerModeTimer = 8000; // 8 seconds power mode
      }
      
      // Check fruit collection (F in maze)
      if (maze[prev.pacmanPos.y] && maze[prev.pacmanPos.y][prev.pacmanPos.x] === 'F') {
        newState.fruitsEaten += 1;
        newState.score += 100 * newState.level; // Fruit value increases with level
      }
      
      // Check ghost collisions with enhanced logic
      const ghostCollision = newState.ghosts.find(ghost => 
        ghost.x === newState.pacmanPos.x && ghost.y === newState.pacmanPos.y
      );
      
      if (ghostCollision) {
        if (newState.powerMode && ghostCollision.mode === 'frightened') {
          // Eat ghost - award points based on sequence (Google Pacman scoring)
          const ghostsEaten = newState.ghosts.filter(g => g.mode === 'eaten').length;
          const ghostScore = 200 * Math.pow(2, ghostsEaten); // 200, 400, 800, 1600
          newState.score += ghostScore;
          
          // TODO: Add ghost eating sound effect
          console.log(`Ghost eaten! +${ghostScore} points`);
          
          // Mark ghost as eaten and send to center
          const ghostIndex = newState.ghosts.indexOf(ghostCollision);
          newState.ghosts[ghostIndex] = {
            ...ghostCollision,
            x: 10 + ghostIndex,
            y: 9,
            mode: 'eaten' // Special mode for eaten ghosts
          };
          
          // Reset ghost to normal mode after delay
          setTimeout(() => {
            setGameState(prev => ({
              ...prev,
              ghosts: prev.ghosts.map((ghost, idx) => 
                idx === ghostIndex ? { ...ghost, mode: prev.ghostMode } : ghost
              )
            }));
          }, 3000); // 3 seconds to respawn
          
        } else if (ghostCollision.mode !== 'frightened' && ghostCollision.mode !== 'eaten') {
          // Normal collision - lose life
          newState.lives -= 1;
          if (newState.lives <= 0) {
            newState.gameOver = true;
            // Use setTimeout to call handleGameOver after state update
            setTimeout(() => handleGameOver(), 0);
          } else {
            // Reset positions
            newState.pacmanPos = findPos('S');
            newState.direction = { x: 0, y: 0 };
            newState.nextDirection = { x: 0, y: 0 };
            newState.ghosts = initializeGhosts();
            newState.powerMode = false;
            newState.powerModeTimer = 0;
          }
        }
      }
      
      return newState;
    });
  };

  const movePacman = (dx: number, dy: number) => {
    setGameState(prev => {
      const newX = prev.pacmanPos.x + dx;
      const newY = prev.pacmanPos.y + dy;
      
      if (isValidMove(newX, newY)) {
        return {
          ...prev,
          pacmanPos: { x: newX, y: newY },
          direction: { x: dx, y: dy },
          nextDirection: { x: dx, y: dy },
        };
      }
      
      return {
        ...prev,
        nextDirection: { x: dx, y: dy },
      };
    });
  };

  // Game loop with enhanced timing and features
  useEffect(() => {
    if (!gameRunning || gameState.gameOver || gameState.won) return;

    const gameLoop = setInterval(() => {
      // Update ghost targets first
      updateGhostTargets();
      
      // Move pacman in current direction
      setGameState(prev => {
        if (prev.nextDirection.x !== 0 || prev.nextDirection.y !== 0) {
          const newX = prev.pacmanPos.x + prev.nextDirection.x;
          const newY = prev.pacmanPos.y + prev.nextDirection.y;
          
          if (isValidMove(newX, newY)) {
            return {
              ...prev,
              pacmanPos: { x: newX, y: newY },
              direction: prev.nextDirection,
            };
          }
        }
        return prev;
      });

      // Move ghosts
      moveGhosts();
      
      // Check collisions
      checkCollisions();
      
      // Update timers
      setGameState(prev => {
        const newState = { ...prev };
        
        // Power mode timer
        if (newState.powerMode && newState.powerModeTimer > 0) {
          const newTimer = newState.powerModeTimer - 120;
          newState.powerModeTimer = newTimer;
          newState.powerMode = newTimer > 0;
        }
        
        // Ghost mode switching timer (inspired by Google Pacman)
        if (!newState.powerMode) {
          newState.ghostModeTimer -= 120;
          if (newState.ghostModeTimer <= 0) {
            // Switch between chase and scatter modes
            if (newState.ghostMode === 'chase') {
              newState.ghostMode = 'scatter';
              newState.ghostModeTimer = 5000; // 5 seconds scatter
            } else {
              newState.ghostMode = 'chase';
              newState.ghostModeTimer = 20000; // 20 seconds chase
            }
          }
        }
        
        return newState;
      });
    }, 120); // Faster for more responsive gameplay

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameState.gameOver, gameState.won]);

  // Controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!gameRunning && !gameState.gameOver && !gameState.won) {
        return;
      }
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePacman(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePacman(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePacman(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePacman(1, 0);
          break;
        case ' ':
          e.preventDefault();
          if (gameState.gameOver || gameState.won) {
            resetGame();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameRunning, gameState]);

  // High score management inspired by Google Pacman
  const updateHighScore = useCallback(() => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.score, prev.highScore);
      if (newHighScore > prev.highScore) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('pacman-high-score', newHighScore.toString());
        }
        return { ...prev, highScore: newHighScore };
      }
      return prev;
    });
  }, []);

  // Enhanced game over logic
  const handleGameOver = useCallback(() => {
    updateHighScore();
  }, [updateHighScore]);

  const resetGame = () => {
    const { dots, powerPellets } = initializeDots();
    const newScore = gameState.score;
    const newHighScore = Math.max(gameState.highScore, newScore);
    if (newHighScore > gameState.highScore) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pacman-high-score', newHighScore.toString());
      }
    }
    
    setGameState({
      pacmanPos: findPos('S'),
      direction: { x: 0, y: 0 },
      nextDirection: { x: 0, y: 0 },
      dots: new Set(dots),
      powerPellets: new Set(powerPellets),
      ghosts: initializeGhosts(),
      score: 0,
      gameOver: false,
      won: false,
      lives: 3,
      powerMode: false,
      powerModeTimer: 0,
      level: 1,
      fruitsEaten: 0,
      highScore: newHighScore,
      ghostModeTimer: 7000,
      ghostMode: 'chase',
      tunnel: false,
    });
    setGameRunning(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-deep-slate via-moonstone-gray to-cosmic-purple relative overflow-hidden">
      {/* Main Game Container */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Game Board Section */}
          <motion.div
            className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
              {/* Game Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <motion.h1
                    className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent mb-2"
                    animate={{ 
                      textShadow: gameState.powerMode 
                        ? ["0 0 10px #ffff00", "0 0 20px #ffff00", "0 0 10px #ffff00"]
                        : "0 0 10px rgba(255, 255, 0, 0.3)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Mindful Pac-Man
                  </motion.h1>
                  <p className="text-white/80 text-lg">
                    Collect positive thoughts, avoid negativity
                  </p>
                </div>
                
                {/* Game Stats */}
                <div className="text-right space-y-1">
                  <div className="text-yellow-400 font-bold text-2xl">
                    Score: {gameState.score.toLocaleString()}
                  </div>
                  <div className="text-pink-400 text-lg">
                    High: {gameState.highScore.toLocaleString()}
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <span className="text-white/80">Lives:</span>
                    <div className="flex space-x-1">
                      {Array.from({length: gameState.lives}, (_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">🟡</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Live Game Status */}
                {gameState.powerMode && (
                  <motion.div
                    className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-blue-400/30"
                    animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <div className="text-blue-400 font-bold text-lg flex items-center gap-2">
                      ⚡ POWER MODE
                      <span className="text-sm">
                        {Math.ceil(gameState.powerModeTimer / 1000)}s
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Canvas Container */}
              <div className="relative bg-black/20 rounded-2xl p-4 border border-white/10 flex justify-center">
                <PacmanGameCanvas gameState={gameState} />
                
                {/* Game Status Overlays */}
                <AnimatePresence mode="wait">
                  {!gameRunning && !gameState.gameOver && !gameState.won && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-md">
                        <motion.div
                          className="text-6xl mb-4"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🧘
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin?</h2>
                        <p className="text-white/80 mb-6">
                          Use WASD or Arrow keys to guide your mindful journey through positive thoughts.
                        </p>
                        <motion.button
                          className="px-8 py-3 bg-aurora-green/80 hover:bg-aurora-green text-white rounded-full font-semibold transition-all"
                          onClick={() => setGameRunning(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Start Journey
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {gameState.won && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-md">
                        <motion.div
                          className="text-6xl mb-4"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          🎉
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-4">Mindful Victory!</h2>
                        <p className="text-white/80 mb-4">
                          You&apos;ve successfully collected all positive thoughts and achieved inner peace!
                        </p>
                        <div className="space-y-2 mb-6">
                          <p className="text-yellow-400 font-bold text-2xl">Final Score: {gameState.score.toLocaleString()}</p>
                          <p className="text-pink-400 font-bold text-lg">High Score: {gameState.highScore.toLocaleString()}</p>
                          <p className="text-cyan-400">Level Completed: {gameState.level}</p>
                          <p className="text-orange-400">Fruits Eaten: {gameState.fruitsEaten}</p>
                          <p className="text-green-400">Perfect Clear! All 244 dots collected</p>
                          <p className="text-purple-400">Level Bonus: +{gameState.level * 100} points</p>
                        </div>
                        <p className="text-white/60 text-sm">Press SPACE to start a new journey</p>
                      </div>
                    </motion.div>
                  )}

                  {gameState.gameOver && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-md">
                        <motion.div
                          className="text-6xl mb-4"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          😔
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-4">Mindful Reflection</h2>
                        <p className="text-white/80 mb-4">
                          The negative thoughts caught up with you. Take a breath and try again with renewed focus.
                        </p>
                        <div className="space-y-2 mb-6">
                          <p className="text-yellow-400 font-bold text-2xl">Final Score: {gameState.score.toLocaleString()}</p>
                          <p className="text-pink-400 font-bold text-lg">High Score: {gameState.highScore.toLocaleString()}</p>
                          <p className="text-cyan-400">Level Reached: {gameState.level}</p>
                          <p className="text-orange-400">Fruits Eaten: {gameState.fruitsEaten}</p>
                          <p className="text-green-400">Dots Collected: {244 - gameState.dots.size}</p>
                        </div>
                        <p className="text-white/60 text-sm">Press SPACE to restart your journey</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
        </div>
      </div>

      {/* Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              y: [-50, -100],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
