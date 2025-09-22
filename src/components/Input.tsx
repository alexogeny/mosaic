import {
  forwardRef,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

type InputSize = "sm" | "md" | "lg";
const sizeMap: Record<InputSize, Record<string, string>> = {
  sm: {
    "--mosaic-input-padding-y": "calc(var(--mosaic-spacing-xs) + 0.1rem)",
    "--mosaic-input-padding-x": "var(--mosaic-spacing-sm)",
    "--mosaic-input-font-size": getCssVar("text-size-sm"),
  },
  md: {
    "--mosaic-input-padding-y": "var(--mosaic-spacing-sm)",
    "--mosaic-input-padding-x": "var(--mosaic-spacing-md)",
    "--mosaic-input-font-size": getCssVar("text-size-md"),
  },
  lg: {
    "--mosaic-input-padding-y": "calc(var(--mosaic-spacing-md) - 0.05rem)",
    "--mosaic-input-padding-x": "calc(var(--mosaic-spacing-lg) - 0.1rem)",
    "--mosaic-input-font-size": getCssVar("text-size-lg"),
  },
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { size = "md", className, style: inlineStyle, invalid = false, ...rest },
    ref,
  ) => {
    const sizeVars = sizeMap[size];
    const styles: CSSProperties = { ...(inlineStyle as CSSProperties | undefined) };
    Object.assign(styles, sizeVars);

    return (
      <input
        ref={ref}
        className={cx("mosaic-input", className)}
        style={styles}
        data-invalid={invalid ? "true" : undefined}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
