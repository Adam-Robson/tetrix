import { Board, Cell, Row } from "../types/board";

export const createEmptyBoard = (): Board =>
  Array.from({ length: 20 }, (): Row => Array<Cell>(10).fill(null));

export const checkCollision = (
  shape: number[][],
  board: Board,
  position: { x: number; y: number }
): boolean => {
  for (let rowIdx = 0; rowIdx < shape.length; rowIdx++) {
    for (let colIdx = 0; colIdx < shape[rowIdx].length; colIdx++) {
      // Check if the cell is part of the Tetromino
      if (shape[rowIdx][colIdx] !== 0) {
        const boardY = position.y + rowIdx;
        const boardX = position.x + colIdx;

        // Check for out-of-bounds collisions
        if (boardY < 0 || boardY >= 20 || boardX < 0 || boardX >= 10) {
          return true; // Out of bounds
        }

        // Check for collisions with locked cells
        if (board[boardY][boardX] !== null) {
          return true; // Cell is already occupied
        }
      }
    }
  }
  return false; // No collision
};
