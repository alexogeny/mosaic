import { forwardRef, type ChangeEvent, type InputHTMLAttributes } from "react";
import { cx } from "../utils/cx";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onValueChange?: (value: number) => void;
  invalid?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, onChange, onValueChange, invalid = false, ...rest }, ref) => {
    const { "aria-invalid": ariaInvalidProp, ...restProps } = rest as InputHTMLAttributes<HTMLInputElement> & {
      "aria-invalid"?: boolean | "true" | "false";
    };

    const isInvalid = invalid || ariaInvalidProp === true || ariaInvalidProp === "true";

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      if (event.defaultPrevented) return;
      const nextValue = Number(event.target.value);
      if (!Number.isNaN(nextValue)) {
        onValueChange?.(nextValue);
      }
    };

    return (
      <input
        {...restProps}
        ref={ref}
        type="range"
        className={cx("mosaic-slider", className)}
        onChange={handleChange}
        data-invalid={isInvalid ? "true" : undefined}
        aria-invalid={isInvalid || undefined}
      />
    );
  },
);

Slider.displayName = "Slider";
