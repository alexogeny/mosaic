import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../utils/cx";

const join = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

interface RadioGroupContextValue {
  name: string;
  value: string | null;
  setValue: (value: string) => void;
  disabled: boolean;
  required: boolean;
  describedBy?: string;
  labelledBy?: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("Radio must be used within a RadioGroup");
  }
  return context;
};

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  orientation?: "vertical" | "horizontal";
  invalid?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      children,
      name,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      orientation = "vertical",
      className,
      invalid = false,
      ...rest
    },
    ref,
  ) => {
    const generatedName = useId();
    const groupName = name ?? `mosaic-radio-${generatedName}`;
    const {
      "aria-invalid": ariaInvalidProp,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      ...restProps
    } = rest as HTMLAttributes<HTMLDivElement> & {
      "aria-invalid"?: boolean | "true" | "false";
      "aria-describedby"?: string;
      "aria-labelledby"?: string;
    };

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);
    const selectedValue = (isControlled ? value : uncontrolledValue) ?? null;

    const handleValueChange = useCallback(
      (next: string) => {
        if (!isControlled) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const contextValue = useMemo<RadioGroupContextValue>(
      () => ({
        name: groupName,
        value: selectedValue,
        setValue: handleValueChange,
        disabled,
        required,
        describedBy: ariaDescribedBy,
        labelledBy: ariaLabelledBy,
      }),
      [groupName, selectedValue, handleValueChange, disabled, required, ariaDescribedBy, ariaLabelledBy],
    );

    const isInvalid = invalid || ariaInvalidProp === true || ariaInvalidProp === "true";

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          {...restProps}
          ref={ref}
          role="radiogroup"
          className={cx("mosaic-radio-group", className)}
          data-orientation={orientation}
          data-disabled={disabled ? "true" : undefined}
          data-invalid={isInvalid ? "true" : undefined}
          aria-required={required || undefined}
          aria-invalid={isInvalid || undefined}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "value" | "defaultChecked" | "checked" | "onChange"> {
  value: string;
  description?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ value, children, description, className, disabled, ...rest }, ref) => {
    const context = useRadioGroupContext();
    const generatedId = useId();
    const {
      id,
      onChange,
      "aria-describedby": ariaDescribedBy,
      ...restProps
    } = rest as InputHTMLAttributes<HTMLInputElement> & { "aria-describedby"?: string };

    const inputId = id ?? `${context.name}-${generatedId}`;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const isChecked = context.value === value;
    const isDisabled = context.disabled || disabled;
    const describedBy = join(context.describedBy, ariaDescribedBy, descriptionId);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      if (event.defaultPrevented) return;
      context.setValue(value);
    };

    return (
      <label
        className={cx("mosaic-radio", className)}
        data-checked={isChecked ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
      >
        <span className="mosaic-radio__control">
          <input
            {...restProps}
            ref={ref}
            id={inputId}
            type="radio"
            value={value}
            name={context.name}
            className="mosaic-radio__input"
            checked={isChecked}
            onChange={handleChange}
            disabled={isDisabled}
            required={context.required}
            aria-describedby={describedBy || undefined}
          />
          <span className="mosaic-radio__indicator" aria-hidden="true" />
        </span>
        <span className="mosaic-radio__content">
          {children ? <span className="mosaic-radio__label">{children}</span> : null}
          {description ? (
            <span className="mosaic-radio__description" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);

Radio.displayName = "Radio";
