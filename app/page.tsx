"use client"

import ImageUpload from "@/components/ImageUpload";
import { useState, useEffect } from "react";
import { generateEmojiMosaic } from "@/lib/mosaicGeneration";
import EmojiMosaic from "@/components/EmojiMosaic";

export default function Home() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [emojiMosaic, setEmojiMosaic] = useState<string | null>(null);
  const [grid, setGrid] = useState<Array<{r: number, g: number, b: number}> | null>(null);

  async function handleUpload(dataUrl: string) {
    setImagePath(dataUrl);
    try {
      const result = await generateEmojiMosaic(dataUrl);
      setGrid(result);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  return (
    <div>
      <h1>Emoji Mosaic Generator</h1>
      <ImageUpload onUpload={handleUpload} />
      <div className="flex items-center justify-center">
      {imagePath && <img src={imagePath} className="h-[50vh] w-fit rounded-md" alt="uploaded image" />}
      </div>
      {emojiMosaic && <img src={`data:image/png;base64,${emojiMosaic}`} alt="emoji mosaic" />}
      {grid ? (
        <>
          <EmojiMosaic mosaic={grid} />
        </>
      ) : (
        <p>Processing image...</p>
      )}
    </div>
  );
}