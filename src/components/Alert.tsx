import {
  forwardRef,
  type AriaAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

export type AlertTone = "info" | "success" | "warning" | "error";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  heading?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

const toneStyles: Record<AlertTone, Record<string, string>> = {
  info: {
    "--mosaic-alert-bg": getCssVar("color-primary-soft"),
    "--mosaic-alert-border": getCssVar("color-primary-border"),
    "--mosaic-alert-accent": getCssVar("color-primary"),
    "--mosaic-alert-title": getCssVar("color-primary"),
    "--mosaic-alert-icon": getCssVar("color-primary"),
  },
  success: {
    "--mosaic-alert-bg": getCssVar("color-success-soft"),
    "--mosaic-alert-border": getCssVar("color-success-border"),
    "--mosaic-alert-accent": getCssVar("color-success"),
    "--mosaic-alert-title": getCssVar("color-success"),
    "--mosaic-alert-icon": getCssVar("color-success"),
  },
  warning: {
    "--mosaic-alert-bg": getCssVar("color-warning-soft"),
    "--mosaic-alert-border": getCssVar("color-warning-border"),
    "--mosaic-alert-accent": getCssVar("color-warning"),
    "--mosaic-alert-title": getCssVar("color-warning"),
    "--mosaic-alert-icon": getCssVar("color-warning"),
  },
  error: {
    "--mosaic-alert-bg": getCssVar("color-danger-soft"),
    "--mosaic-alert-border": getCssVar("color-danger-border"),
    "--mosaic-alert-accent": getCssVar("color-danger"),
    "--mosaic-alert-title": getCssVar("color-danger"),
    "--mosaic-alert-icon": getCssVar("color-danger"),
  },
};

const defaultRoles: Record<AlertTone, "alert" | "status"> = {
  info: "status",
  success: "status",
  warning: "alert",
  error: "alert",
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const {
    tone = "info",
    heading,
    description,
    icon,
    actions,
    onDismiss,
    dismissLabel = "Dismiss alert",
    className,
    style,
    children,
    role: roleProp,
    ...rest
  } = props;

  const { ["aria-live"]: ariaLiveProp, ...restProps } = rest as typeof rest & {
    ["aria-live"]?: AriaAttributes["aria-live"];
  };

  const role = roleProp ?? defaultRoles[tone];
  const ariaLive = ariaLiveProp ?? (role === "alert" ? "assertive" : "polite");

  const styles: CSSProperties = {
    ...toneStyles[tone],
    ...(style as CSSProperties | undefined),
  };

  return (
    <div
      ref={ref}
      className={cx("mosaic-alert", className)}
      data-tone={tone}
      role={role}
      aria-live={ariaLive}
      style={styles}
      {...restProps}
    >
      <div className="mosaic-alert__body">
        {icon ? (
          <span className="mosaic-alert__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div className="mosaic-alert__content">
          {heading ? <div className="mosaic-alert__title">{heading}</div> : null}
          {description ? (
            <div className="mosaic-alert__description">{description}</div>
          ) : null}
          {children}
          {actions ? <div className="mosaic-alert__actions">{actions}</div> : null}
        </div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="mosaic-alert__dismiss"
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
});

Alert.displayName = "Alert";
