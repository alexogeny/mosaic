import { forwardRef, type CSSProperties, type SelectHTMLAttributes } from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

type SelectSize = "sm" | "md" | "lg";

const sizeMap: Record<SelectSize, Record<string, string>> = {
  sm: {
    "--mosaic-select-padding-y": "calc(var(--mosaic-spacing-xs) + 0.1rem)",
    "--mosaic-select-padding-x": "var(--mosaic-spacing-sm)",
    "--mosaic-select-font-size": getCssVar("text-size-sm"),
  },
  md: {
    "--mosaic-select-padding-y": "var(--mosaic-spacing-sm)",
    "--mosaic-select-padding-x": "var(--mosaic-spacing-md)",
    "--mosaic-select-font-size": getCssVar("text-size-md"),
  },
  lg: {
    "--mosaic-select-padding-y": "calc(var(--mosaic-spacing-md) - 0.05rem)",
    "--mosaic-select-padding-x": "calc(var(--mosaic-spacing-lg) - 0.1rem)",
    "--mosaic-select-font-size": getCssVar("text-size-lg"),
  },
};

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: SelectSize;
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = "md", className, style: inlineStyle, invalid = false, ...rest }, ref) => {
    const { "aria-invalid": ariaInvalidProp, ...restProps } = rest as SelectHTMLAttributes<HTMLSelectElement> & {
      "aria-invalid"?: boolean | "true" | "false";
    };
    const sizeVars = sizeMap[size];
    const styles: CSSProperties = { ...(inlineStyle as CSSProperties | undefined) };
    Object.assign(styles, sizeVars);

    const isInvalid = invalid || ariaInvalidProp === true || ariaInvalidProp === "true";

    return (
      <select
        {...restProps}
        ref={ref}
        className={cx("mosaic-select", className)}
        style={styles}
        data-invalid={isInvalid ? "true" : undefined}
        aria-invalid={isInvalid || undefined}
      />
    );
  },
);

Select.displayName = "Select";
