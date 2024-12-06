import { SHAPES } from "../constants/tetromino";

export type TTetromino = (typeof SHAPES)[keyof typeof SHAPES];
export type TTetrominoKey = keyof typeof SHAPES;
export type TCell = string | null;
