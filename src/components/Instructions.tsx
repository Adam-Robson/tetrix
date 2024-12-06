import "./instructions.css";

export default function Instructions() {
  return (
    <div>
      <h1 className="instructions-title">Tetriz</h1>
      <ol className="tetriz-instructions">
        <li>Use the left and right arrow keys to move the piece.</li>
        <li>Use the up arrow key to rotate the piece.</li>
        <li>Use the down arrow key to speed up the piece.</li>
        <li>Clear lines to increase your level.</li>
        <li>Game over if the pieces reach the top of the board.</li>
      </ol>
    </div>
  );
}
