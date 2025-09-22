import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../utils/cx";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, ...rest }, ref) => {
    return <input ref={ref} type="date" className={cx("mosaic-input", "mosaic-date-picker", className)} {...rest} />;
  },
);

DatePicker.displayName = "DatePicker";
