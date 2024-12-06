import React from "react";
import "./controls.css";
import PreviewPiece from "./PreviewPiece";
import Instructions from "./Instructions";
import Button from "./Button";
import type { IControlsProps } from "../types/controls";

const Controls: React.FC<IControlsProps> = ({
  togglePause,
  running,
  clearedLines,
  level,
  nextPiece,
  resetGame,
  handleStartGame,
}) => {
  return (
    <>
      <Instructions />
      <div className="controls">
        <div className="reset-container">
          {running && togglePause && (
            <Button onClick={togglePause} text={`Pause`} />
          )}
          {running ? (
            <Button text={`Reset`} onClick={resetGame} />
          ) : (
            <Button text={`Start`} onClick={handleStartGame} />
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
    </>
  );
};

export default Controls;
