import React from "react";

export default function EmojiMosaic({ mosaic, gridSize = 128 }) {
  const style = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gap: "1px",
    padding: "10px",
    borderRadius: "5px",
  };

  const getBackgroundColor = (emoji) => {
    // Simple brightness calculation (this is a placeholder, you might need a more accurate method)
    const brightness = emoji.charCodeAt(0) % 256;
    return brightness > 128 ? "#000" : "#fff";
  };

  return (
    <div style={style} className="h-96 w-fit" >
      {mosaic.map((cell, index) => (
        <div key={index} style={{ fontSize: "4px"}}>
          {cell.emoji}
        </div>
      ))}
    </div>
  );
}
