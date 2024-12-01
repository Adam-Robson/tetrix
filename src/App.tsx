import GameBoard from "./components/GameBoard";

function App() {
  return (
    <>
      <div className="tetriz-container">
        <h1 className="tetriz-title">Tetriz</h1>
        <p className="tetriz-greeting">
          Tetriz is a Tetris clone built with Vite, in TypeScript, using React.
        </p>
        <section className="game-area-container">
          <p className="tetriz-greeting">Click Start to begin the game.</p>
          <ol className="tetriz-instructions">
            <li>Use the left and right arrow keys to move the piece.</li>
            <li>Use the up arrow key to rotate the piece.</li>
            <li>Use the down arrow key to speed up the piece.</li>
            <li>Clear lines to increase your level.</li>
            <li>Game over if the pieces reach the top of the board.</li>
          </ol>
          <GameBoard />
        </section>
      </div>
    </>
  );
}

export default App;
