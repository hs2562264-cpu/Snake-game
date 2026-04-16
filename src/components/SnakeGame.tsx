import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Focus the game container on mount to catch keyboard events
  useEffect(() => {
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ') {
      setIsPaused((p) => !p);
      return;
    }

    if (gameOver) {
      if (e.key === 'Enter') {
        resetGame();
      }
      return;
    }

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== 'DOWN') directionRef.current = 'UP';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== 'UP') directionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== 'RIGHT') directionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== 'LEFT') directionRef.current = 'RIGHT';
        break;
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        setDirection(currentDir);

        const newHead = { ...head };

        switch (currentDir) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, food, score, onScoreChange]);

  return (
    <div 
      ref={gameContainerRef}
      tabIndex={0}
      className="relative outline-none flex items-center justify-center w-full h-full"
    >
      <div 
        className="grid border border-[#333] relative"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: '400px',
          height: '400px',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((segment, i) => i !== 0 && segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`
                w-full h-full
                ${isSnakeHead ? 'bg-white shadow-[0_0_15px_#fff] z-10 rounded-[2px]' : ''}
                ${isSnakeBody ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] rounded-[2px]' : ''}
                ${isFood ? 'bg-[#ff00ff] shadow-[0_0_12px_#ff00ff] rounded-full' : ''}
              `}
            />
          );
        })}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <h2 className="text-4xl font-black text-[#ff00ff] tracking-widest uppercase mb-2 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]">
            System Failure
          </h2>
          <p className="text-[#00f2ff] font-mono text-lg mb-6">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-transparent border-2 border-[#00f2ff] text-[#00f2ff] font-mono font-bold uppercase tracking-wider hover:bg-[#00f2ff] hover:text-black transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:shadow-[0_0_25px_rgba(0,242,255,0.6)] rounded"
          >
            Reboot Sequence
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
          <h2 className="text-3xl font-black text-[#00f2ff] tracking-widest uppercase drop-shadow-[0_0_15px_rgba(0,242,255,0.8)] animate-pulse">
            Paused
          </h2>
        </div>
      )}
    </div>
  );
}
