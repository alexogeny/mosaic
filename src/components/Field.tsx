import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  useId,
} from "react";
import { cx } from "../utils/cx";
import type { InputProps } from "./Input";

const join = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(" ");

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  id?: string;
  children: ReactNode;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      description,
      hint,
      error,
      required = false,
      id,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = id ?? `mosaic-field-${generatedId}`;
    const labelId = label ? `${fieldId}-label` : undefined;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;

    let control = children;
    if (isValidElement(children)) {
      const childProps = children.props as Partial<InputProps> & {
        id?: string;
        "aria-describedby"?: string;
        "aria-labelledby"?: string;
        "aria-invalid"?: boolean | "true" | "false";
      };
      const describedBy = join(
        childProps["aria-describedby"],
        hintId,
        descriptionId,
        errorId,
      );
      const labelledBy = join(childProps["aria-labelledby"], labelId);
      control = cloneElement(children, {
        id: childProps.id ?? fieldId,
        "aria-describedby": describedBy || undefined,
        "aria-labelledby": labelledBy || undefined,
        "aria-invalid": error ? true : childProps["aria-invalid"],
        required: required || childProps.required,
      });
    }

    return (
      <div
        ref={ref}
        className={cx("mosaic-field", className)}
        data-invalid={error ? "true" : undefined}
        {...rest}
      >
        {label ? (
          <label className="mosaic-field__label" id={labelId} htmlFor={fieldId}>
            {label}
            {required ? <span className="mosaic-field__required">*</span> : null}
          </label>
        ) : null}
        <div className="mosaic-field__control">{control}</div>
        {hint ? (
          <div className="mosaic-field__hint" id={hintId}>
            {hint}
          </div>
        ) : null}
        {description ? (
          <div className="mosaic-field__description" id={descriptionId}>
            {description}
          </div>
        ) : null}
        {error ? (
          <div className="mosaic-field__error" id={errorId}>
            {error}
          </div>
        ) : null}
      </div>
    );
  },
);

Field.displayName = "Field";
