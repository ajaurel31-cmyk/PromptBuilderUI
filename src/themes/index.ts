/**
 * Theme CSS imports.
 *
 * Import these in your app entry point:
 *
 *   import 'prompt-builder-ui/src/themes/variables.css'
 *   import 'prompt-builder-ui/src/themes/light.css'
 *   import 'prompt-builder-ui/src/themes/dark.css'
 *
 * Then add the "light" or "dark" class to a parent element to activate a theme.
 */

export const THEME_CLASSES = {
  light: 'light',
  dark: 'dark',
} as const

export type ThemeName = keyof typeof THEME_CLASSES
