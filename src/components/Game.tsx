import useTetromino from "../hooks/useTetromino";
import Controls from "./Controls";
import "./game.css";

export default function Game() {
  const {
    board,
    level,
    clearedLines,
    paused,
    running,
    gameOver,
    currentPiece,
    nextPiece,
    resetGame,
    handleStartGame,
    togglePause,
  } = useTetromino();

  return (
    <div className="gameboard-container">
      <div className="controls">
        <Controls
          paused={paused}
          togglePause={togglePause}
          resetGame={resetGame}
          handleStartGame={handleStartGame}
          running={running}
          clearedLines={clearedLines}
          level={level}
          gameOver={gameOver}
          nextPiece={nextPiece}
        />
      </div>
      <div className={`gameboard ${paused ? "paused" : ""}`}>
        {board.map((row, i) =>
          row.map((col, j) => {
            const isCurrentPieceCell = currentPiece.shape.some((r, p) =>
              r.some(
                (value, c) =>
                  value !== 0 &&
                  currentPiece.position.y + p === i &&
                  currentPiece.position.x + c === j
              )
            );
            return (
              <div
                key={`${i}-${j}`}
                className="cell"
                style={{
                  backgroundColor: isCurrentPieceCell
                    ? currentPiece.color
                    : col ?? "transparent",
                }}
              ></div>
            );
          })
        )}
      </div>
    </div>
  );
}
