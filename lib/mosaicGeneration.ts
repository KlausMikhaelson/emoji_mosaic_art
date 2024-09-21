import {processImage} from "./imageProcessing";
import { findCLosestEmoji } from "./emojiMatching";

export async function generateEmojiMosaic(imagePath: any, gridSize = 128) {
    const grid = await processImage(imagePath, gridSize);

    return grid.map(cell => ({
        ...cell,
        emoji: findCLosestEmoji({ r: cell.r, g: cell.g, b: cell.b })?.char
    }));
}