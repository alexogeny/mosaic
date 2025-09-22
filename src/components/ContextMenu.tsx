import {
  cloneElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { Portal } from "../utils/Portal";
import { cx } from "../utils/cx";
import { ShortcutsContext } from "../shortcuts/ShortcutsProvider";

export interface ContextMenuItem {
  id?: string;
  label?: ReactNode;
  shortcut?: string | string[];
  disabled?: boolean;
  separator?: boolean;
  onSelect?: () => void;
  icon?: ReactNode;
}

export interface ContextMenuProps {
  children: ReactElement;
  items: ContextMenuItem[];
  className?: string;
  ariaLabel?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const composeEventHandlers = <E extends { defaultPrevented: boolean }>(
  originalHandler: ((event: E) => void) | undefined,
  ourHandler: (event: E) => void,
) => (event: E) => {
  originalHandler?.(event);
  if (!event.defaultPrevented) {
    ourHandler(event);
  }
};

type FormattedItem = ContextMenuItem & { shortcutLabel?: string };

const focusableIndex = (items: FormattedItem[], start: number, direction: 1 | -1) => {
  const count = items.length;
  let index = start;
  for (let i = 0; i < count; i += 1) {
    index = (index + direction + count) % count;
    const item = items[index];
    if (!item.separator && !item.disabled) {
      return index;
    }
  }
  return start;
};

export const ContextMenu = ({ children, items, className, ariaLabel }: ContextMenuProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shortcutsContext = useContext(ShortcutsContext);

  const formattedItems = useMemo<FormattedItem[]>(() => {
    return items.map((item) => {
      if (!item.shortcut) {
        return { ...item, shortcutLabel: undefined };
      }
      const label = shortcutsContext
        ? shortcutsContext.formatShortcut(item.shortcut)
        : Array.isArray(item.shortcut)
          ? item.shortcut.join(" / ")
          : item.shortcut;
      return { ...item, shortcutLabel: label };
    });
  }, [items, shortcutsContext]);

  const openMenu = (clientX: number, clientY: number) => {
    setPosition({ x: clientX, y: clientY });
    setOpen(true);
    const firstEnabled = formattedItems.findIndex((item) => !item.separator && !item.disabled);
    setActiveIndex(firstEnabled === -1 ? 0 : firstEnabled);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    const handleScroll = () => closeMenu();
    const handleResize = () => closeMenu();
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => menuRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const maxX = clamp(position.x, 8, window.innerWidth - rect.width - 8);
    const maxY = clamp(position.y, 8, window.innerHeight - rect.height - 8);
    if (maxX !== position.x || maxY !== position.y) {
      setPosition({ x: maxX, y: maxY });
    }
  }, [open, position.x, position.y]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    openMenu(event.clientX, event.clientY);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => focusableIndex(formattedItems, index, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => focusableIndex(formattedItems, index, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      const first = formattedItems.findIndex((item) => !item.separator && !item.disabled);
      if (first !== -1) setActiveIndex(first);
    } else if (event.key === "End") {
      event.preventDefault();
      const last = [...formattedItems].reverse().findIndex((item) => !item.separator && !item.disabled);
      if (last !== -1) setActiveIndex(formattedItems.length - 1 - last);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = formattedItems[activeIndex];
      if (item && !item.disabled && !item.separator) {
        item.onSelect?.();
        closeMenu();
      }
    }
  };

  const triggerProps = {
    onContextMenu: composeEventHandlers(children.props.onContextMenu, handleContextMenu),
    onKeyDown: composeEventHandlers(children.props.onKeyDown, (event: ReactKeyboardEvent) => {
      if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
        event.preventDefault();
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        openMenu(rect.left, rect.bottom);
      }
    }),
  };

  const content = (
    <div
      ref={menuRef}
      className={cx("mosaic-context-menu", className)}
      role="menu"
      tabIndex={-1}
      style={{ top: position.y, left: position.x }}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {formattedItems.map((item, index) => {
        if (item.separator) {
          return <div key={item.id ?? `separator-${index}`} className="mosaic-context-menu__separator" role="separator" />;
        }
        const disabled = item.disabled ?? false;
        const isActive = index === activeIndex;
        return (
          <button
            key={item.id ?? index}
            type="button"
            className={cx("mosaic-context-menu__item", {
              "mosaic-context-menu__item--active": isActive,
            })}
            role="menuitem"
            data-disabled={disabled ? "true" : undefined}
            tabIndex={-1}
            disabled={disabled}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => {
              if (disabled) return;
              item.onSelect?.();
              closeMenu();
            }}
          >
            {item.icon ? <span className="mosaic-context-menu__icon">{item.icon}</span> : null}
            <span className="mosaic-context-menu__label">{item.label}</span>
            {item.shortcutLabel ? (
              <span className="mosaic-context-menu__shortcut">{item.shortcutLabel}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {cloneElement(children, triggerProps)}
      {open ? <Portal>{content}</Portal> : null}
    </>
  );
};
