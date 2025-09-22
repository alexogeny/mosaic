import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

type TextElement = keyof HTMLElementTagNameMap;
type TextVariant =
  | "body"
  | "muted"
  | "subtle"
  | "headline"
  | "title"
  | "label"
  | "code"
  | "caption";
type TextTone =
  | "default"
  | "muted"
  | "subtle"
  | "primary"
  | "success"
  | "warning"
  | "danger";

const toneMap: Record<TextTone, string | null> = {
  default: null,
  muted: getCssVar("color-text-muted"),
  subtle: getCssVar("color-text-subtle"),
  primary: getCssVar("color-primary"),
  success: getCssVar("color-success"),
  warning: getCssVar("color-warning"),
  danger: getCssVar("color-danger"),
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement;
  variant?: TextVariant;
  tone?: TextTone;
  align?: "start" | "center" | "end" | "justify";
  truncate?: boolean;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as = "span",
      variant = "body",
      tone = "default",
      align,
      truncate = false,
      className,
      style: inlineStyle,
      ...rest
    },
    ref,
  ) => {
    const Element = as as any;
    const toneValue = toneMap[tone];
    const styles: CSSProperties = { ...(inlineStyle as CSSProperties | undefined) };

    if (toneValue) {
      Object.assign(styles, { "--mosaic-text-color": toneValue });
    }

    if (align) {
      styles.textAlign = align as CSSProperties["textAlign"];
    }

    if (truncate) {
      styles.whiteSpace = "nowrap";
      styles.overflow = "hidden";
      styles.textOverflow = "ellipsis";
    }

    return (
      <Element
        ref={ref as any}
        data-variant={variant}
        className={cx("mosaic-text", className)}
        style={styles}
        {...rest}
      />
    );
  },
);

Text.displayName = "Text";
