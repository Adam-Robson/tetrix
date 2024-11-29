import React, { useState, useEffect, useCallback } from "react";
import { Board } from "../types/board";
import { createEmptyBoard } from "../utils/board";
import { SHAPES } from "../constants/tetromino";
import { TetrominoShape } from "../types/tetromino";
import { getRandomTetromino, rotateTetromino } from "../utils/tetromino";
import { checkCollision } from "../utils/board";

const GameBoard: React.FC = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<{
    shape: TetrominoShape;
    position: { x: number; y: number };
  }>({
    shape: SHAPES[getRandomTetromino()],
    position: { x: 4, y: 0 }, // Start in the middle of the board
  });

  // Function to merge the piece into the board
  const drawPieceOnBoard = (): Board => {
    const newBoard = [...board].map((row) => [...row]); // Create a deep copy

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
            newBoard[boardY][boardX] = "blue"; // Color for the J piece
          }
        }
      });
    });

    return newBoard;
  };

  // Function to handle locking the piece into place
  const lockPiece = useCallback(() => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]); // Deep copy

      currentPiece.shape.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
          if (cell !== 0) {
            const boardY = currentPiece.position.y + rowIdx;
            const boardX = currentPiece.position.x + colIdx;

            if (
              boardY >= 0 &&
              boardY < newBoard.length &&
              boardX >= 0 &&
              boardX < newBoard[0].length
            ) {
              newBoard[boardY][boardX] = "blue"; // Lock piece color
            }
          }
        });
      });

      return newBoard;
    });

    // Generate a new piece
    setCurrentPiece({
      shape: SHAPES[getRandomTetromino()],
      position: { x: 4, y: 0 },
    });
  }, [currentPiece]);

  // Function to move the piece
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

  return (
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
              backgroundColor: cell ?? "#222", // Use cell color or default
            }}
          ></div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
