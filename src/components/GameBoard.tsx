import React, { useState, useEffect, useCallback } from "react";
import { Board } from "../types/board";
import { createEmptyBoard } from "../utils/board";
import { SHAPES } from "../constants/tetromino";
import { TetrominoShape } from "../types/tetromino";
import { getRandomTetromino, rotateTetromino } from "../utils/tetromino";
import { checkCollision } from "../utils/board";
import { clearFullLines } from "../utils/board";
import { calculateSpeed } from "../utils/game";

const GameBoard: React.FC = () => {
  const [speed, setSpeed] = useState<number>(1000);
  const [level, setLevel] = useState<number>(1);
  const [lastAnimationFrame, setLastAnimationFrame] = useState<number>(0);
  // eslint-disable-next-line
  const [running, setRunning] = useState<boolean>(true);
  const [clearedLines, setClearedLines] = useState<number>(0);
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<{
    shape: TetrominoShape;
    position: { x: number; y: number };
  }>({
    shape: SHAPES[getRandomTetromino()],
    position: { x: 4, y: 0 },
  });

  const drawPieceOnBoard = (): Board => {
    const newBoard = [...board].map((row) => [...row]);

    currentPiece.shape.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell !== 0) {
          const boardY = currentPiece.position.y + rowIdx;
          const boardX = currentPiece.position.x + colIdx;

          if (
            boardY >= 0 &&
            boardY < board.length &&
            boardX >= 0 &&
            boardX < board[0].length
          ) {
            newBoard[boardY][boardX] = "blue";
          }
        }
      });
    });

    return newBoard;
  };

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
              updatedGameBoard[boardY][boardX] = "blue"; // Lock piece color
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

    setCurrentPiece({
      shape: SHAPES[getRandomTetromino()],
      position: { x: 4, y: 0 },
    });
  }, [level, currentPiece]);

  const movePiece = useCallback(
    (direction: "left" | "right" | "down") => {
      setCurrentPiece((prev) => {
        const newPosition = { ...prev.position };
        if (direction === "left") {
          newPosition.x -= 1;
        } else if (direction === "right") {
          newPosition.x += 1;
        } else if (direction === "down") {
          newPosition.y += 1;
        }

        if (!checkCollision(prev.shape, board, newPosition)) {
          return { ...prev, position: newPosition };
        }

        // If moving down and a collision occurs, lock the piece
        if (direction === "down") {
          lockPiece();
        }

        return prev;
      });
    },
    [board, lockPiece]
  );

  // Function to rotate the piece
  const rotatePiece = useCallback(() => {
    setCurrentPiece((prev) => {
      const rotatedShape = rotateTetromino(prev.shape);

      // Check for collision after rotation
      if (!checkCollision(rotatedShape, board, prev.position)) {
        return { ...prev, shape: rotatedShape };
      }

      return prev; // Revert to previous state if collision occurs
    });
  }, [board]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "ArrowLeft") movePiece("left");
      if (e.key === "ArrowRight") movePiece("right");
      if (e.key === "ArrowDown") movePiece("down");
      if (e.key === "ArrowUp") rotatePiece();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [movePiece, rotatePiece]);

  useEffect(() => {
    let animationFrameId: number;
    const gameLoop = (currentTime: number) => {
      if (!running) return;
      const elapsedTime = currentTime - lastAnimationFrame;
      if (elapsedTime > speed) {
        movePiece("down");
        setLastAnimationFrame(currentTime);
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [lastAnimationFrame, running, speed, movePiece]);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${board.length}, 1fr)`,
          gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
          gap: "1px",
          backgroundColor: "#000",
          border: "2px solid #333",
          width: "200px",
          height: "400px",
        }}
      >
        {drawPieceOnBoard().map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: cell ?? "#cca", // Use cell color or default
              }}
            ></div>
          ))
        )}
      </div>
      <p>Lines Cleared: {clearedLines}</p>
    </>
  );
};

export default GameBoard;
