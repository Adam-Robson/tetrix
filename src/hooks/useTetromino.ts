import { useState, useEffect, useCallback } from "react";
import type { TTetromino } from "../types/tetromino";
import { getRandomTetromino, rotateTetromino } from "../utils/tetromino";
import { TBoard } from "../types/board";
import {
  checkCollision,
  createEmptyBoard,
  clearFullLines,
} from "../utils/board";
import { calculateSpeed } from "../utils/game";

export default function useTetromino() {
  const [board, setBoard] = useState<TBoard>(createEmptyBoard());
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1000);
  const [paused, setPaused] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [clearedLines, setClearedLines] = useState<number>(0);
  const [lastAnimationFrame, setLastAnimationFrame] = useState<number>(0);
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    color: string;
    position: { x: number; y: number };
  }>({ ...getRandomTetromino(), position: { x: 4, y: 0 } });
  const [nextPiece, setNextPiece] = useState<Omit<TTetromino, "position">>(
    getRandomTetromino()
  );

  const resetGame = () => {
    // Reset game to initial state
    setBoard(createEmptyBoard());
    setSpeed(1000);
    setLevel(1);
    setLastAnimationFrame(0);
    setRunning(false);
    setPaused(false);
    setGameOver(false);
    setClearedLines(0);
    setCurrentPiece({ ...getRandomTetromino(), position: { x: 4, y: 0 } });
    setNextPiece(getRandomTetromino());
  };

  const handleStartGame = () => {
    setRunning(true);
    setPaused(false);
    setGameOver(false);
    setBoard(createEmptyBoard());
    setCurrentPiece({ ...getRandomTetromino(), position: { x: 4, y: 0 } });
    setNextPiece(getRandomTetromino());
    setClearedLines(0);
    setLevel(1);
    setSpeed(1000);
  };

  function togglePause() {
    if (!running) return;
    setPaused((prev) => !prev);
  }

  const lockPiece = useCallback(() => {
    setBoard((prevBoard) => {
      const updatedBoard = [...prevBoard].map((row) => [...row]);

      currentPiece.shape.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell !== 0) {
            const boardY = currentPiece.position.y + i;
            const boardX = currentPiece.position.x + j;

            if (
              boardY >= 0 &&
              boardY < updatedBoard.length &&
              boardX >= 0 &&
              boardX < updatedBoard[0].length
            ) {
              updatedBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });

      const { newBoard, clearedRows } = clearFullLines(updatedBoard);
      setClearedLines((prev) => {
        const totalCleared = prev + clearedRows;
        if (Math.floor(totalCleared / 10) > level - 1) {
          setLevel((prevLevel) => prevLevel + 1);
          setSpeed(calculateSpeed(level + 1));
        }
        return totalCleared;
      });

      return newBoard;
    });

    const newPiece = {
      ...nextPiece,
      position: { x: 4, y: 0 },
    };

    if (checkCollision(newPiece.shape, board, newPiece.position)) {
      setGameOver(true);
      return;
    }

    setCurrentPiece(newPiece);
    setNextPiece(getRandomTetromino());
  }, [board, currentPiece, nextPiece, level]);

  const movePiece = useCallback(
    (direction: "left" | "right" | "down") => {
      setCurrentPiece((prev) => {
        const newPosition = { ...prev.position };
        if (direction === "left") newPosition.x -= 1;
        if (direction === "right") newPosition.x += 1;
        if (direction === "down") newPosition.y += 1;

        if (!checkCollision(prev.shape, board, newPosition)) {
          return { ...prev, position: newPosition };
        }

        if (direction === "down") lockPiece();
        return prev;
      });
    },
    [board, lockPiece]
  );

  const rotatePiece = useCallback(() => {
    setCurrentPiece((prev) => {
      const rotatedShape = rotateTetromino(prev.shape);
      if (!checkCollision(rotatedShape, board, prev.position)) {
        return { ...prev, shape: rotatedShape };
      }
      return prev;
    });
  }, [board]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (running) setPaused((prev) => !prev);
      }

      if (running && !paused) {
        e.preventDefault();
        if (e.key === "ArrowLeft") movePiece("left");
        if (e.key === "ArrowRight") movePiece("right");
        if (e.key === "ArrowDown") movePiece("down");
        if (e.key === "ArrowUp") rotatePiece();
      }
    },
    [gameOver, running, paused, movePiece, rotatePiece]
  );

  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      if (gameOver || !running || paused) return;

      const elapsedTime = currentTime - lastAnimationFrame;
      if (elapsedTime > speed) {
        movePiece("down");
        setLastAnimationFrame(currentTime);
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [lastAnimationFrame, running, gameOver, speed, paused, movePiece]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    board,
    level,
    score,
    speed,
    paused,
    running,
    gameOver,
    clearedLines,
    lastAnimationFrame,
    currentPiece,
    nextPiece,
    resetGame,
    handleStartGame,
    setBoard,
    setLevel,
    setScore,
    setSpeed,
    setPaused,
    setRunning,
    setGameOver,
    setClearedLines,
    setLastAnimationFrame,
    setCurrentPiece,
    setNextPiece,
    togglePause,
    lockPiece,
    movePiece,
    rotatePiece,
    handleKeyPress,
  };
}
