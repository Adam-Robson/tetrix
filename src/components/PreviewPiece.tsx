interface PreviewPieceProps {
  shape: number[][];
  color: string;
}

import "./preview-piece.css";

export default function PreviewPiece({ shape, color }: PreviewPieceProps) {
  return (
    <div className="preview-piece">
      {shape.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            style={{
              backgroundColor: cell !== 0 ? color : "#ddf45bff;",
            }}
            className="preview-cell"
          ></div>
        ))
      )}
    </div>
  );
}
