import { forwardRef, type CSSProperties, type TextareaHTMLAttributes } from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

type TextareaSize = "sm" | "md" | "lg";

const sizeMap: Record<TextareaSize, Record<string, string>> = {
  sm: {
    "--mosaic-textarea-padding-y": "calc(var(--mosaic-spacing-xs) + 0.1rem)",
    "--mosaic-textarea-padding-x": "var(--mosaic-spacing-sm)",
    "--mosaic-textarea-font-size": getCssVar("text-size-sm"),
  },
  md: {
    "--mosaic-textarea-padding-y": "var(--mosaic-spacing-sm)",
    "--mosaic-textarea-padding-x": "var(--mosaic-spacing-md)",
    "--mosaic-textarea-font-size": getCssVar("text-size-md"),
  },
  lg: {
    "--mosaic-textarea-padding-y": "calc(var(--mosaic-spacing-md) - 0.05rem)",
    "--mosaic-textarea-padding-x": "calc(var(--mosaic-spacing-lg) - 0.1rem)",
    "--mosaic-textarea-font-size": getCssVar("text-size-lg"),
  },
};

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextareaSize;
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = "md", className, style: inlineStyle, invalid = false, ...rest }, ref) => {
    const { "aria-invalid": ariaInvalidProp, ...restProps } = rest as TextareaHTMLAttributes<HTMLTextAreaElement> & {
      "aria-invalid"?: boolean | "true" | "false";
    };
    const sizeVars = sizeMap[size];
    const styles: CSSProperties = { ...(inlineStyle as CSSProperties | undefined) };
    Object.assign(styles, sizeVars);

    const isInvalid = invalid || ariaInvalidProp === true || ariaInvalidProp === "true";

    return (
      <textarea
        {...restProps}
        ref={ref}
        className={cx("mosaic-textarea", className)}
        style={styles}
        data-invalid={isInvalid ? "true" : undefined}
        aria-invalid={isInvalid || undefined}
      />
    );
  },
);

Textarea.displayName = "Textarea";
