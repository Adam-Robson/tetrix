import React from "react";
import "./controls.css";

interface ControlsProps {
  running: boolean;
  setRunning: (running: boolean) => void;
  clearedLines: number;
  level: number;
  gameOver: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  running,
  setRunning,
  clearedLines,
  level,
  gameOver,
}) => {
  const handlePause = () => {
    if (!gameOver) setRunning(!running);
  };

  return (
    <div className="controls">
      <p>Lines cleared: {clearedLines}</p>
      <p>Level: {level}</p>
      {gameOver && <div className="game-over">Game Over</div>}
      <button
        className="pause-button"
        onClick={handlePause}
        disabled={gameOver}
      >
        {running ? "Pause" : "Resume"}
      </button>
    </div>
  );
};

export default Controls;
