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
  const [running, setRunning] = useState<boolean>(true);
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

  const lockPiece = useCallback(() => {
    setBoard((prevBoard) => {
      const updatedBoard = [...prevBoard].map((row) => [...row]);

      currentPiece.shape.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
          if (cell !== 0) {
            const boardY = currentPiece.position.y + rowIdx;
            const boardX = currentPiece.position.x + colIdx;

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.code === "Space") {
        e.preventDefault();
        setRunning((prev) => !prev);
      }

      if (running) {
        if (e.key === "ArrowLeft") movePiece("left");
        if (e.key === "ArrowRight") movePiece("right");
        if (e.key === "ArrowDown") movePiece("down");
        if (e.key === "ArrowUp") rotatePiece();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [movePiece, rotatePiece, running, gameOver]);

  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      if (gameOver || !running) return;

      const elapsedTime = currentTime - lastAnimationFrame;
      if (elapsedTime > speed) {
        movePiece("down");
        setLastAnimationFrame(currentTime);
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [lastAnimationFrame, running, gameOver, speed, movePiece]);

  return (
    <div className="gameboard-container">
      <Controls
        running={running}
        setRunning={setRunning}
        clearedLines={clearedLines}
        level={level}
        gameOver={gameOver}
      />
      <div className="gameboard">
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
