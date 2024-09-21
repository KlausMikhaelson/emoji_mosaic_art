import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function EmojiMosaic({ mosaic, gridSize = 128, backgroundColor = "black" }: any) {
  const mosaicRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (mosaicRef.current) {
      const canvas = await html2canvas(mosaicRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
        width: mosaicRef.current.scrollWidth,
        height: mosaicRef.current.scrollHeight,
        backgroundColor: backgroundColor,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "mosaic.png";
      link.click();
    }
  };

  const style = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gap: "1px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: backgroundColor, // Set the background color for the mosaic
  };

  return (
    <div className="flex m-4 flex-col items-center justify-center">
        <button className="bg-black px-4 py-3 rounded-md hover:text-gray-400 border-[1px] border-gray-400" onClick={handleDownload}>Download Mosaic</button>
      <div ref={mosaicRef} style={style} className="h-60 w-fit">
        {mosaic.map((cell: any, index: any) => (
          <div key={index} style={{ fontSize: "4px" }}>
            {cell.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}