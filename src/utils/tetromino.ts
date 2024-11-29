import { SHAPES } from "../constants/tetromino";
import { Tetromino } from "../types/tetromino";

export const getRandomTetromino = (): Tetromino => {
  const tetrominoKeys = Object.keys(SHAPES) as Tetromino[];
  return tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
};

export const rotateTetromino = (shape: number[][]): number[][] => {
  // Transpose and reverse rows for clockwise rotation
  return shape[0].map((_, colIdx) => shape.map((row) => row[colIdx]).reverse());
};
