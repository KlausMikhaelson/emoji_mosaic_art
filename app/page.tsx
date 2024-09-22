"use client"
import imageCompression from 'browser-image-compression';
import ImageUpload from "@/components/ImageUpload";
import { useState, useEffect } from "react";
import { generateEmojiMosaic } from "@/lib/mosaicGeneration";
import EmojiMosaic from "@/components/EmojiMosaic";
import { FileUpload } from "@/components/file-upload";

export default function Home() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [emojiMosaic, setEmojiMosaic] = useState<string | null>(null);
  const [grid, setGrid] = useState<Array<{r: number, g: number, b: number}> | null>(null);

  async function handleUpload(dataUrl: string) {
    const squareDataUrl = await cropToSquare(dataUrl);
    setImagePath(squareDataUrl);
    try {
      const result = await generateEmojiMosaic(squareDataUrl);
      setGrid(result);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  async function cropToSquare(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            size,
            size
          );
          resolve(canvas.toDataURL());
        }
      };
      img.src = dataUrl;
    });
  }

  async function compressIfNeeded(file: File): Promise<string> {
    if (file.size > 3 * 1024 * 1024) { // 3MB
      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = (e) => {
            if (e.target?.result) {
              resolve(e.target.result as string);
            } else {
              reject(new Error('Failed to read compressed file'));
            }
          };
          reader.readAsDataURL(compressedFile);
        });
      } catch (error) {
        throw new Error('Compression failed: ' + error);
      }
    } else {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  return (
    <div>
      <h1 className="flex items-center justify-center text-4xl">Emoji Mosaic Generator</h1>
      <div className="w-full max-w-4xl mx-auto border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={async (files: File[]) => {
          try {
            const dataUrl = await compressIfNeeded(files[0]);
            await handleUpload(dataUrl);
          } catch (error) {
            console.error('Error processing file:', error);
          }
        }} />
      </div>
      <div className="flex items-center justify-center">
        {imagePath && <img src={imagePath} className="h-[50vh] w-fit rounded-md" alt="uploaded image" />}
      </div>
      {emojiMosaic && <img src={`data:image/png;base64,${emojiMosaic}`} alt="emoji mosaic" />}
      {grid && (
        <div className="flex items-center justify-center rounded-md">
          <EmojiMosaic mosaic={grid} />
        </div>
      )}
    </div>
  );
}