import { useState, useEffect, useCallback } from "react";
import type { TBoard } from "../types/board";
import type { TTetromino } from "../types/tetromino";
import { getRandomTetromino, rotateTetromino } from "../utils/tetromino";
import {
  createEmptyBoard,
  checkCollision,
  clearFullLines,
} from "../utils/board";
import { calculateSpeed } from "../utils/game";
import PreviewPiece from "./PreviewPiece";
import Controls from "./Controls";
import "./gameboard.css";

const GameBoard: React.FC = () => {
  const [board, setBoard] = useState<TBoard>(createEmptyBoard());
  const [speed, setSpeed] = useState<number>(1000);
  const [level, setLevel] = useState<number>(1);
  const [lastAnimationFrame, setLastAnimationFrame] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [clearedLines, setClearedLines] = useState<number>(0);
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

  const togglePause = () => {
    if (!running) return; // Can't pause if the game isn't running
    setPaused((prev) => !prev);
  };

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
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

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

  return (
    <div className="gameboard-container">
      <Controls
        running={running}
        setRunning={setRunning}
        clearedLines={clearedLines}
        level={level}
        gameOver={gameOver}
      />

      {!running && gameOver && (
        <button className="start-button" onClick={handleStartGame}>
          Start Game
        </button>
      )}

      {running && (
        <div className="game-controls">
          <button className="pause-button" onClick={togglePause}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button className="reset-button" onClick={resetGame}>
            Reset
          </button>
        </div>
      )}

      <div className={`gameboard ${paused ? "paused" : ""}`}>
        {board.map((row, i) =>
          row.map((cell, j) => {
            const isCurrentPieceCell = currentPiece.shape.some((r, p) =>
              r.some(
                (value, c) =>
                  value !== 0 &&
                  currentPiece.position.y + p === i &&
                  currentPiece.position.x + c === j
              )
            );

            return (
              <div
                key={`${i}-${j}`}
                className="cell"
                style={{
                  backgroundColor: isCurrentPieceCell
                    ? currentPiece.color
                    : cell ?? "transparent",
                }}
              ></div>
            );
          })
        )}
      </div>
      <PreviewPiece shape={nextPiece.shape} color={nextPiece.color} />
    </div>
  );
};

export default GameBoard;
