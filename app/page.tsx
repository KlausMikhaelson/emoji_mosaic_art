"use client"
import imageCompression from 'browser-image-compression';
import { useState } from "react";
import { generateEmojiMosaic } from "@/lib/mosaicGeneration";
import EmojiMosaic from "@/components/EmojiMosaic";
import { FileUpload } from "@/components/file-upload";

export default function Home() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [emojiMosaic, setEmojiMosaic] = useState<string | null>(null);
  const [grid, setGrid] = useState<Array<{r: number, g: number, b: number}> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      <h1 className="flex items-center justify-center text-4xl my-6">Emoji Mosaic Generator</h1>
      <div className="w-full max-w-4xl mx-auto border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={async (files: File[]) => {
        setIsLoading(true);
          try {
            const dataUrl = await compressIfNeeded(files[0]);
            await handleUpload(dataUrl);
            setIsLoading(false);
          } catch (error) {
            console.error('Error processing file:', error);
          }
        }} />
      </div>
      {isLoading && (
        <div className='flex items-center justify-center h-[50vh]'>
        <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
        <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
        Generating your mosaic...
        </button>
          </div>
      )}
      <div className="flex items-center justify-center">
        {imagePath && <img src={imagePath} className="h-[50vh] mt-2 w-fit rounded-md" alt="uploaded image" />}
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