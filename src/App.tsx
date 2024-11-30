import "./App.css";
import GameBoard from "./components/GameBoard";

function App() {
  return (
    <div className="app">
      <h1 className="tetriz-title">Tetriz</h1>
      <GameBoard />
      <div className="card">
        <p>
          Welcome to Tetriz - a simple Tetris clone built with Vite, TypeScript,
          and React.
        </p>
      </div>
      <p className="read-the-docs">
        Click the Start button to begin playing. Use the arrow keys to move and
        the up arrow key to rotate.
      </p>
    </div>
  );
}

export default App;
