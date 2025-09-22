import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from "react";
import { useIsomorphicLayoutEffect } from "../utils/use-isomorphic-layout-effect";
import {
  type Accent,
  type Appearance,
  type ColorVisionMode,
  type PartialThemeOptions,
  type ThemeContextValue,
  type ThemeOptions,
  type ThemeState,
  type ThemeTokenName,
} from "./types";
import {
  createThemeTokens,
  tokenToVar,
  tokensToCssVariables,
  toCssText,
} from "./color";
import { baseStyles } from "./baseStyles";

const defaultOptions: ThemeOptions = {
  appearance: "light",
  accent: "indigo",
  colorVision: "normal",
  highContrast: false,
  reducedMotion: false,
};

type StoredTheme = Pick<
  ThemeOptions,
  "appearance" | "accent" | "colorVision" | "highContrast" | "reducedMotion"
>;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

const readStoredTheme = (storageKey?: string): Partial<StoredTheme> => {
  if (!storageKey || !canUseDOM) return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredTheme;
    return parsed;
  } catch (error) {
    console.warn("mosaic: failed to parse stored theme", error);
    return {};
  }
};

const storeTheme = (storageKey: string | undefined, options: StoredTheme) => {
  if (!storageKey || !canUseDOM) return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(options));
  } catch (error) {
    console.warn("mosaic: failed to persist theme", error);
  }
};

const getSystemPreferences = (): PartialThemeOptions => {
  if (!canUseDOM) return {};
  const preferences: PartialThemeOptions = {};
  try {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      preferences.appearance = "dark";
    }
  } catch {
    /* noop */
  }
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      preferences.reducedMotion = true;
    }
  } catch {
    /* noop */
  }
  try {
    if (window.matchMedia("(prefers-contrast: more)").matches) {
      preferences.highContrast = true;
    }
  } catch {
    /* noop */
  }
  return preferences;
};

const mergeOptions = (
  base: ThemeOptions,
  overrides: PartialThemeOptions,
): ThemeOptions => ({
  ...base,
  ...overrides,
});

const createState = (options: ThemeOptions): ThemeState => ({
  ...options,
  tokens: createThemeTokens(options),
});

export interface ThemeProviderProps extends PropsWithChildren {
  initialTheme?: PartialThemeOptions;
  syncWithSystem?: boolean;
  storageKey?: string;
}

export const ThemeProvider = ({
  children,
  initialTheme,
  syncWithSystem = true,
  storageKey,
}: ThemeProviderProps) => {
  const [options, setOptions] = useState<ThemeOptions>(() => {
    const stored = readStoredTheme(storageKey);
    const system = getSystemPreferences();
    return mergeOptions(defaultOptions, {
      ...system,
      ...initialTheme,
      ...stored,
    });
  });

  const state = useMemo(() => createState(options), [options]);

  const cssVariables = useMemo(() => {
    const entries = tokensToCssVariables(state.tokens);
    const style: Record<string, string> = {};
    Object.entries(entries).forEach(([key, value]) => {
      style[key] = value;
    });
    style.colorScheme = state.appearance;
    return style as CSSProperties;
  }, [state.appearance, state.tokens]);

  const cssText = useMemo(() => toCssText(state, state.tokens), [state.appearance, state.tokens]);

  useIsomorphicLayoutEffect(() => {
    if (!canUseDOM) return;
    const root = document.documentElement;
    root.setAttribute("data-mosaic-theme", state.appearance);
    root.setAttribute("data-mosaic-color-vision", state.colorVision);
    root.setAttribute("data-mosaic-high-contrast", state.highContrast ? "true" : "false");
    root.setAttribute("data-mosaic-reduced-motion", state.reducedMotion ? "true" : "false");

    const entries = tokensToCssVariables(state.tokens);
    Object.entries(entries).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.style.setProperty("color-scheme", state.appearance);

    return () => {
      root.removeAttribute("data-mosaic-theme");
      root.removeAttribute("data-mosaic-color-vision");
      root.removeAttribute("data-mosaic-high-contrast");
      root.removeAttribute("data-mosaic-reduced-motion");
    };
  }, [state]);

  useIsomorphicLayoutEffect(() => {
    if (!storageKey) return;
    storeTheme(storageKey, {
      appearance: state.appearance,
      accent: state.accent,
      colorVision: state.colorVision,
      highContrast: state.highContrast,
      reducedMotion: state.reducedMotion,
    });
  }, [state, storageKey]);

  useIsomorphicLayoutEffect(() => {
    if (!syncWithSystem || !canUseDOM) return;
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let highContrast: MediaQueryList | undefined;
    try {
      highContrast = window.matchMedia("(prefers-contrast: more)");
    } catch {
      highContrast = undefined;
    }

    const handleAppearance = () => {
      setOptions((prev) => ({
        ...prev,
        appearance: colorScheme.matches ? "dark" : "light",
      }));
    };
    const handleMotion = () => {
      setOptions((prev) => ({
        ...prev,
        reducedMotion: reducedMotion.matches,
      }));
    };
    const handleContrast = () => {
      if (!highContrast) return;
      setOptions((prev) => ({
        ...prev,
        highContrast: highContrast!.matches,
      }));
    };

    colorScheme.addEventListener("change", handleAppearance);
    reducedMotion.addEventListener("change", handleMotion);
    if (highContrast) {
      highContrast.addEventListener("change", handleContrast);
    }

    return () => {
      colorScheme.removeEventListener("change", handleAppearance);
      reducedMotion.removeEventListener("change", handleMotion);
      if (highContrast) {
        highContrast.removeEventListener("change", handleContrast);
      }
    };
  }, [syncWithSystem]);

  const setAppearance = useCallback((appearance: Appearance) => {
    setOptions((prev) => ({ ...prev, appearance }));
  }, []);

  const toggleAppearance = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      appearance: prev.appearance === "light" ? "dark" : "light",
    }));
  }, []);

  const setAccent = useCallback((accent: Accent) => {
    setOptions((prev) => ({ ...prev, accent }));
  }, []);

  const setColorVision = useCallback((mode: ColorVisionMode) => {
    setOptions((prev) => ({ ...prev, colorVision: mode }));
  }, []);

  const setHighContrast = useCallback((value: boolean) => {
    setOptions((prev) => ({ ...prev, highContrast: value }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setOptions((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const setReducedMotion = useCallback((value: boolean) => {
    setOptions((prev) => ({ ...prev, reducedMotion: value }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setOptions((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  }, []);

  const context = useMemo<ThemeContextValue>(() => ({
    ...state,
    setAppearance,
    toggleAppearance,
    setAccent,
    setColorVision,
    setHighContrast,
    toggleHighContrast,
    setReducedMotion,
    toggleReducedMotion,
    getVar: (token: ThemeTokenName) => state.tokens[token],
    cssVariables,
  }), [
    state,
    setAppearance,
    toggleAppearance,
    setAccent,
    setColorVision,
    setHighContrast,
    toggleHighContrast,
    setReducedMotion,
    toggleReducedMotion,
    cssVariables,
  ]);

  return (
    <ThemeContext.Provider value={context}>
      <style data-mosaic-base="" dangerouslySetInnerHTML={{ __html: baseStyles }} />
      <style data-mosaic-theme="" dangerouslySetInnerHTML={{ __html: cssText }} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useThemeValue = (token: ThemeTokenName) => {
  const { getVar } = useTheme();
  return getVar(token);
};

export const getCssVar = (token: ThemeTokenName) => tokenToVar(token);
