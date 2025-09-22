import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PropsWithChildren,
} from "react";
import { Dialog } from "./Dialog";
import { useShortcuts } from "../shortcuts/ShortcutsProvider";
import { cx } from "../utils/cx";

interface CommandPaletteContextValue {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | undefined>(undefined);

interface CommandPaletteHookResult extends CommandPaletteContextValue {
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  isPaletteOpen: boolean;
}

export interface CommandPaletteProps extends PropsWithChildren {
  placeholder?: string;
  emptyMessage?: string;
  title?: string;
  maxResults?: number;
}

export const CommandPalette = ({
  children,
  placeholder = "Search commands…",
  emptyMessage = "No results found",
  title = "Command palette",
  maxResults = 50,
}: CommandPaletteProps) => {
  const { shortcuts, formatShortcut, setPaletteApi } = useShortcuts();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCommandId, setActiveCommandId] = useState<string | null>(null);
  const inputId = useId();
  const listboxId = useId();

  const commands = useMemo(() => {
    const unique = new Map<string, typeof shortcuts[number]>();
    shortcuts.forEach((shortcut) => {
      if (shortcut.hidden) return;
      if (!shortcut.title) return;
      unique.set(shortcut.id, shortcut);
    });
    return Array.from(unique.values());
  }, [shortcuts]);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) {
      return commands;
    }
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
      return commands;
    }
    return commands.filter((command) => {
      const haystack = [
        command.title ?? "",
        command.description ?? "",
        command.section ?? "",
        ...(command.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [commands, normalizedQuery]);

  const limited = useMemo(() => filtered.slice(0, maxResults), [filtered, maxResults]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof limited>();
    limited.forEach((command) => {
      const section = command.section ?? "General";
      if (!map.has(section)) {
        map.set(section, []);
      }
      map.get(section)!.push(command);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([section, items]) => ({
        section,
        items: items.slice().sort((a, b) => (a.title ?? "").localeCompare(b.title ?? "")),
      }));
  }, [limited]);

  const flat = useMemo(() => {
    const entries: { group: string; command: typeof limited[number] }[] = [];
    grouped.forEach((group) => {
      group.items.forEach((command) => {
        entries.push({ group: group.section, command });
      });
    });
    return entries;
  }, [grouped]);

  const paletteShortcut = useMemo(() => formatShortcut("mod+k"), [formatShortcut]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveCommandId(null);
    }
  }, [open]);

  const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    flat.forEach((entry, index) => {
      map.set(entry.command.id, index);
    });
    return map;
  }, [flat]);

  useEffect(() => {
    if (!open) return;
    if (flat.length === 0) {
      setActiveCommandId(null);
      return;
    }
    setActiveCommandId((currentId) => {
      if (currentId && indexMap.has(currentId)) {
        return currentId;
      }
      const first = flat[0];
      return first ? first.command.id : null;
    });
  }, [flat, indexMap, open]);

  const activeIndex = activeCommandId ? indexMap.get(activeCommandId) ?? -1 : -1;

  useEffect(() => {
    if (!open) return;
    if (activeIndex < 0) return;
    const active = flat[activeIndex];
    if (!active) return;
    const node = document.getElementById(`mosaic-command-${active.command.id}`);
    if (node && "scrollIntoView" in node) {
      node.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, flat, open]);

  useEffect(() => {
    const api = {
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((prev) => !prev),
      isOpen: () => open,
    };
    setPaletteApi(api);
    return () => setPaletteApi(null);
  }, [open, setPaletteApi]);

  const handleSelect = useCallback(
    (command: typeof limited[number]) => {
      setOpen(false);
      setTimeout(() => {
        command.run?.();
      }, 0);
    },
    [],
  );

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      if (flat.length === 0) return;
      setActiveCommandId((currentId) => {
        const fallbackIndex = direction > 0 ? -1 : flat.length;
        const currentIndex = currentId ? indexMap.get(currentId) ?? fallbackIndex : fallbackIndex;
        const nextIndex = Math.min(Math.max(currentIndex + direction, 0), flat.length - 1);
        const next = flat[nextIndex];
        return next ? next.command.id : null;
      });
    },
    [flat, indexMap],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        const first = flat[0];
        setActiveCommandId(first ? first.command.id : null);
      } else if (event.key === "End") {
        event.preventDefault();
        const last = flat[flat.length - 1];
        setActiveCommandId(last ? last.command.id : null);
      } else if (event.key === "Enter") {
        event.preventDefault();
        const id = activeCommandId ?? flat[0]?.command.id;
        if (!id) return;
        const index = indexMap.get(id);
        if (typeof index === "number") {
          const active = flat[index];
          if (active) {
            handleSelect(active.command);
          }
        }
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    },
    [activeCommandId, flat, handleSelect, indexMap, moveActive],
  );

  const contextValue = useMemo<CommandPaletteContextValue>(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((prev) => !prev),
      isOpen: open,
    }),
    [open],
  );

  const activeId = activeIndex >= 0 ? activeCommandId ?? undefined : undefined;

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      <Dialog
        open={open}
        onOpenChange={setOpen}
        variant="command"
        showCloseButton={false}
        size="lg"
        title={title}
        bodyClassName="mosaic-command"
      >
        <div className="mosaic-command__search">
          <label className="mosaic-command__label" htmlFor={inputId}>
            <span className="mosaic-command__label-text">{placeholder}</span>
            {paletteShortcut ? (
              <span className="mosaic-command__shortcut">{paletteShortcut}</span>
            ) : null}
          </label>
          <input
            id={inputId}
            className="mosaic-command__input"
            placeholder={placeholder}
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeId ? `mosaic-command-${activeId}` : undefined}
            aria-autocomplete="list"
          />
        </div>
        <div className="mosaic-command__results">
          {flat.length === 0 ? (
            <div className="mosaic-command__empty">{emptyMessage}</div>
          ) : (
            <div className="mosaic-command__list" role="listbox" id={listboxId}>
              {grouped.map((group) => (
                <div key={group.section} className="mosaic-command__section" role="presentation">
                  <div className="mosaic-command__section-label">{group.section}</div>
                  {group.items.map((command) => {
                    const isActive = command.id === activeId;
                    const shortcut = command.displayCombo ?? null;
                    return (
                      <div
                        key={command.id}
                        id={`mosaic-command-${command.id}`}
                        role="option"
                        aria-selected={isActive}
                        className={cx("mosaic-command__option", {
                          "mosaic-command__option--active": isActive,
                        })}
                        onMouseEnter={() => setActiveCommandId(command.id)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelect(command)}
                      >
                        <div className="mosaic-command__option-main">
                          <span className="mosaic-command__option-title">{command.title}</span>
                          {command.description ? (
                            <span className="mosaic-command__option-description">{command.description}</span>
                          ) : null}
                        </div>
                        {shortcut ? <span className="mosaic-command__option-shortcut">{shortcut}</span> : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </Dialog>
    </CommandPaletteContext.Provider>
  );
};

export const useCommandPalette = (): CommandPaletteHookResult => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error("useCommandPalette must be used within CommandPalette");
  }
  return useMemo(
    () => ({
      ...context,
      openPalette: context.open,
      closePalette: context.close,
      togglePalette: context.toggle,
      isPaletteOpen: context.isOpen,
    }),
    [context],
  );
};
