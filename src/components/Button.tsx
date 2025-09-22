import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

type ButtonVariant = "solid" | "soft" | "outline" | "ghost";
type ButtonTone = "primary" | "neutral" | "success" | "warning" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const toneStyles: Record<ButtonTone, Record<string, string>> = {
  primary: {
    color: getCssVar("color-primary"),
    contrast: getCssVar("color-primary-contrast"),
    soft: getCssVar("color-primary-soft"),
    border: getCssVar("color-primary-border"),
  },
  neutral: {
    color: getCssVar("color-neutral"),
    contrast: getCssVar("color-neutral-contrast"),
    soft: getCssVar("color-neutral-soft"),
    border: getCssVar("color-neutral-border"),
  },
  success: {
    color: getCssVar("color-success"),
    contrast: getCssVar("color-success-contrast"),
    soft: getCssVar("color-success-soft"),
    border: getCssVar("color-success-border"),
  },
  warning: {
    color: getCssVar("color-warning"),
    contrast: getCssVar("color-warning-contrast"),
    soft: getCssVar("color-warning-soft"),
    border: getCssVar("color-warning-border"),
  },
  danger: {
    color: getCssVar("color-danger"),
    contrast: getCssVar("color-danger-contrast"),
    soft: getCssVar("color-danger-soft"),
    border: getCssVar("color-danger-border"),
  },
};

const sizeVars: Record<ButtonSize, Record<string, string>> = {
  sm: {
    "--mosaic-button-padding-y": "calc(var(--mosaic-spacing-xs) + 0.1rem)",
    "--mosaic-button-padding-x": "calc(var(--mosaic-spacing-sm) + 0.1rem)",
    "--mosaic-button-font-size": getCssVar("text-size-sm"),
    "--mosaic-button-size-adjust": "-0.25rem",
  },
  md: {
    "--mosaic-button-padding-y": "var(--mosaic-spacing-sm)",
    "--mosaic-button-padding-x": "calc(var(--mosaic-spacing-md) + 0.125rem)",
    "--mosaic-button-font-size": getCssVar("text-size-md"),
    "--mosaic-button-size-adjust": "0rem",
  },
  lg: {
    "--mosaic-button-padding-y": "calc(var(--mosaic-spacing-md) - 0.05rem)",
    "--mosaic-button-padding-x": "calc(var(--mosaic-spacing-lg) - 0.1rem)",
    "--mosaic-button-font-size": getCssVar("text-size-lg"),
    "--mosaic-button-size-adjust": "0.25rem",
  },
};

const toneVars = (tone: ButtonTone, variant: ButtonVariant): Record<string, string> => {
  const palette = toneStyles[tone];
  switch (variant) {
    case "solid":
      return {
        "--mosaic-button-bg": palette.color,
        "--mosaic-button-fg": palette.contrast,
        "--mosaic-button-border": "transparent",
        "--mosaic-button-bg-hover": palette.border,
        "--mosaic-button-bg-active": palette.color,
        "--mosaic-button-border-hover": "transparent",
        "--mosaic-button-shadow": getCssVar("shadow-sm"),
        "--mosaic-button-shadow-hover": getCssVar("shadow-md"),
        "--mosaic-button-shadow-active": getCssVar("shadow-sm"),
      };
    case "soft":
      return {
        "--mosaic-button-bg": palette.soft,
        "--mosaic-button-fg": palette.color,
        "--mosaic-button-border": palette.border,
        "--mosaic-button-bg-hover": palette.border,
        "--mosaic-button-bg-active": palette.color,
        "--mosaic-button-border-hover": palette.color,
        "--mosaic-button-shadow-hover": getCssVar("shadow-sm"),
        "--mosaic-button-shadow-active": getCssVar("shadow-sm"),
      };
    case "outline":
      return {
        "--mosaic-button-bg": "transparent",
        "--mosaic-button-fg": palette.color,
        "--mosaic-button-border": palette.color,
        "--mosaic-button-bg-hover": palette.soft,
        "--mosaic-button-bg-active": palette.border,
        "--mosaic-button-border-hover": palette.border,
        "--mosaic-button-shadow-hover": getCssVar("shadow-sm"),
        "--mosaic-button-shadow-active": getCssVar("shadow-sm"),
      };
    case "ghost":
    default:
      return {
        "--mosaic-button-bg": "transparent",
        "--mosaic-button-fg": palette.color,
        "--mosaic-button-border": "transparent",
        "--mosaic-button-bg-hover": palette.soft,
        "--mosaic-button-bg-active": palette.border,
        "--mosaic-button-border-hover": palette.border,
        "--mosaic-button-shadow-hover": getCssVar("shadow-sm"),
        "--mosaic-button-shadow-active": getCssVar("shadow-sm"),
      };
  }
};

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      tone = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      isLoading = false,
      loadingText,
      className,
      disabled,
      fullWidth = false,
      children,
      type = "button",
      style: inlineStyle,
      ...rest
    },
    ref,
  ) => {
    const paletteVars = toneVars(tone, variant);
    const sizeStyles = sizeVars[size];
    const styles: CSSProperties = { ...(inlineStyle as CSSProperties | undefined) };
    Object.assign(styles, paletteVars, sizeStyles);

    const isDisabled = disabled || isLoading;
    const showLeading = Boolean(leadingIcon) && !isLoading;
    const showTrailing = Boolean(trailingIcon) && !isLoading;
    const label = isLoading && loadingText ? loadingText : children;

    return (
      <button
        ref={ref}
        type={type}
        data-variant={variant}
        data-tone={tone}
        data-size={size}
        data-full-width={fullWidth ? "true" : undefined}
        data-loading={isLoading ? "true" : undefined}
        className={cx("mosaic-button", className)}
        style={styles}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        aria-live={isLoading ? "polite" : undefined}
        {...rest}
      >
        {isLoading ? (
          <span className="mosaic-button__spinner" aria-hidden="true" />
        ) : showLeading ? (
          <span aria-hidden="true">{leadingIcon}</span>
        ) : null}
        <span className="mosaic-button__label">{label}</span>
        {showTrailing ? <span aria-hidden="true">{trailingIcon}</span> : null}
        {isLoading && !loadingText ? (
          <span className="mosaic-visually-hidden">Loading</span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = "Button";
