import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

const isBrowser = typeof window !== "undefined";

const isMacPlatform = () => {
  if (!isBrowser) return false;
  const platform = window.navigator.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform);
};

const modifierOrder = ["ctrl", "meta", "alt", "shift"] as const;

type Modifier = typeof modifierOrder[number];

type NormalizedCombo = string;

const normalizeKey = (key: string): string => {
  const lower = key.toLowerCase();
  switch (lower) {
    case " ":
    case "spacebar":
      return "space";
    case "escape":
      return "esc";
    case "arrowup":
      return "arrowup";
    case "arrowdown":
      return "arrowdown";
    case "arrowleft":
      return "arrowleft";
    case "arrowright":
      return "arrowright";
    case "enter":
    case "return":
      return "enter";
    case "delete":
    case "del":
      return "delete";
    case "backspace":
      return "backspace";
    case "tab":
      return "tab";
    default:
      return lower;
  }
};

const modifierAlias: Record<string, Modifier | "mod"> = {
  cmd: "meta",
  command: "meta",
  meta: "meta",
  win: "meta",
  windows: "meta",
  control: "ctrl",
  ctrl: "ctrl",
  option: "alt",
  alt: "alt",
  shift: "shift",
};

const sortModifiers = (modifiers: Set<Modifier>): Modifier[] => {
  return modifierOrder.filter((modifier) => modifiers.has(modifier));
};

const expandCombo = (combo: string): NormalizedCombo[] => {
  const parts = combo
    .split("+")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => token.toLowerCase());

  const modifiers = new Set<Modifier>();
  let key: string | undefined;
  let hasMod = false;

  parts.forEach((part) => {
    if (part === "mod") {
      hasMod = true;
      return;
    }
    const alias = modifierAlias[part];
    if (alias) {
      if (alias === "mod") {
        hasMod = true;
        return;
      }
      modifiers.add(alias);
      return;
    }
    key = normalizeKey(part);
  });

  if (!key) return [];

  const combos: NormalizedCombo[] = [];
  const base = sortModifiers(modifiers);

  const buildCombo = (mods: Modifier[]) => {
    return [...mods, key!].join("+");
  };

  if (hasMod) {
    combos.push(buildCombo([...base, "meta"] as Modifier[]));
    combos.push(buildCombo([...base, "ctrl"] as Modifier[]));
  } else {
    combos.push(buildCombo(base));
  }

  return Array.from(new Set(combos));
};

const normalizeCombo = (combo: string): NormalizedCombo[] => {
  const trimmed = combo.trim();
  if (!trimmed) return [];
  return expandCombo(trimmed);
};

const eventToCombo = (event: KeyboardEvent): NormalizedCombo | null => {
  const key = normalizeKey(event.key);
  if (!key || modifierAlias[key] || key === "mod") return null;

  const modifiers = new Set<Modifier>();
  if (event.ctrlKey) modifiers.add("ctrl");
  if (event.metaKey) modifiers.add("meta");
  if (event.altKey) modifiers.add("alt");
  if (event.shiftKey) modifiers.add("shift");

  if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
    // do not trigger on plain keys in text inputs
    return key.length === 1 ? key : key;
  }

  return [...sortModifiers(modifiers), key].join("+");
};

const isEditableElement = (element: EventTarget | null): element is HTMLElement => {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tag = element.tagName;
  return (
    element.isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  );
};

export interface ShortcutConfig {
  id?: string;
  title?: string;
  description?: string;
  section?: string;
  keywords?: string[];
  combo?: string | string[];
  run: (event?: KeyboardEvent) => void;
  allowInInput?: boolean;
  preventDefault?: boolean;
  hidden?: boolean;
}

export interface RegisteredShortcut extends ShortcutConfig {
  id: string;
  combos: NormalizedCombo[];
  displayCombo: string | null;
  hidden: boolean;
}

export interface CommandPaletteApi {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

interface ShortcutsContextValue {
  registerShortcut: (config: ShortcutConfig) => () => void;
  shortcuts: RegisteredShortcut[];
  formatShortcut: (combo: string | string[]) => string;
  isMac: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  setPaletteApi: (api: CommandPaletteApi | null) => void;
}

export const ShortcutsContext = createContext<ShortcutsContextValue | undefined>(undefined);

const formatKeyLabel = (key: string): string => {
  switch (key) {
    case "arrowup":
      return "↑";
    case "arrowdown":
      return "↓";
    case "arrowleft":
      return "←";
    case "arrowright":
      return "→";
    case "esc":
      return "Esc";
    case "enter":
      return "Enter";
    case "space":
      return "Space";
    case "backspace":
      return "Backspace";
    case "delete":
      return "Delete";
    case "tab":
      return "Tab";
    case "home":
      return "Home";
    case "end":
      return "End";
    case "pageup":
      return "Page Up";
    case "pagedown":
      return "Page Down";
    default:
      if (key.length === 1) {
        return key.toUpperCase();
      }
      return key
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (segment) => segment.toUpperCase());
  }
};

const macSymbols: Record<string, string> = {
  meta: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  shift: "⇧",
};

const pcLabels: Record<string, string> = {
  meta: "Win",
  ctrl: "Ctrl",
  alt: "Alt",
  shift: "Shift",
};

let idCounter = 0;

const createId = () => {
  idCounter += 1;
  return `shortcut-${idCounter}`;
};

const ensureArray = <T,>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const ShortcutsProvider = ({ children }: PropsWithChildren) => {
  const [entries, setEntries] = useState<Map<string, RegisteredShortcut>>(() => new Map());
  const entriesRef = useRef(entries);
  const isMac = useMemo(() => isMacPlatform(), []);
  const paletteRef = useRef<CommandPaletteApi | null>(null);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  const formatShortcut = useCallback(
    (combo: string | string[]): string => {
      const combos = ensureArray(combo)
        .flatMap((value) => normalizeCombo(value))
        .filter(Boolean);
      if (combos.length === 0) return "";
      const preferred =
        combos.find((value) => (isMac ? value.includes("meta") : value.includes("ctrl"))) ??
        combos[0];
      const parts = preferred.split("+");
      const key = parts.pop() ?? "";
      const formattedModifiers = parts.map((modifier) =>
        isMac ? macSymbols[modifier] ?? modifier.toUpperCase() : pcLabels[modifier] ?? modifier.toUpperCase(),
      );
      const keyLabel = formatKeyLabel(key);
      const joiner = isMac ? " " : " + ";
      return [...formattedModifiers, keyLabel].join(joiner).trim();
    },
    [isMac],
  );

  const registerShortcut = useCallback(
    (config: ShortcutConfig) => {
      const id = config.id ?? createId();
      const combos = ensureArray(config.combo).flatMap((value) => normalizeCombo(value));
      const displayCombo = combos.length > 0 ? formatShortcut(combos) : null;
      const entry: RegisteredShortcut = {
        ...config,
        id,
        combos,
        displayCombo,
        hidden: Boolean(config.hidden),
      };
      setEntries((prev) => {
        const next = new Map(prev);
        next.set(id, entry);
        return next;
      });
      return () => {
        setEntries((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      };
    },
    [formatShortcut],
  );

  const openPalette = useCallback(() => {
    paletteRef.current?.open();
  }, []);

  const closePalette = useCallback(() => {
    paletteRef.current?.close();
  }, []);

  const togglePalette = useCallback(() => {
    paletteRef.current?.toggle();
  }, []);

  const setPaletteApi = useCallback((api: CommandPaletteApi | null) => {
    paletteRef.current = api;
  }, []);

  useEffect(() => {
    return registerShortcut({
      id: "mosaic.command-palette",
      title: "Toggle command palette",
      combo: "mod+k",
      run: () => {
        togglePalette();
      },
      hidden: true,
      preventDefault: true,
    });
  }, [registerShortcut, togglePalette]);

  useEffect(() => {
    if (!isBrowser) return;
    const handler = (event: KeyboardEvent) => {
      const combo = eventToCombo(event);
      if (!combo) return;
      const target = event.target as HTMLElement | null;
      entriesRef.current.forEach((entry) => {
        if (!entry.combos.includes(combo)) return;
        if (!entry.allowInInput && isEditableElement(target)) return;
        if (entry.preventDefault !== false) {
          event.preventDefault();
        }
        entry.run(event);
      });
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const shortcuts = useMemo(() => Array.from(entries.values()), [entries]);

  const value = useMemo<ShortcutsContextValue>(
    () => ({
      registerShortcut,
      shortcuts,
      formatShortcut,
      isMac,
      openPalette,
      closePalette,
      togglePalette,
      setPaletteApi,
    }),
    [registerShortcut, shortcuts, formatShortcut, isMac, openPalette, closePalette, togglePalette, setPaletteApi],
  );

  return <ShortcutsContext.Provider value={value}>{children}</ShortcutsContext.Provider>;
};

export const useShortcuts = () => {
  const context = useContext(ShortcutsContext);
  if (!context) {
    throw new Error("useShortcuts must be used within a ShortcutsProvider");
  }
  return context;
};

export const useShortcut = (config: ShortcutConfig, deps: unknown[] = []) => {
  const { registerShortcut } = useShortcuts();
  useEffect(() => {
    return registerShortcut(config);
  }, [registerShortcut, ...deps]);
};

export const useCommand: typeof useShortcut = (config, deps) => {
  useShortcut(config, deps);
};

export type { ShortcutConfig as CommandConfig };
