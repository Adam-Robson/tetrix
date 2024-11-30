import { SHAPES } from "../constants/tetromino";
import { TTetrominoKey, TTetromino } from "../types/tetromino";

export const getRandomTetromino = (): TTetromino => {
  const tetrominoKeys = Object.keys(SHAPES) as (keyof typeof SHAPES)[];
  const randomIdx = Math.floor(Math.random() * tetrominoKeys.length);
  const randomKey: TTetrominoKey = tetrominoKeys[randomIdx];
  return SHAPES[randomKey];
};

export const rotateTetromino = (shape: number[][]): number[][] => {
  // Transpose and reverse rows for clockwise rotation
  return shape[0].map((_, colIdx) => shape.map((row) => row[colIdx]).reverse());
};
