import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../utils/cx";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  description?: ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ children, description, className, ...rest }, ref) => {
    return (
      <label className={cx("mosaic-switch", className)}>
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          role="switch"
          className="mosaic-switch__input"
          aria-checked={rest.checked}
        />
        <span className="mosaic-switch__track" aria-hidden="true">
          <span className="mosaic-switch__thumb" />
        </span>
        <span className="mosaic-switch__content">
          {children ? <span className="mosaic-switch__label">{children}</span> : null}
          {description ? <span className="mosaic-switch__description">{description}</span> : null}
        </span>
      </label>
    );
  },
);

Switch.displayName = "Switch";
