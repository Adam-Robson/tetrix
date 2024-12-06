import React from "react";
import "./preview-piece.css";

interface PreviewPieceProps {
  shape: number[][];
  color: string;
}

const PreviewPiece: React.FC<PreviewPieceProps> = ({ shape, color }) => (
  <div className="preview-container">
    <div className="preview-title">Next Piece</div>
    <div className="preview-piece">
      {shape.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`preview-cell ${cell !== 0 ? "active" : ""}`}
            style={{
              backgroundColor: cell !== 0 ? color : "transparent",
            }}
          ></div>
        ))
      )}
    </div>
  </div>
);

export default PreviewPiece;
