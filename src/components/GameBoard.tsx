import { useState, useEffect, useCallback } from "react";
import type { TBoard } from "../types/board";
import type { TTetromino } from "../types/tetromino";
import { getRandomTetromino, rotateTetromino } from "../utils/tetromino";
import { createEmptyBoard } from "../utils/board";
import { checkCollision } from "../utils/board";
import { clearFullLines } from "../utils/board";
import { calculateSpeed } from "../utils/game";
import PreviewPiece from "./PreviewPiece";
import "./gameboard.css";

export default function GameBoard() {
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
      const updatedGameBoard = [...prevBoard].map((row) => [...row]); // Deep copy

      currentPiece.shape.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell !== 0) {
            const boardY = currentPiece.position.y + i;
            const boardX = currentPiece.position.x + j;

            if (
              boardY >= 0 &&
              boardY < updatedGameBoard.length &&
              boardX >= 0 &&
              boardX < updatedGameBoard[0].length
            ) {
              updatedGameBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });

      try {
        const { newBoard, clearedRows } = clearFullLines(updatedGameBoard);
        setClearedLines((prevLines) => {
          const totalClearedLines = prevLines + clearedRows;

          if (Math.floor(totalClearedLines / 10) > level - 1) {
            setLevel((prevLevel) => prevLevel + 1);
            setSpeed(calculateSpeed(level + 1)); // Adjust speed based on new level
          }

          return totalClearedLines;
        });
        return newBoard;
      } catch (error) {
        console.error("Error clearing full lines:", error);
        return prevBoard;
      }
    });

    const newPiece = {
      ...nextPiece,
      position: {
        x: 4,
        y: 0,
      },
    };

    if (checkCollision(newPiece.shape, board, newPiece.position)) {
      setGameOver(true);
      return;
    }
    setCurrentPiece(newPiece);
    setNextPiece(getRandomTetromino());
  }, [level, board, currentPiece, nextPiece]);

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

        if (direction === "down") {
          lockPiece();
        }

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
      return prev; // Revert to previous state if collision occurs
    });
  }, [board]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      if (gameOver || !running) return;

      if (e.key === "ArrowLeft") movePiece("left");
      if (e.key === "ArrowRight") movePiece("right");
      if (e.key === "ArrowDown") movePiece("down");
      if (e.key === "ArrowUp") rotatePiece();
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
    <>
      <div className="gameboard">
        {board.map((row, i) =>
          row.map((cell, j) => {
            const isCurrentPieceCell = currentPiece.shape.some(
              (pieceRow, pieceRowIdx) =>
                pieceRow.some(
                  (pieceCell, pieceCellIdx) =>
                    pieceCell !== 0 &&
                    currentPiece.position.y + pieceRowIdx === i &&
                    currentPiece.position.x + pieceCellIdx === j
                )
            );

            return (
              <div
                key={`${i}-${j}`}
                className={`cell ${isCurrentPieceCell ? "active" : ""}`}
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
      <p>Lines cleared: {clearedLines}</p>
      <p>Level: {level}</p>
      {gameOver && <div className="game-over">Game Over</div>}
      <div className="pause-button-container">
        <button onClick={() => setRunning(!running)} className="pause-button">
          {running ? "Pause" : "Resume"}
        </button>
      </div>
    </>
  );
}
