import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

type CardTone = "default" | "primary" | "neutral" | "success" | "warning" | "danger";
type CardPadding = "none" | "sm" | "md" | "lg";
type ShadowSize = "sm" | "md" | "lg";
type ShadowToken = `shadow-${ShadowSize}`;

const toneStyles: Record<CardTone, Record<string, string>> = {
  default: {},
  primary: {
    "--mosaic-card-bg": getCssVar("color-primary-soft"),
    "--mosaic-card-border": getCssVar("color-primary-border"),
    "--mosaic-card-fg": getCssVar("color-text"),
  },
  neutral: {
    "--mosaic-card-bg": getCssVar("color-neutral-soft"),
    "--mosaic-card-border": getCssVar("color-neutral-border"),
    "--mosaic-card-fg": getCssVar("color-text"),
  },
  success: {
    "--mosaic-card-bg": getCssVar("color-success-soft"),
    "--mosaic-card-border": getCssVar("color-success-border"),
    "--mosaic-card-fg": getCssVar("color-text"),
  },
  warning: {
    "--mosaic-card-bg": getCssVar("color-warning-soft"),
    "--mosaic-card-border": getCssVar("color-warning-border"),
    "--mosaic-card-fg": getCssVar("color-text"),
  },
  danger: {
    "--mosaic-card-bg": getCssVar("color-danger-soft"),
    "--mosaic-card-border": getCssVar("color-danger-border"),
    "--mosaic-card-fg": getCssVar("color-text"),
  },
};

const paddingMap: Record<CardPadding, string> = {
  none: "0",
  sm: "var(--mosaic-spacing-md)",
  md: "var(--mosaic-spacing-lg)",
  lg: "calc(var(--mosaic-spacing-lg) * 1.5)",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  elevated?: boolean;
  hoverable?: boolean;
  padding?: CardPadding;
  shadow?: "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      tone = "default",
      elevated = false,
      hoverable = false,
      padding = "md",
      shadow,
      className,
      style: inlineStyle,
      ...rest
    },
    ref,
  ) => {
    const toneVars = toneStyles[tone];
    const styles: CSSProperties = { ...(inlineStyle as CSSProperties | undefined) };
    Object.assign(styles, toneVars, {
      "--mosaic-card-padding": paddingMap[padding],
    });

    if (shadow) {
      const token: ShadowToken = `shadow-${shadow}`;
      Object.assign(styles, {
        "--mosaic-card-shadow": getCssVar(token),
        "--mosaic-card-shadow-hover": getCssVar(token),
      });
    }

    return (
      <div
        ref={ref}
        data-tone={tone === "default" ? undefined : tone}
        data-hoverable={hoverable ? "true" : undefined}
        data-elevated={elevated ? "true" : undefined}
        className={cx("mosaic-card", className)}
        style={styles}
        {...rest}
      />
    );
  },
);

Card.displayName = "Card";
