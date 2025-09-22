import type { CSSProperties } from "react";

export type Appearance = "light" | "dark";
export type Accent =
  | "indigo"
  | "azure"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "neutral";

export type ColorVisionMode =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

export interface ThemeOptions {
  appearance: Appearance;
  accent: Accent;
  colorVision: ColorVisionMode;
  highContrast: boolean;
  reducedMotion: boolean;
}

export type ThemeTokenName =
  | "color-background"
  | "color-surface"
  | "color-surface-hover"
  | "color-surface-active"
  | "color-border"
  | "color-ring"
  | "color-text"
  | "color-text-subtle"
  | "color-text-muted"
  | "color-inverted"
  | "color-primary"
  | "color-primary-contrast"
  | "color-primary-soft"
  | "color-primary-border"
  | "color-success"
  | "color-success-contrast"
  | "color-success-soft"
  | "color-success-border"
  | "color-warning"
  | "color-warning-contrast"
  | "color-warning-soft"
  | "color-warning-border"
  | "color-danger"
  | "color-danger-contrast"
  | "color-danger-soft"
  | "color-danger-border"
  | "color-neutral"
  | "color-neutral-contrast"
  | "color-neutral-soft"
  | "color-neutral-border"
  | "font-family-base"
  | "font-family-mono"
  | "text-size-xs"
  | "text-size-sm"
  | "text-size-md"
  | "text-size-lg"
  | "text-size-xl"
  | "text-size-2xl"
  | "line-height-tight"
  | "line-height-normal"
  | "line-height-relaxed"
  | "radius-sm"
  | "radius-md"
  | "radius-lg"
  | "shadow-sm"
  | "shadow-md"
  | "shadow-lg"
  | "border-width"
  | "motion-duration"
  | "motion-ease"
  | "spacing-xs"
  | "spacing-sm"
  | "spacing-md"
  | "spacing-lg";

export type ThemeTokens = Record<ThemeTokenName, string>;

export interface ThemeState extends ThemeOptions {
  tokens: ThemeTokens;
}

export interface ThemeContextValue extends ThemeState {
  setAppearance: (appearance: Appearance) => void;
  toggleAppearance: () => void;
  setAccent: (accent: Accent) => void;
  setColorVision: (mode: ColorVisionMode) => void;
  setHighContrast: (value: boolean) => void;
  toggleHighContrast: () => void;
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
  getVar: (token: ThemeTokenName) => string;
  cssVariables: CSSProperties;
}

export type PartialThemeOptions = Partial<ThemeOptions>;
