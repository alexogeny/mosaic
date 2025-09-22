import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../utils/cx";

export const VisuallyHidden = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...rest }, ref) => (
    <span ref={ref} className={cx("mosaic-visually-hidden", className)} {...rest} />
  ),
);

VisuallyHidden.displayName = "VisuallyHidden";
