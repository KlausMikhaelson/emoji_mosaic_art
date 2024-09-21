import sharp from "sharp";

export async function processImage(imagePath: sharp.SharpOptions | undefined, gridSize = 32) {

    try {
        const image = sharp(imagePath);
        const metadata = await image.metadata();

        const {width, height} = metadata;

        const cellWidth = Math.floor(width / gridSize);
        const cellHeight = Math.floor(height / gridSize);

        const grid = [];

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cellData = await image
                .extract({
                    left: x * cellWidth,
                    top: y * cellHeight,
                    width: cellWidth,
                    height: cellHeight,
                })
                .stats();

                const {r, g, b} = cellData.channels;
                grid.push({r, g, b});
            }
        }

        return grid;
    } catch (error) {
        console.error("Error processing image", error);
        throw error;
    }
}