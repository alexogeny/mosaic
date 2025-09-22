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
import { Portal } from "../utils/Portal";
import { cx } from "../utils/cx";

export type ToastTone = "neutral" | "primary" | "success" | "warning" | "danger";

export interface ToastAction {
  label: string;
  onAction: () => void;
  altText?: string;
}

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
  action?: ToastAction;
}

interface ToastInstance extends ToastOptions {
  id: string;
  tone: ToastTone;
  createdAt: number;
}

export interface ToastProviderProps extends PropsWithChildren {
  placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  maxToasts?: number;
  className?: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  toasts: ToastInstance[];
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;
const getToastId = () => {
  toastId += 1;
  return `toast-${toastId}`;
};

const DEFAULT_DURATION = 5000;

export const ToastProvider = ({
  children,
  placement = "bottom-right",
  maxToasts = 4,
  className,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeout = timers.current.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? getToastId();
      const tone = options.tone ?? "neutral";
      setToasts((prev) => {
        const next: ToastInstance[] = [...prev.filter((item) => item.id !== id), {
          ...options,
          id,
          tone,
          createdAt: Date.now(),
        }];
        if (next.length > maxToasts) {
          next.splice(0, next.length - maxToasts);
        }
        return next;
      });
      if (options.duration !== 0) {
        const timeout = window.setTimeout(() => dismiss(id), options.duration ?? DEFAULT_DURATION);
        timers.current.set(id, timeout);
      }
      return id;
    },
    [dismiss, maxToasts],
  );

  const clear = useCallback(() => {
    timers.current.forEach((timeout) => window.clearTimeout(timeout));
    timers.current.clear();
    setToasts([]);
  }, []);

  useEffect(() => () => clear(), [clear]);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss, clear, toasts }), [toast, dismiss, clear, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <div className={cx("mosaic-toast-viewport", className)} data-placement={placement}>
          {toasts.map((toastItem) => (
            <div key={toastItem.id} className={cx("mosaic-toast", `mosaic-toast--${toastItem.tone}`)} role="status" aria-live="polite">
              <div className="mosaic-toast__body">
                <div className="mosaic-toast__content">
                  <span className="mosaic-toast__title">{toastItem.title}</span>
                  {toastItem.description ? (
                    <span className="mosaic-toast__description">{toastItem.description}</span>
                  ) : null}
                </div>
                <div className="mosaic-toast__actions">
                  {toastItem.action ? (
                    <button
                      type="button"
                      className="mosaic-toast__action"
                      onClick={() => {
                        toastItem.action?.onAction();
                        dismiss(toastItem.id);
                      }}
                      aria-label={toastItem.action.altText ?? toastItem.action.label}
                    >
                      {toastItem.action.label}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="mosaic-toast__close"
                    onClick={() => dismiss(toastItem.id)}
                    aria-label="Dismiss notification"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
