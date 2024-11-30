import React from "react";
import "./controls.css";

interface IControlsProps {
  running: boolean;
  setRunning: (running: boolean) => void;
  clearedLines: number;
  level: number;
  gameOver: boolean;
}

const Controls: React.FC<IControlsProps> = ({
  running,
  setRunning,
  clearedLines,
  level,
  gameOver,
}) => {
  const handlePause = () => {
    if (!gameOver) setRunning(!running);
  };

  const handleStart = () => {
    setRunning(true);
  };

  return (
    <div className="controls">
      <div className="stats-container">
        <p>Lines cleared: {clearedLines}</p>
        <p>Level: {level}</p>
      </div>
      {gameOver && <div className="game-over">Game Over</div>}
      <div className="buttons-container">
        <button
          className="start-button"
          onClick={handleStart}
          disabled={running}
        >
          Start
        </button>
        <button
          className="pause-button"
          onClick={handlePause}
          disabled={gameOver}
        >
          {running ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
};

export default Controls;
