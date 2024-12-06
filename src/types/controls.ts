export interface IStartButtonProps {
  handleStartGame: () => void;
}

export interface IPauseButtonProps {
  togglePause: () => void;
}

export interface IResetButtonProps {
  handleResetGame: () => void;
}

export interface IButtonProps {
  onClick: () => void;
  text: string;
}

export interface IControlsProps {
  paused?: boolean;
  togglePause?: () => void;
  resetGame: () => void;
  running: boolean;
  clearedLines: number;
  level: number;
  gameOver: boolean;
  nextPiece: {
    shape: number[][];
    color: string;
  };
  handleStartGame: () => void;
}
