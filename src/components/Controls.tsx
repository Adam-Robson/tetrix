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
  const handleStart = () => {
    setRunning(true);
  };

  return (
    <div className="controls">
      {gameOver && <div className="game-over">Game Over</div>}
      <button className="start-button" onClick={handleStart} disabled={running}>
        Start
      </button>
      <div className="stats-container">
        <p>Lines cleared: {clearedLines}</p>
        <p>Level: {level}</p>
      </div>
    </div>
  );
};

export default Controls;
