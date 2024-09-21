import quantize from 'quantize'
import FastAverageColor from 'fast-average-color'

export const colorToNumber = (r, g, b) => (r << 16) + (g << 8) + b

export const numberToColor = number => {
  if (typeof number === "string") {
    number = parseInt(number, 10)
  }

  return [
    (number & 0xff0000) >> 16,
    (number & 0x00ff00) >> 8,
    (number & 0x0000ff)
  ]
}

export const analyzePixels = imageData => {
  const fac = new FastAverageColor()
  const sqrt = fac.getColorFromArray4(imageData).slice(0, 3)
  const simple = fac.getColorFromArray4(imageData, { algorithm: "simple" }).slice(0, 3)
  const facDominant = fac.getColorFromArray4(imageData, { algorithm: "dominant" }).slice(0, 3)

  const pixels = []
  let transparentPixels = 0

  for (let i = 0, r, g, b, a; i < imageData.length; i += 4) {
    r = imageData[i]
    g = imageData[i + 1]
    b = imageData[i + 2]
    a = imageData[i + 3]

    // image opacity and whiteness
    if (a >= 125) {
      pixels.push([r, g, b])
    }
    if (a === 255) {
      transparentPixels++
    }
  }

  const quantized = quantize(pixels, 2)
  const dominant = quantized ? quantized.palette()[0] : null
  const transparency = transparentPixels / pixels.length
  return { dominant, transparency, sqrt, facDominant, simple }
}

export const createPalette = (canvas, emojiArray) => {
  const palette = {}
  const paletteColors = []

  const ctx = canvas.getContext('2d')
  ctx.font = "15px monospace"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  emojiArray.forEach(emoji => {
    ctx.clearRect(0, 0, 16, 16)

    // draw emoji
    ctx.fillText(emoji, 8, 10)

    const { data } = ctx.getImageData(0, 0, 16, 16)

    // get RGB and transparency values
    const analyzedData = analyzePixels(data)

    if (analyzedData.dominant !== null) {
      const [r, g, b] = analyzedData.dominant

      // set palette color
      const colorInt = colorToNumber(r, g, b)
      palette[colorInt] = emoji
      paletteColors.push([r, g, b])
    }
  })

  return { palette, paletteColors }
}