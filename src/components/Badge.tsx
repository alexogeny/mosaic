import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger";
type BadgeVariant = "solid" | "soft" | "outline";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const toneTokens: Record<BadgeTone, Record<string, string>> = {
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

const variantTokens = (tone: BadgeTone, variant: BadgeVariant) => {
  const palette = toneTokens[tone];
  switch (variant) {
    case "soft":
      return {
        "--mosaic-badge-bg": palette.soft,
        "--mosaic-badge-fg": palette.color,
        "--mosaic-badge-border": palette.border,
      };
    case "outline":
      return {
        "--mosaic-badge-bg": "transparent",
        "--mosaic-badge-fg": palette.color,
        "--mosaic-badge-border": palette.color,
      };
    case "solid":
    default:
      return {
        "--mosaic-badge-bg": palette.color,
        "--mosaic-badge-fg": palette.contrast,
        "--mosaic-badge-border": palette.color,
      };
  }
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      tone = "neutral",
      variant = "soft",
      leadingIcon,
      trailingIcon,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const styles: CSSProperties = {
      ...(style as CSSProperties | undefined),
      ...variantTokens(tone, variant),
    };

    return (
      <span
        ref={ref}
        className={cx("mosaic-badge", className)}
        data-tone={tone}
        data-variant={variant}
        style={styles}
        {...rest}
      >
        {leadingIcon ? <span className="mosaic-badge__icon" aria-hidden="true">{leadingIcon}</span> : null}
        <span className="mosaic-badge__label">{children}</span>
        {trailingIcon ? <span className="mosaic-badge__icon" aria-hidden="true">{trailingIcon}</span> : null}
      </span>
    );
  },
);

Badge.displayName = "Badge";
