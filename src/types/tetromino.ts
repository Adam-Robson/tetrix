import { SHAPES } from "../constants/tetromino";

export type TetrominoShape = (typeof SHAPES)[keyof typeof SHAPES];
export type Tetromino = keyof typeof SHAPES;
