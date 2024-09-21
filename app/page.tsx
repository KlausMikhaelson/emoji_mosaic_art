"use client"

import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [imagePath, setImagePath] = useState<string | null>(null);
  const [emojiMosaic, setEmojiMosaic] = useState<string | null>(null);

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

  return (
    <div>
      <h1>Emoji Mosaic Generator</h1>
      <ImageUpload onUpload={handleUpload} />
      {imagePath && <img src={`https://hfecpbfntuxaswbitevl.supabase.co/storage/v1/object/public/images/${imagePath}`} alt="uploaded images" />}
      {emojiMosaic && <img src={`data:image/png;base64,${emojiMosaic}`} alt="emoji mosaic" />}
    </div>
  );
}
