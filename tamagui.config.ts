import { createFont, createTamagui, createTokens, createMedia } from "tamagui";

// Brand Colors
const brandColors = {
  white: "#F7F4F1",
  black: "#000000",
  blue: "#3B9AFA",
  lightBlue: "#D7ECFE",
  green: "#4EA72E",
  purple: "#A02B93",
  darkBlue: "#0A364F",
  gray: "#757575",
};

// Modern font sizing based on iOS/Android standards
const openSansFont = createFont({
  family: "OpenSans, 'Open Sans', system-ui, sans-serif",
  // Following iOS/Material Design standards
  size: {
    1: 11, // Caption
    2: 12, // Small text
    3: 14, // Body
    4: 16, // Large body
    5: 20, // Heading
    6: 24, // Large heading
    7: 28, // Display
    8: 32, // Large display
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 22,
    4: 24,
    5: 28,
    6: 32,
    7: 36,
    8: 40,
  },
  weight: {
    1: "300", // Light
    2: "400", // Regular
    3: "500", // Medium
    4: "600", // SemiBold
    5: "700", // Bold
  },
  letterSpacing: {
    1: 0,
    2: -0.2,
    3: -0.3,
    4: -0.4,
    5: -0.5,
  },
  // For native platform-specific font files
  face: {
    300: { normal: "OpenSans-Light" },
    400: { normal: "OpenSans-Regular" },
    500: { normal: "OpenSans-Medium" },
    600: { normal: "OpenSans-SemiBold" },
    700: { normal: "OpenSans-Bold" },
  },
});

// Modern spacing scale based on 4-point grid
const size = {
  0: 0,
  1: 4, // Tiny spacing
  2: 8, // Small spacing
  3: 12, // Medium-small spacing
  4: 16, // Base spacing
  5: 24, // Medium spacing
  6: 32, // Large spacing
  7: 48, // Extra large spacing
  8: 64, // Huge spacing
  true: 16, // Default
};

export const tokens = createTokens({
  size,
  space: {
    ...size,
    "-1": -4,
    "-2": -8,
    "-3": -12,
    "-4": -16,
  },
  radius: {
    0: 0,
    1: 4, // Small
    2: 8, // Medium
    3: 12, // Large
    4: 16, // Extra large
    5: 24, // Circular
    true: 8, // Default
  },
  zIndex: {
    0: 0,
    1: 100, // Modal
    2: 200, // Popover
    3: 300, // Tooltip
    4: 400, // Toast
    5: 500, // Dialog
  },
  color: {
    ...brandColors,
    // Semantic colors
    background: brandColors.white,
    foreground: brandColors.black,
    primary: brandColors.blue,
    secondary: brandColors.lightBlue,
    success: brandColors.green,
    accent: brandColors.purple,
    muted: brandColors.darkBlue,
  },
});

const config = createTamagui({
  fonts: {
    heading: openSansFont,
    body: openSansFont,
  },
  tokens,
  themes: {
    light: {
      bg: tokens.color.white,
      background: tokens.color.white,
      color: tokens.color.black,
      borderColor: "rgba(0,0,0,0.1)",
      shadowColor: "rgba(0,0,0,0.1)",
      primary: tokens.color.blue,
      secondary: tokens.color.darkBlue,
      gray: tokens.color.gray,
    },
    dark: {
      bg: tokens.color.darkBlue,
      background: tokens.color.darkBlue,
      color: tokens.color.white,
      borderColor: "rgba(255,255,255,0.1)",
      shadowColor: "rgba(0,0,0,0.3)",
      primary: tokens.color.lightBlue,
      secondary: tokens.color.blue,
      gray: tokens.color.gray,
    },
  },
  // Modern device breakpoints
  media: createMedia({
    xs: { maxWidth: 360 }, // Small phones
    sm: { maxWidth: 640 }, // Large phones
    md: { maxWidth: 768 }, // Tablets
    lg: { maxWidth: 1024 }, // Small laptops
    xl: { maxWidth: 1280 }, // Laptops
    xxl: { maxWidth: 1536 }, // Large screens
    gtXs: { minWidth: 361 },
    gtSm: { minWidth: 641 },
    gtMd: { minWidth: 769 },
    gtLg: { minWidth: 1025 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
  // Common shorthands
  shorthands: {
    px: "paddingHorizontal",
    py: "paddingVertical",
    mx: "marginHorizontal",
    my: "marginVertical",
    f: "flex",
    m: "margin",
    p: "padding",
    w: "width",
    h: "height",
    bg: "backgroundColor",
    r: "borderRadius",
  } as const,
});

type AppConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
