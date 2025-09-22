import {
  forwardRef,
  useEffect,
  useRef,
  type InputHTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { cx } from "../utils/cx";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  description?: ReactNode;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, description, indeterminate = false, className, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const setRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    return (
      <label className={cx("mosaic-checkbox", className)}>
        <span className="mosaic-checkbox__control">
          <input
            {...rest}
            ref={setRef}
            type="checkbox"
            className="mosaic-checkbox__input"
            aria-checked={
              indeterminate ? "mixed" : rest.checked !== undefined ? rest.checked : undefined
            }
          />
          <span className="mosaic-checkbox__indicator" aria-hidden="true" />
        </span>
        <span className="mosaic-checkbox__content">
          {children ? <span className="mosaic-checkbox__label">{children}</span> : null}
          {description ? <span className="mosaic-checkbox__description">{description}</span> : null}
        </span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
