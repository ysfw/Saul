/**
 * Better Call Saul themed design system.
 * Gold tones, warm browns, legal/attorney aesthetic.
 */

import { Platform } from 'react-native';

// ─── Color Palette ───────────────────────────────────────────────────────────
// Inspired by BCS: warm golds, deep browns, desert tones, neon glow

export const Colors = {
  // Core backgrounds — pure black
  bg: '#000000',
  bgElevated: '#0A0A0A',
  bgCard: '#111111',
  bgInput: '#161616',

  // Borders
  border: '#222222',
  borderFocus: '#333333',
  borderSubtle: '#1A1A1A',

  // Text — warm tones
  textPrimary: '#F5E6C8',
  textSecondary: '#B8A47C',
  textMuted: '#8A7656',
  textPlaceholder: '#6B5A3E',

  // Accent — Saul's gold
  accent: '#D4A843',
  accentDim: '#B8922E',
  accentGlow: 'rgba(212, 168, 67, 0.15)',
  accentGlowStrong: 'rgba(212, 168, 67, 0.30)',

  // Status
  success: '#7AB648',
  successBg: 'rgba(122, 182, 72, 0.12)',
  warning: '#D4A843',
  warningBg: 'rgba(212, 168, 67, 0.12)',
  error: '#C75B3A',
  errorBg: 'rgba(199, 91, 58, 0.12)',

  // Difficulty
  diffEasy: '#7AB648',
  diffMedium: '#D4A843',
  diffHard: '#C75B3A',

  // Navigation
  tabActive: '#D4A843',
  tabInactive: '#6B5A3E',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Legacy compat
  light: {
    text: '#1A1408',
    background: '#F5E6C8',
    tint: '#D4A843',
    icon: '#8A7656',
    tabIconDefault: '#6B5A3E',
    tabIconSelected: '#D4A843',
  },
  dark: {
    text: '#F5E6C8',
    background: '#0D0B07',
    tint: '#D4A843',
    icon: '#8A7656',
    tabIconDefault: '#6B5A3E',
    tabIconSelected: '#D4A843',
  },
};

// ─── Typography ──────────────────────────────────────────────────────────────

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ─── Spacing & Radius ────────────────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};
