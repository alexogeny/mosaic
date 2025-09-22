import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { Portal } from "../utils/Portal";
import { cx } from "../utils/cx";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const findFocusable = (container: HTMLElement | null) => {
  if (!container) return [] as HTMLElement[];
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter((element) =>
    !element.hasAttribute("data-mosaic-focus-guard"),
  );
};

export type DialogVariant = "default" | "sheet" | "command";
export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";
export type SheetSide = "left" | "right" | "bottom";

export interface DialogProps extends PropsWithChildren {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  variant?: DialogVariant;
  side?: SheetSide;
  size?: DialogSize;
  initialFocusRef?: React.RefObject<HTMLElement>;
  showCloseButton?: boolean;
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  className?: string;
  bodyClassName?: string;
}

export const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  variant = "default",
  side = "right",
  size = "md",
  initialFocusRef,
  showCloseButton = true,
  closeLabel = "Close dialog",
  closeOnOverlayClick = true,
  className,
  bodyClassName,
}: DialogProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<Element | null>(null);
  const labelId = useId();
  const descriptionId = useId();

  const close = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open || !canUseDOM) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !canUseDOM) return;
    lastFocusedRef.current = document.activeElement;
    const content = contentRef.current;
    const initial = initialFocusRef?.current;
    const focusables = findFocusable(content);
    const target = initial ?? focusables[0] ?? content;
    target?.focus({ preventScroll: true });
    return () => {
      const previous = lastFocusedRef.current as HTMLElement | null;
      if (previous && typeof previous.focus === "function") {
        previous.focus({ preventScroll: true });
      }
      lastFocusedRef.current = null;
    };
  }, [open, initialFocusRef]);

  useEffect(() => {
    if (!open || !canUseDOM) return;
    const content = contentRef.current;
    if (!content) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab") {
        const focusables = findFocusable(content);
        if (focusables.length === 0) {
          event.preventDefault();
          content.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };
    content.addEventListener("keydown", handleKeyDown);
    return () => {
      content.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open || !canUseDOM) return;
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (event.defaultPrevented) return;
      const overlay = overlayRef.current;
      if (overlay && event.target instanceof Node && !overlay.contains(event.target)) {
        return;
      }
      event.preventDefault();
      close();
    };
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [close, open]);

  const handleOverlayMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnOverlayClick) return;
      if (event.target === event.currentTarget) {
        close();
      }
    },
    [close, closeOnOverlayClick],
  );

  const handleOverlayKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    },
    [close],
  );

  const labelledBy = title ? labelId : undefined;
  const describedBy = description ? descriptionId : undefined;

  const classes = useMemo(() => cx("mosaic-dialog", className), [className]);

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <div
        ref={overlayRef}
        className="mosaic-overlay"
        data-variant={variant}
        data-side={variant === "sheet" ? side : undefined}
        onMouseDown={handleOverlayMouseDown}
        onKeyDown={handleOverlayKeyDown}
      >
        <div
          ref={contentRef}
          className={classes}
          data-open={open ? "true" : undefined}
          data-variant={variant}
          data-side={variant === "sheet" ? side : undefined}
          data-size={size}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          tabIndex={-1}
        >
          {showCloseButton ? (
            <button
              type="button"
              className="mosaic-dialog__close"
              onClick={close}
              aria-label={closeLabel}
            >
              ×
            </button>
          ) : null}
          {title || description ? (
            <header className="mosaic-dialog__header">
              {title ? (
                <h2 id={labelId} className="mosaic-dialog__title">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p id={descriptionId} className="mosaic-dialog__description">
                  {description}
                </p>
              ) : null}
            </header>
          ) : null}
          <div className={cx("mosaic-dialog__body", bodyClassName)}>{children}</div>
          {footer ? <footer className="mosaic-dialog__footer">{footer}</footer> : null}
        </div>
      </div>
    </Portal>
  );
};
