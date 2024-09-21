import emojiData from "./cleaningEmojiData.json";

function colorDistance(color1: any, color2: any) {
    return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
    );
}

export function findCLosestEmoji(color: any) {
    let closestEmoji = null;
    let minDistance = Infinity;

    for (const emoji of emojiData) {
        const distance = colorDistance(color, emoji.color);
        if (distance < minDistance) {
            minDistance = distance;
            closestEmoji = emoji;
        }
    }

    return closestEmoji;
}