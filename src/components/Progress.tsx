import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../utils/cx";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: string;
  indeterminate?: boolean;
  showValue?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { value = 0, max = 100, label, indeterminate = false, showValue = false, className, ...rest },
    ref,
  ) => {
    const safeMax = max <= 0 ? 1 : max;
    const clamped = Math.max(0, Math.min(value, safeMax));
    const percentage = Math.round((clamped / safeMax) * 100);

    return (
      <div
        ref={ref}
        className={cx("mosaic-progress", className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={indeterminate ? undefined : clamped}
        data-indeterminate={indeterminate ? "true" : undefined}
        {...rest}
      >
        {label || showValue ? (
          <div className="mosaic-progress__meta">
            {label ? <span className="mosaic-progress__label">{label}</span> : null}
            {showValue && !indeterminate ? (
              <span className="mosaic-progress__value">{percentage}%</span>
            ) : null}
          </div>
        ) : null}
        <div className="mosaic-progress__track" aria-hidden="true">
          <div
            className="mosaic-progress__indicator"
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";
