import { TBoard, TCell, TRow } from "../types/board";

export const createEmptyBoard = (): TBoard =>
  Array.from({ length: 20 }, (): TRow => Array<TCell>(10).fill(null));

export const checkCollision = (
  shape: number[][],
  board: TBoard,
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

export const clearFullLines = (
  board: TBoard
): { newBoard: TBoard; clearedRows: number } => {
  const rowsToKeep = board.filter((row) => row.some((cell) => cell === null));

  const clearedRows = board.length - rowsToKeep.length;

  const newBoard: TBoard = [
    ...Array.from(
      { length: clearedRows },
      (): TRow => Array<TCell>(board[0].length).fill(null)
    ),
    ...rowsToKeep,
  ];

  return { newBoard, clearedRows };
};
