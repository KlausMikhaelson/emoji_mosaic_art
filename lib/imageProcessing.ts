export async function processImage(
  imageUrl: string,
  gridSize = 128
): Promise<Array<{ r: number; g: number; b: number }>> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // This allows loading images from other domains
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Unable to get 2D context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const cellWidth = Math.floor(img.width / gridSize);
      const cellHeight = Math.floor(img.height / gridSize);

      const grid = [];

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const cellData = ctx.getImageData(
            x * cellWidth,
            y * cellHeight,
            cellWidth,
            cellHeight
          );

          let r = 0,
            g = 0,
            b = 0;

          for (let i = 0; i < cellData.data.length; i += 4) {
            r += cellData.data[i];
            g += cellData.data[i + 1];
            b += cellData.data[i + 2];
          }

          const pixelCount = cellData.width * cellData.height;

          grid.push({
            r: Math.round(r / pixelCount),
            g: Math.round(g / pixelCount),
            b: Math.round(b / pixelCount),
          });
        }
      }

      resolve(grid);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}
