import React from "react";
import "./controls.css";
import PreviewPiece from "./PreviewPiece";

interface IControlsProps {
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

const Controls: React.FC<IControlsProps> = ({
  paused,
  togglePause,
  resetGame,
  running,
  clearedLines,
  level,
  gameOver,
  nextPiece,
  handleStartGame,
}) => {
  return (
    <div className="controls">
      {gameOver && <div className="game-over">Game Over</div>}
      <p className="instructions-title">Click Start to begin the game.</p>

      <button
        className="start-button"
        onClick={running ? resetGame : handleStartGame}
      >
        {running ? "Reset" : "Start"}
      </button>

      <div className="game-controls">
        {running && (
          <button className="pause-button" onClick={togglePause}>
            {paused ? "Resume" : "Pause"}
          </button>
        )}
      </div>

      <section className="meta-container">
        <div className="stats-container">
          <p>Lines cleared: {clearedLines}</p>
          <p>Level: {level}</p>
        </div>
        <PreviewPiece shape={nextPiece.shape} color={nextPiece.color} />
      </section>
    </div>
  );
};

export default Controls;
