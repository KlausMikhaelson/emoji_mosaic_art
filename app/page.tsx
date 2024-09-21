"use client"

import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";
import { useState } from "react";
import * as path from "path";
import * as fs from "fs";
import { generateEmojiMosaic } from "@/lib/mosaicGeneration";
import {useEffect} from "react";
import { processImage } from "@/lib/imageProcessing";
import EmojiMosaic from "@/components/EmojiMosaic";

export default function Home() {

  const [imagePath, setImagePath] = useState<string | null>(null);
  const [emojiMosaic, setEmojiMosaic] = useState<string | null>(null);
  const [grid, setGrid] = useState<Array<{r: number, g: number, b: number}> | null>(null);


  async function handleUpload(filePath: string) {
    setImagePath(filePath);
    const res = await fetch(`/api/process-image`, {
      method: "POST",
      body: JSON.stringify({imagePath: filePath}),
      headers: {
        "Content-Type": "application/json"
      },
    });
    const data = await res.json();
    setEmojiMosaic(data.emojiMosaic);
  }

  useEffect(() => {
    const processClientSideImage = async () => {
      try {
        // Replace with the URL of your image
        // const imageUrl = 'https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/sign/images/IMG_4867%202.JPG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvSU1HXzQ4NjcgMi5KUEciLCJpYXQiOjE3MjY5MDM4OTksImV4cCI6MTcyOTQ5NTg5OX0.PXxR4TwbuOUPmnDnxJnZRbk4MSt39zolVmIlwm6QRgM&t=2024-09-21T07%3A31%3A39.211Z';
        const imageUrl = 'https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/sign/images/profile2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvcHJvZmlsZTIuanBnIiwiaWF0IjoxNzI2OTA1MTkzLCJleHAiOjE3Mjk0OTcxOTN9.jsNBwtrswpuo3qKDuF2bF0xh0OuISq8tpegjPX4IPRU&t=2024-09-21T07%3A53%3A13.382Z'
        // const imageUrl = 'https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/sign/images/IMG_3466.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvSU1HXzM0NjYuanBnIiwiaWF0IjoxNzI2OTA2MTEzLCJleHAiOjE3NTg0NDIxMTN9.hn6HqTiXa7j8eJOpx2fQYclaqHKRRYLTBFWwvQvzzY8&t=2024-09-21T08%3A08%3A33.897Z'
        // const imageUrl = 'https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/sign/images/8F0D97F2-D45D-4257-B7C4-88045F6127E0.JPG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvOEYwRDk3RjItRDQ1RC00MjU3LUI3QzQtODgwNDVGNjEyN0UwLkpQRyIsImlhdCI6MTcyNjkwNjE5MCwiZXhwIjoxNzU4NDQyMTkwfQ.psFc7NEz1lHf7Kl2af7izSTNxrRs1fV93lU52oH_-MY&t=2024-09-21T08%3A09%3A50.914Z'
        // const imageUrl = 'https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/sign/images/IMG_5153.PNG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvSU1HXzUxNTMuUE5HIiwiaWF0IjoxNzI2OTA3NDU3LCJleHAiOjE3NTg0NDM0NTd9.T6BG0UD2HVep-IpXoU-3m6oLdcBiD3lnuqnjEJ4wKqI&t=2024-09-21T08%3A30%3A57.329Z'
        // const imageUrl = 'https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/sign/images/IMG_5154.PNG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvSU1HXzUxNTQuUE5HIiwiaWF0IjoxNzI2OTA3NTU5LCJleHAiOjE3NTg0NDM1NTl9.QYCeoYW4xA_pQ4LNf6eZv4tAt2GjTcandCXKeuRiQL0&t=2024-09-21T08%3A32%3A39.916Z'
        // const imageUrl = 'https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/sign/images/9CAF8587-F7BD-4F13-B88B-B9C0A3918EFC.JPG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvOUNBRjg1ODctRjdCRC00RjEzLUI4OEItQjlDMEEzOTE4RUZDLkpQRyIsImlhdCI6MTcyNjkwODA4NywiZXhwIjoxNzI5NTAwMDg3fQ.liSzVcm4Aeg3p7XyfOzZgO-zBfPFL__tmt_CsjzK1WE&t=2024-09-21T08%3A41%3A27.719Z'
        const result = await generateEmojiMosaic(imageUrl);
        setGrid(result);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    };

    processClientSideImage();
  }, []);

  
  const generateImage =async() => {
    const newImagePath = path.resolve(__dirname, "../assets/profile2.jpg");

    try {
      const mosaic = await generateEmojiMosaic(newImagePath, 32);
      console.log("Mosaic generated successfully", mosaic);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Emoji Mosaic Generator</h1>
      <ImageUpload onUpload={handleUpload} />
      {imagePath && <img src={`https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/public/images/${imagePath}`} alt="uploaded images" />}
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
