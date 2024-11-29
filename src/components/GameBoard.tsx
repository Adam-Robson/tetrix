import "./gameboard.css";

export default function GameBoard() {
  const rows = Array.from({ length: 20 });
  const cols = Array.from({ length: 10 });

  return (
    <div className="gameboard">
      {rows.map((_, i) =>
        cols.map((_, j) => <div key={`${i}-${j}`} className="cell"></div>)
      )}
    </div>
  );
}
