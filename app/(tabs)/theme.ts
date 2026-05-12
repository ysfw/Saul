export const hexToRgba = (hex: string, opacity: number) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// 🎨 CHANGE THIS SINGLE VARIABLE TO UPDATE THE ENTIRE APP'S THEME COLOR!
// Examples: 
// Pale Gold (Softer on eyes): "#E5C07B"
// Pure Gold: "#FFD700"
// Cyber Cyan: "#00E5FF"
export const themeColor = "#eab646ff";

export const Colors = {
  primary: themeColor,
  primaryAlpha15: hexToRgba(themeColor, 0.15),
  primaryAlpha30: hexToRgba(themeColor, 0.3),
  primaryAlpha10: hexToRgba(themeColor, 0.1),

  background: "#000000",
  surface: "#121212",
  surfaceLight: "#1A1A1A",

  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0A0",
  textMuted: "#E0E0E0",

  border: "#333333",
  borderLight: "#2A2A2A",

  success: "#4ADE80",
  warning: "#FACC15",
  danger: "#F87171",
  dangerAlpha10: "rgba(255, 107, 107, 0.1)",
};
