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
  indigo: "#4338ca",
  azure: "#1d4ed8",
  violet: "#6d28d9",
  emerald: "#047857",
  amber: "#f59e0b",
  rose: "#e11d48",
  neutral: "#18181b",
};

const semanticDefaults = {
  success: "#16a34a",
  warning: "#f97316",
  danger: "#dc2626",
  neutral: "#71717a",
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
  background: "#f5f6fa",
  surface: "#ffffff",
  surfaceHover: "#eef1f8",
  surfaceActive: "#e1e6f0",
  border: "#d7deeb",
};

const baseDark = {
  background: "#050b1c",
  surface: "#0b1220",
  surfaceHover: "#141d2e",
  surfaceActive: "#1d2739",
  border: "#2a3448",
};

const lighten = (color: string, amount: number) => mix(color, "#ffffff", amount);
const darken = (color: string, amount: number) => mix(color, "#000000", amount);

const neutralFromAppearance = (appearance: Appearance) =>
  appearance === "light" ? "#1c2534" : "#c9d4f8";

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

  const textBase = highContrast
    ? highContrastText(appearance)
    : appearance === "light"
      ? "#0f172a"
      : "#e2e8f0";
  const textMuted = appearance === "light" ? "#475569" : "#94a3b8";
  const textSubtle = appearance === "light" ? "#64748b" : "#cbd5f5";
  const inverted = appearance === "light" ? "#020817" : "#f8fafc";

  const neutralSoftBase = appearance === "light" ? lighten(neutral, 0.9) : darken(neutral, 0.55);

  const successSoft = appearance === "light" ? lighten(success, 0.9) : darken(success, 0.55);
  const successBorder = appearance === "light" ? lighten(success, 0.65) : darken(success, 0.35);
  const warningSoft = appearance === "light" ? lighten(warning, 0.9) : darken(warning, 0.55);
  const warningBorder = appearance === "light" ? lighten(warning, 0.65) : darken(warning, 0.35);
  const dangerSoft = appearance === "light" ? lighten(danger, 0.9) : darken(danger, 0.55);
  const dangerBorder = appearance === "light" ? lighten(danger, 0.65) : darken(danger, 0.35);

  const tokens: ThemeTokens = {
    "color-background": surface.background,
    "color-surface": surface.surface,
    "color-surface-hover": surface.surfaceHover,
    "color-surface-active": surface.surfaceActive,
    "color-border": surface.border,
    "color-ring": ensureContrast(
      appearance === "light" ? lighten(primary, 0.4) : darken(primary, 0.35),
      surface.background,
      highContrast ? 7 : 5,
    ),
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
    "color-primary-soft": appearance === "light" ? lighten(primary, 0.92) : darken(primary, 0.55),
    "color-primary-border": appearance === "light" ? lighten(primary, 0.65) : darken(primary, 0.35),
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
    "color-neutral-border": appearance === "light" ? lighten(neutral, 0.72) : darken(neutral, 0.5),
    "font-family-base": "'Inter var', 'Inter', 'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
    "radius-sm": "0.25rem",
    "radius-md": "0.375rem",
    "radius-lg": "0.5rem",
    "shadow-sm": appearance === "light"
      ? "0 1px 0 rgba(15, 23, 42, 0.08)"
      : "0 1px 0 rgba(2, 6, 23, 0.6)",
    "shadow-md": appearance === "light"
      ? "0 6px 12px -6px rgba(15, 23, 42, 0.16)"
      : "0 6px 12px -6px rgba(2, 6, 23, 0.65)",
    "shadow-lg": appearance === "light"
      ? "0 18px 48px -24px rgba(15, 23, 42, 0.28)"
      : "0 20px 52px -26px rgba(2, 6, 23, 0.7)",
    "border-width": highContrast ? "2px" : "1px",
    "motion-duration": reducedMotion ? "0ms" : "180ms",
    "motion-ease": reducedMotion ? "linear" : "cubic-bezier(0.16, 1, 0.3, 1)",
    "spacing-xs": "0.375rem",
    "spacing-sm": "0.75rem",
    "spacing-md": "1.125rem",
    "spacing-lg": "1.5rem",
  };

  if (colorVision === "achromatopsia") {
    tokens["color-primary-soft"] = lighten(tokens["color-primary"], appearance === "light" ? 0.6 : 0.3);
    tokens["color-success"] = ensureContrast(tokens["color-success"], surface.background, 7);
    tokens["color-warning"] = ensureContrast(tokens["color-warning"], surface.background, 7);
    tokens["color-danger"] = ensureContrast(tokens["color-danger"], surface.background, 7);
  }

  if (highContrast) {
    tokens["shadow-sm"] = "0 0 0 0 transparent";
    tokens["shadow-md"] = "0 0 0 0 transparent";
    tokens["shadow-lg"] = "0 0 0 0 transparent";
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
