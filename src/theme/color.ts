import type { ThemeOptions, ThemeTokens, ThemeTokenName, Appearance, Accent, ColorVisionMode } from "./types";

interface RGB {
  r: number;
  g: number;
  b: number;
}

const clamp = (value: number, min = 0, max = 255) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string): RGB => {
  const normalized = hex.replace(/^#/, "");
  const value = normalized.length === 3
    ? normalized.split("").map((c) => parseInt(c + c, 16))
    : [
        parseInt(normalized.slice(0, 2), 16),
        parseInt(normalized.slice(2, 4), 16),
        parseInt(normalized.slice(4, 6), 16),
      ];
  const [r, g, b] = value;
  return { r, g, b };
};

const rgbToHex = ({ r, g, b }: RGB): string => {
  const toHex = (component: number) => {
    const clamped = clamp(Math.round(component));
    const hex = clamped.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const mix = (foreground: string, background: string, weight: number): string => {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  const w = clamp(weight, 0, 1);
  const mixChannel = (from: number, to: number) => from * (1 - w) + to * w;
  return rgbToHex({
    r: mixChannel(fg.r, bg.r),
    g: mixChannel(fg.g, bg.g),
    b: mixChannel(fg.b, bg.b),
  });
};

const relativeLuminance = ({ r, g, b }: RGB): number => {
  const toLinear = (component: number) => {
    const channel = component / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  };
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

const contrastRatio = (color1: string, color2: string): number => {
  const lum1 = relativeLuminance(hexToRgb(color1));
  const lum2 = relativeLuminance(hexToRgb(color2));
  const [lighter, darker] = lum1 > lum2 ? [lum1, lum2] : [lum2, lum1];
  return (lighter + 0.05) / (darker + 0.05);
};

const ensureContrast = (foreground: string, background: string, target = 4.5): string => {
  let current = foreground;
  let ratio = contrastRatio(current, background);
  if (ratio >= target) return current;

  const bgLum = relativeLuminance(hexToRgb(background));
  const direction = bgLum <= 0.5 ? "#ffffff" : "#000000";

  let attempts = 0;
  while (ratio < target && attempts < 12) {
    current = mix(current, direction, 0.1);
    ratio = contrastRatio(current, background);
    attempts += 1;
  }
  return current;
};

const accentPalette: Record<Accent, string> = {
  indigo: "#6366f1",
  azure: "#2563eb",
  violet: "#7c3aed",
  emerald: "#059669",
  amber: "#f59e0b",
  rose: "#f43f5e",
  neutral: "#6b7280",
};

const semanticDefaults = {
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  neutral: "#6b7280",
};

const colorVisionSemantics: Record<ColorVisionMode, Partial<typeof semanticDefaults> & { primary?: string }> = {
  normal: {},
  protanopia: {
    primary: "#1f77b4",
    success: "#1b9e77",
    warning: "#d95f02",
    danger: "#7570b3",
  },
  deuteranopia: {
    primary: "#386cb0",
    success: "#2ca25f",
    warning: "#ff7f00",
    danger: "#984ea3",
  },
  tritanopia: {
    primary: "#009e73",
    success: "#56b4e9",
    warning: "#e69f00",
    danger: "#cc79a7",
  },
  achromatopsia: {
    primary: "#525252",
    success: "#737373",
    warning: "#8c8c8c",
    danger: "#404040",
  },
};

const baseLight = {
  background: "#ffffff",
  surface: "#f8fafc",
  surfaceHover: "#f1f5f9",
  surfaceActive: "#e2e8f0",
  border: "#cbd5e1"
};

const baseDark = {
  background: "#0b1120",
  surface: "#111827",
  surfaceHover: "#1e293b",
  surfaceActive: "#334155",
  border: "#1f2937",
};

const lighten = (color: string, amount: number) => mix(color, "#ffffff", amount);
const darken = (color: string, amount: number) => mix(color, "#000000", amount);

const neutralFromAppearance = (appearance: Appearance) =>
  appearance === "light" ? "#64748b" : "#94a3b8";

const highContrastBackground = (appearance: Appearance) =>
  appearance === "light" ? "#ffffff" : "#000000";

const highContrastSurface = (appearance: Appearance) =>
  appearance === "light" ? "#f4f4f5" : "#111111";

const highContrastText = (appearance: Appearance) =>
  appearance === "light" ? "#000000" : "#ffffff";

const getAccentColor = (accent: Accent, colorVision: ColorVisionMode) => {
  if (colorVision !== "normal") {
    const override = colorVisionSemantics[colorVision].primary;
    if (override) return override;
  }
  return accentPalette[accent];
};

const getSemanticColor = (
  key: keyof typeof semanticDefaults,
  colorVision: ColorVisionMode,
): string => {
  const override = colorVisionSemantics[colorVision][key];
  return override ?? semanticDefaults[key];
};

const buildSurfacePalette = (appearance: Appearance, highContrast: boolean) => {
  if (highContrast) {
    return {
      background: highContrastBackground(appearance),
      surface: highContrastSurface(appearance),
      surfaceHover:
        appearance === "light" ? "#e4e4e7" : lighten("#111111", 0.12),
      surfaceActive:
        appearance === "light" ? "#d4d4d8" : lighten("#111111", 0.2),
      border: highContrastText(appearance),
    };
  }
  return appearance === "light" ? baseLight : baseDark;
};

const buildTokens = (options: ThemeOptions): ThemeTokens => {
  const { appearance, accent, colorVision, highContrast, reducedMotion } = options;
  const surface = buildSurfacePalette(appearance, highContrast);
  const accentColor = getAccentColor(accent, colorVision);
  const neutral = neutralFromAppearance(appearance);
  const primary = ensureContrast(accentColor, surface.background, highContrast ? 6.5 : 4.5);
  const success = ensureContrast(
    appearance === "dark" ? lighten(getSemanticColor("success", colorVision), 0.12) : getSemanticColor("success", colorVision),
    surface.background,
    highContrast ? 6 : 4.5,
  );
  const warning = ensureContrast(
    appearance === "dark" ? lighten(getSemanticColor("warning", colorVision), 0.15) : getSemanticColor("warning", colorVision),
    surface.background,
    highContrast ? 6 : 4.5,
  );
  const danger = ensureContrast(
    appearance === "dark" ? lighten(getSemanticColor("danger", colorVision), 0.1) : getSemanticColor("danger", colorVision),
    surface.background,
    highContrast ? 6 : 4.5,
  );

  const textBase = highContrast ? highContrastText(appearance) : appearance === "light" ? "#111827" : "#e2e8f0";
  const textMuted = appearance === "light" ? "#475569" : "#cbd5f5";
  const textSubtle = appearance === "light" ? "#64748b" : "#94a3b8";
  const inverted = appearance === "light" ? "#f8fafc" : "#0f172a";

  const neutralSoftBase = appearance === "light" ? lighten(neutral, 0.48) : darken(neutral, 0.4);

  const successSoft = appearance === "light" ? lighten(success, 0.75) : darken(success, 0.55);
  const successBorder = appearance === "light" ? lighten(success, 0.4) : darken(success, 0.3);
  const warningSoft = appearance === "light" ? lighten(warning, 0.75) : darken(warning, 0.55);
  const warningBorder = appearance === "light" ? lighten(warning, 0.4) : darken(warning, 0.3);
  const dangerSoft = appearance === "light" ? lighten(danger, 0.75) : darken(danger, 0.55);
  const dangerBorder = appearance === "light" ? lighten(danger, 0.4) : darken(danger, 0.3);

  const tokens: ThemeTokens = {
    "color-background": surface.background,
    "color-surface": surface.surface,
    "color-surface-hover": surface.surfaceHover,
    "color-surface-active": surface.surfaceActive,
    "color-border": surface.border,
    "color-ring": ensureContrast(appearance === "light" ? lighten(primary, 0.2) : darken(primary, 0.2), surface.background, 6),
    "color-text": textBase,
    "color-text-subtle": textSubtle,
    "color-text-muted": textMuted,
    "color-inverted": inverted,
    "color-primary": primary,
    "color-primary-contrast": ensureContrast(
      appearance === "light" ? "#ffffff" : "#0f172a",
      primary,
      highContrast ? 7 : 4.5,
    ),
    "color-primary-soft": appearance === "light" ? lighten(primary, 0.72) : darken(primary, 0.6),
    "color-primary-border": appearance === "light" ? lighten(primary, 0.4) : darken(primary, 0.3),
    "color-success": success,
    "color-success-contrast": ensureContrast(appearance === "light" ? "#f8fafc" : "#0f172a", success, highContrast ? 6.5 : 4.5),
    "color-success-soft": successSoft,
    "color-success-border": successBorder,
    "color-warning": warning,
    "color-warning-contrast": ensureContrast(appearance === "light" ? "#0f172a" : "#f8fafc", warning, highContrast ? 6.5 : 4.5),
    "color-warning-soft": warningSoft,
    "color-warning-border": warningBorder,
    "color-danger": danger,
    "color-danger-contrast": ensureContrast(appearance === "light" ? "#f8fafc" : "#0f172a", danger, highContrast ? 6.5 : 4.5),
    "color-danger-soft": dangerSoft,
    "color-danger-border": dangerBorder,
    "color-neutral": neutral,
    "color-neutral-contrast": ensureContrast(appearance === "light" ? "#f8fafc" : "#0f172a", neutral, highContrast ? 6 : 4.5),
    "color-neutral-soft": neutralSoftBase,
    "color-neutral-border": appearance === "light" ? lighten(neutral, 0.6) : darken(neutral, 0.55),
    "font-family-base": "'Inter var', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "font-family-mono": "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace",
    "text-size-xs": "0.75rem",
    "text-size-sm": "0.875rem",
    "text-size-md": "1rem",
    "text-size-lg": "1.125rem",
    "text-size-xl": "1.25rem",
    "text-size-2xl": "1.5rem",
    "line-height-tight": "1.2",
    "line-height-normal": "1.5",
    "line-height-relaxed": "1.7",
    "radius-sm": "0.5rem",
    "radius-md": "0.75rem",
    "radius-lg": "1.25rem",
    "shadow-sm": appearance === "light"
      ? "0 8px 20px -14px rgba(15, 23, 42, 0.24)"
      : "0 8px 18px -12px rgba(2, 6, 23, 0.6)",
    "shadow-md": appearance === "light"
      ? "0 18px 40px -24px rgba(15, 23, 42, 0.28)"
      : "0 24px 54px -28px rgba(2, 6, 23, 0.7)",
    "shadow-lg": appearance === "light"
      ? "0 36px 80px -42px rgba(15, 23, 42, 0.36)"
      : "0 42px 96px -48px rgba(2, 6, 23, 0.78)",
    "border-width": highContrast ? "2px" : "1px",
    "motion-duration": reducedMotion ? "0ms" : "150ms",
    "motion-ease": reducedMotion ? "linear" : "cubic-bezier(0.16, 1, 0.3, 1)",
    "spacing-xs": "0.25rem",
    "spacing-sm": "0.5rem",
    "spacing-md": "0.75rem",
    "spacing-lg": "1.25rem",
  };

  if (colorVision === "achromatopsia") {
    tokens["color-primary-soft"] = lighten(tokens["color-primary"], appearance === "light" ? 0.6 : 0.3);
    tokens["color-success"] = ensureContrast(tokens["color-success"], surface.background, 7);
    tokens["color-warning"] = ensureContrast(tokens["color-warning"], surface.background, 7);
    tokens["color-danger"] = ensureContrast(tokens["color-danger"], surface.background, 7);
  }

  if (highContrast) {
    tokens["shadow-sm"] = "none";
    tokens["shadow-md"] = "none";
    tokens["shadow-lg"] = "none";
  }

  return tokens;
};

export const createThemeTokens = (options: ThemeOptions): ThemeTokens => buildTokens(options);

export const tokensToCssVariables = (tokens: ThemeTokens): Record<string, string> => {
  const vars: Record<string, string> = {};
  (Object.keys(tokens) as ThemeTokenName[]).forEach((token) => {
    vars[`--mosaic-${token}`] = tokens[token];
  });
  return vars;
};

export const tokenToVar = (token: ThemeTokenName) => `var(--mosaic-${token})`;

export const toCssText = (options: ThemeOptions, tokens: ThemeTokens): string => {
  const lines = Object.entries(tokens)
    .map(([key, value]) => `  --mosaic-${key}: ${value};`)
    .join("\n");
  return `:root {\n  color-scheme: ${options.appearance};\n${lines}\n}`;
};
