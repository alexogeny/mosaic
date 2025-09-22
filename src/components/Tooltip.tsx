import {
  cloneElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";
import { Portal } from "../utils/Portal";
import { cx } from "../utils/cx";
import { ShortcutsContext } from "../shortcuts/ShortcutsProvider";

const canUseDOM = typeof window !== "undefined";

type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "center" | "start" | "end";

const composeEventHandlers = <E extends { defaultPrevented: boolean }>(
  originalHandler: ((event: E) => void) | undefined,
  ourHandler: (event: E) => void,
) => {
  return (event: E) => {
    originalHandler?.(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export interface TooltipProps {
  children: ReactElement;
  label: React.ReactNode;
  shortcut?: string | string[];
  side?: TooltipSide;
  align?: TooltipAlign;
  delay?: number;
  id?: string;
  className?: string;
}

export const Tooltip = ({
  children,
  label,
  shortcut,
  side = "top",
  align = "center",
  delay = 120,
  id,
  className,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<number>();
  const hideTimer = useRef<number>();
  const tooltipId = id ?? useId();
  const shortcutsContext = useContext(ShortcutsContext);

  const formattedShortcut = useMemo(() => {
    if (!shortcut) return null;
    const formatter = shortcutsContext?.formatShortcut;
    if (formatter) {
      return formatter(shortcut);
    }
    if (Array.isArray(shortcut)) {
      return shortcut.join(" / ");
    }
    return shortcut;
  }, [shortcut, shortcutsContext]);

  const clearTimers = () => {
    if (showTimer.current) {
      window.clearTimeout(showTimer.current);
      showTimer.current = undefined;
    }
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = undefined;
    }
  };

  const openTooltip = () => {
    clearTimers();
    showTimer.current = window.setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const closeTooltip = () => {
    clearTimers();
    hideTimer.current = window.setTimeout(() => {
      setVisible(false);
    }, 60);
  };

  useEffect(() => () => clearTimers(), []);

  const computePosition = () => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const offset = 8;
    let top = 0;
    let left = 0;

    switch (side) {
      case "bottom":
        top = rect.bottom + offset;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + offset;
        break;
      case "top":
      default:
        top = rect.top - tooltipRect.height - offset;
        break;
    }

    if (side === "top" || side === "bottom") {
      switch (align) {
        case "start":
          left = rect.left;
          break;
        case "end":
          left = rect.right - tooltipRect.width;
          break;
        case "center":
        default:
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
      }
    } else {
      switch (align) {
        case "start":
          top = rect.top;
          break;
        case "end":
          top = rect.bottom - tooltipRect.height;
          break;
        case "center":
        default:
          break;
      }
      if (side === "left") {
        left = rect.left - tooltipRect.width - offset;
      } else if (side === "right") {
        left = rect.right + offset;
      }
    }

    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const clampedTop = clamp(top, 8, viewHeight - tooltipRect.height - 8);
    const clampedLeft = clamp(left, 8, viewWidth - tooltipRect.width - 8);

    setPosition({ top: clampedTop, left: clampedLeft });
  };

  useEffect(() => {
    if (!visible || !canUseDOM) return;
    computePosition();
    const handleUpdate = () => computePosition();
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);
    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [visible, side, align]);

  const setTrigger = (node: HTMLElement | null) => {
    triggerRef.current = node;
    const originalRef = (children as any).ref;
    if (typeof originalRef === "function") {
      originalRef(node);
    } else if (originalRef && typeof originalRef === "object") {
      originalRef.current = node;
    }
  };

  const describedBy = children.props["aria-describedby"] as string | undefined;
  const triggerProps = {
    ref: setTrigger,
    onMouseEnter: composeEventHandlers(children.props.onMouseEnter, openTooltip),
    onMouseLeave: composeEventHandlers(children.props.onMouseLeave, closeTooltip),
    onFocus: composeEventHandlers(children.props.onFocus, openTooltip),
    onBlur: composeEventHandlers(children.props.onBlur, closeTooltip),
    onKeyDown: composeEventHandlers(children.props.onKeyDown, (event: ReactKeyboardEvent) => {
      if (event.key === "Escape") {
        closeTooltip();
      }
    }),
    "aria-describedby": visible
      ? [describedBy, tooltipId].filter(Boolean).join(" ")
      : describedBy,
  };

  return (
    <>
      {cloneElement(children, triggerProps)}
      {visible ? (
        <Portal>
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className={cx("mosaic-tooltip", className)}
            data-side={side}
            data-align={align}
            style={{ top: position.top, left: position.left }}
          >
            <span className="mosaic-tooltip__label">{label}</span>
            {formattedShortcut ? (
              <span className="mosaic-tooltip__shortcut">{formattedShortcut}</span>
            ) : null}
          </div>
        </Portal>
      ) : null}
    </>
  );
};
