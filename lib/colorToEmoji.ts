const colorToEmoji = (r: number, g: number, b: number): string => {
    const maxComponent = Math.max(r, g, b);
    if (r === g && g === b) {
      if (r < 85) return '⚫';  // black
      if (r < 170) return '⚪';  // gray
      return '⬜';  // white
    }
    if (maxComponent === r) {
      if (g > 170 && b > 170) return '🟨';  // yellow
      return '🟥';  // red
    }
    if (maxComponent === g) return '🟩';  // green
    if (maxComponent === b) {
      if (r > 170 && g > 170) return '🟦';  // light blue
      return '🟪';  // purple
    }
    return '🟫';  // default to brown
  };