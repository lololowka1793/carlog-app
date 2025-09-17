// mobile/constants/theme.ts
import { Platform } from 'react-native';

export const colors = {
  primary: '#5c62ec',
  bg: '#0e0f13',
  card: '#171923',
  text: '#e6e6e6',
  muted: '#a0a3aa',
  border: '#2a2e3a',
  danger: '#ef4444',
  success: '#22c55e',
};

export const spacing = (n: number) => n * 8;

/**
 * Это нужно для hooks/use-theme-color.ts и компонентов Themed*
 * Обязательно наличие ключей: text, background, tint, icon, tabIconDefault, tabIconSelected
 */
export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: colors.primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: colors.primary,
  },
  dark: {
    text: colors.text,
    background: colors.bg,
    tint: colors.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: colors.primary,
  },
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
