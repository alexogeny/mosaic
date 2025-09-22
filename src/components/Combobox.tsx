import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
} from "react";
import { cx } from "../utils/cx";
import { useControllableState } from "../utils/use-controllable-state";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  emptyMessage?: string;
  clearable?: boolean;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      onInputChange,
      emptyMessage = "No results",
      clearable = false,
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const listboxId = rest.id ? `${rest.id}-listbox` : undefined;
    const [selectedValue, setSelectedValue] = useControllableState<string | null>({
      value: valueProp === undefined ? undefined : valueProp,
      defaultValue,
      onChange: (next) => onValueChange?.(next),
    });
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const listRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const mergedRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    const selectedOption = useMemo(
      () => options.find((option) => option.value === selectedValue) ?? null,
      [options, selectedValue],
    );

    useEffect(() => {
      if (!open) {
        setInputValue(selectedOption?.label ?? "");
      }
    }, [selectedOption, open]);

    const filteredOptions = useMemo(() => {
      const query = inputValue.trim().toLowerCase();
      if (!query) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query),
      );
    }, [options, inputValue]);

    useEffect(() => {
      if (!open) return;
      const firstEnabled = filteredOptions.findIndex((option) => !option.disabled);
      setHighlightedIndex(firstEnabled === -1 ? 0 : firstEnabled);
    }, [filteredOptions, open]);

    const selectOption = (option: ComboboxOption | null) => {
      if (option?.disabled) return;
      setSelectedValue(option ? option.value : null);
      setInputValue(option?.label ?? "");
      setOpen(false);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
      rest.onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((index) => {
          let next = index;
          for (let i = 0; i < filteredOptions.length; i += 1) {
            next = (next + 1) % filteredOptions.length;
            if (!filteredOptions[next]?.disabled) break;
          }
          return next;
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((index) => {
          let next = index;
          for (let i = 0; i < filteredOptions.length; i += 1) {
            next = (next - 1 + filteredOptions.length) % filteredOptions.length;
            if (!filteredOptions[next]?.disabled) break;
          }
          return next;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        const option = filteredOptions[highlightedIndex];
        if (option && !option.disabled) {
          selectOption(option);
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      rest.onBlur?.(event);
      requestAnimationFrame(() => {
        const active = document.activeElement;
        if (!listRef.current || !listRef.current.contains(active)) {
          setOpen(false);
          setInputValue(selectedOption?.label ?? "");
        }
      });
    };

    const handleClear = () => {
      selectOption(null);
      inputRef.current?.focus();
    };

    const listboxUniqueId = listboxId ?? `${generatedId}-listbox`;
    const activeOption = filteredOptions[highlightedIndex];

    return (
      <div className="mosaic-combobox">
        <div className="mosaic-combobox__control">
          <input
            {...rest}
            ref={mergedRef}
            type="text"
            className={cx("mosaic-input", "mosaic-combobox__input", className)}
            value={inputValue}
            onFocus={(event) => {
              rest.onFocus?.(event);
              if (!disabled) {
                setOpen(true);
              }
            }}
            onChange={(event) => {
              onInputChange?.(event);
              setInputValue(event.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxUniqueId}
            aria-autocomplete="list"
            aria-activedescendant={open && activeOption ? `${listboxUniqueId}-${highlightedIndex}` : undefined}
            disabled={disabled}
          />
          {clearable && selectedValue ? (
            <button
              type="button"
              className="mosaic-combobox__clear"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              ×
            </button>
          ) : null}
        </div>
        {open ? (
          <div
            ref={listRef}
            className="mosaic-combobox__list"
            id={listboxUniqueId}
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <div className="mosaic-combobox__empty" role="option" aria-disabled="true">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isActive = index === highlightedIndex;
                const isSelected = option.value === selectedValue;
                return (
                  <div
                    key={option.value}
                    id={`${listboxUniqueId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    className={cx("mosaic-combobox__option", {
                      "mosaic-combobox__option--active": isActive,
                      "mosaic-combobox__option--selected": isSelected,
                      "mosaic-combobox__option--disabled": option.disabled,
                    })}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                  >
                    <span className="mosaic-combobox__option-label">{option.label}</span>
                    {option.description ? (
                      <span className="mosaic-combobox__option-description">{option.description}</span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        ) : null}
      </div>
    );
  },
);

Combobox.displayName = "Combobox";
