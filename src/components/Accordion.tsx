import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type RefAttributes,
} from "react";
import { cx } from "../utils/cx";
import { useIsomorphicLayoutEffect } from "../utils/use-isomorphic-layout-effect";

const sanitizeValue = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  type: AccordionType;
  openValues: string[];
  collapsible: boolean;
  registerValue: (value: string) => () => void;
  setTriggerNode: (value: string, node: HTMLButtonElement | null) => void;
  setTriggerDisabled: (value: string, disabled: boolean) => void;
  isItemOpen: (value: string) => boolean;
  toggleValue: (value: string) => void;
  moveFocus: (currentValue: string, direction: 1 | -1) => void;
  focusFirst: () => void;
  focusLast: () => void;
  getTriggerId: (value: string) => string;
  getContentId: (value: string) => string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within <Accordion>");
  }
  return context;
};

interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("Accordion.Trigger and Accordion.Content must be inside Accordion.Item");
  }
  return context;
};

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "value"> {
  type?: AccordionType;
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[] | null) => void;
  collapsible?: boolean;
}

const normalizeValue = (value: string | string[] | null | undefined, type: AccordionType) => {
  if (value === undefined) return undefined;
  if (value === null) return [] as string[];
  if (Array.isArray(value)) {
    return type === "multiple" ? [...value] : value.slice(0, 1);
  }
  return [value];
};

const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      type = "single",
      value: valueProp,
      defaultValue,
      onValueChange,
      collapsible = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const normalizedValue = normalizeValue(valueProp, type);
    const normalizedDefault = normalizeValue(defaultValue, type) ?? [];

    const isControlled = normalizedValue !== undefined;
    const isControlledRef = useRef(isControlled);
    isControlledRef.current = isControlled;

    const [internalOpenValues, setInternalOpenValues] = useState<string[]>(normalizedDefault);
    const openValues = (isControlled ? normalizedValue : internalOpenValues) ?? [];
    const openValuesRef = useRef(openValues);
    openValuesRef.current = openValues;

    const onValueChangeRef = useRef(onValueChange);
    onValueChangeRef.current = onValueChange;

    const typeRef = useRef(type);
    typeRef.current = type;

    const collapsibleRef = useRef(collapsible);
    collapsibleRef.current = collapsible;

    const idPrefix = useId();

    const triggerRefs = useRef<Map<string, { node: HTMLButtonElement | null; disabled: boolean }>>(new Map());
    const orderedValuesRef = useRef<string[]>([]);
    const valueIdsRef = useRef<Map<string, string>>(new Map());

    const setOpenValues = useCallback(
      (next: string[]) => {
        const current = openValuesRef.current;
        const hasChanged =
          current.length !== next.length || current.some((value, index) => value !== next[index]);
        if (!hasChanged) {
          return;
        }

        if (!isControlledRef.current) {
          setInternalOpenValues(next);
          openValuesRef.current = next;
        }

        const handler = onValueChangeRef.current;
        if (handler) {
          if (typeRef.current === "multiple") {
            handler(next);
          } else {
            handler(next[0] ?? null);
          }
        }
      },
      [setInternalOpenValues],
    );

    const registerValue = useCallback(
      (value: string) => {
        if (!orderedValuesRef.current.includes(value)) {
          orderedValuesRef.current.push(value);
        }
        if (!triggerRefs.current.has(value)) {
          triggerRefs.current.set(value, { node: null, disabled: false });
        }
        if (!valueIdsRef.current.has(value)) {
          const unique = `${sanitizeValue(value)}-${valueIdsRef.current.size + 1}`;
          valueIdsRef.current.set(value, unique);
        }

        return () => {
          orderedValuesRef.current = orderedValuesRef.current.filter((item) => item !== value);
          triggerRefs.current.delete(value);
          valueIdsRef.current.delete(value);

          if (openValuesRef.current.includes(value)) {
            const next = openValuesRef.current.filter((item) => item !== value);
            setOpenValues(next);
          }
        };
      },
      [setOpenValues],
    );

    const setTriggerNode = useCallback((value: string, node: HTMLButtonElement | null) => {
      const entry = triggerRefs.current.get(value);
      if (entry) {
        entry.node = node;
      } else {
        triggerRefs.current.set(value, { node, disabled: false });
      }
    }, []);

    const setTriggerDisabled = useCallback(
      (value: string, disabled: boolean) => {
        const entry = triggerRefs.current.get(value);
        if (entry) {
          entry.disabled = disabled;
        } else {
          triggerRefs.current.set(value, { node: null, disabled });
        }

        if (disabled && openValuesRef.current.includes(value)) {
          const next = openValuesRef.current.filter((item) => item !== value);
          setOpenValues(next);
        }
      },
      [setOpenValues],
    );

    const focusValue = useCallback((value: string) => {
      const entry = triggerRefs.current.get(value);
      entry?.node?.focus();
    }, []);

    const moveFocus = useCallback(
      (currentValue: string, direction: 1 | -1) => {
        const enabledValues = orderedValuesRef.current.filter((value) => {
          const entry = triggerRefs.current.get(value);
          return entry && !entry.disabled;
        });
        if (enabledValues.length === 0) {
          return;
        }

        const currentIndex = enabledValues.indexOf(currentValue);
        let nextIndex: number;
        if (currentIndex === -1) {
          nextIndex = direction === 1 ? 0 : enabledValues.length - 1;
        } else {
          nextIndex = (currentIndex + direction + enabledValues.length) % enabledValues.length;
        }

        const nextValue = enabledValues[nextIndex];
        focusValue(nextValue);
      },
      [focusValue],
    );

    const focusFirst = useCallback(() => {
      for (const value of orderedValuesRef.current) {
        const entry = triggerRefs.current.get(value);
        if (entry && !entry.disabled) {
          focusValue(value);
          break;
        }
      }
    }, [focusValue]);

    const focusLast = useCallback(() => {
      const values = orderedValuesRef.current;
      for (let index = values.length - 1; index >= 0; index -= 1) {
        const value = values[index];
        const entry = triggerRefs.current.get(value);
        if (entry && !entry.disabled) {
          focusValue(value);
          break;
        }
      }
    }, [focusValue]);

    const toggleValue = useCallback(
      (value: string) => {
        const current = openValuesRef.current;
        const isOpen = current.includes(value);
        let next: string[];

        if (typeRef.current === "multiple") {
          next = isOpen ? current.filter((item) => item !== value) : [...current, value];
        } else {
          if (isOpen) {
            if (!collapsibleRef.current) {
              return;
            }
            next = [];
          } else {
            next = [value];
          }
        }

        const hasChanged =
          current.length !== next.length || current.some((item, index) => item !== next[index]);
        if (!hasChanged) {
          return;
        }

        setOpenValues(next);
      },
      [setOpenValues],
    );

    const getTriggerId = useCallback(
      (value: string) => {
        const unique = valueIdsRef.current.get(value) ?? sanitizeValue(value);
        return `mosaic-accordion-${idPrefix}-${unique}-trigger`;
      },
      [idPrefix],
    );

    const getContentId = useCallback(
      (value: string) => {
        const unique = valueIdsRef.current.get(value) ?? sanitizeValue(value);
        return `mosaic-accordion-${idPrefix}-${unique}-content`;
      },
      [idPrefix],
    );

    const contextValue = useMemo<AccordionContextValue>(
      () => ({
        type,
        openValues,
        collapsible,
        registerValue,
        setTriggerNode,
        setTriggerDisabled,
        isItemOpen: (value: string) => openValues.includes(value),
        toggleValue,
        moveFocus,
        focusFirst,
        focusLast,
        getTriggerId,
        getContentId,
      }),
      [
        collapsible,
        focusFirst,
        focusLast,
        getContentId,
        getTriggerId,
        moveFocus,
        openValues,
        registerValue,
        setTriggerDisabled,
        setTriggerNode,
        toggleValue,
        type,
      ],
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          {...rest}
          ref={ref}
          className={cx("mosaic-accordion", className)}
          data-type={type}
          data-collapsible={collapsible ? "true" : undefined}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

AccordionRoot.displayName = "Accordion";

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...rest }, ref) => {
    const context = useAccordionContext();

    useIsomorphicLayoutEffect(() => context.registerValue(value), [context, value]);

    const itemContext = useMemo<AccordionItemContextValue>(
      () => ({ value, disabled }),
      [value, disabled],
    );

    const isOpen = context.isItemOpen(value);

    return (
      <AccordionItemContext.Provider value={itemContext}>
        <div
          {...rest}
          ref={ref}
          className={cx("mosaic-accordion__item", className)}
          data-state={isOpen ? "open" : "closed"}
          data-disabled={disabled ? "true" : undefined}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = "Accordion.Item";

export interface AccordionTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, onClick, onKeyDown, disabled: disabledProp = false, children, ...rest }, ref) => {
    const context = useAccordionContext();
    const item = useAccordionItemContext();
    const value = item.value;
    const isDisabled = item.disabled || disabledProp;

    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        context.setTriggerNode(value, node);
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [context, ref, value],
    );

    useIsomorphicLayoutEffect(() => {
      context.setTriggerDisabled(value, isDisabled);
    }, [context, value, isDisabled]);

    const isOpen = context.isItemOpen(value);

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isDisabled) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        context.moveFocus(value, 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        context.moveFocus(value, -1);
      } else if (event.key === "Home") {
        event.preventDefault();
        context.focusFirst();
      } else if (event.key === "End") {
        event.preventDefault();
        context.focusLast();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        context.toggleValue(value);
      }
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || isDisabled) return;
      context.toggleValue(value);
    };

    return (
      <button
        {...rest}
        ref={setRef}
        type="button"
        className={cx("mosaic-accordion__trigger", className)}
        data-state={isOpen ? "open" : "closed"}
        data-disabled={isDisabled ? "true" : undefined}
        aria-expanded={isOpen}
        aria-controls={context.getContentId(value)}
        id={context.getTriggerId(value)}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  },
);

AccordionTrigger.displayName = "Accordion.Trigger";

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...rest }, ref) => {
    const context = useAccordionContext();
    const item = useAccordionItemContext();
    const isOpen = context.isItemOpen(item.value);

    return (
      <div
        {...rest}
        ref={ref}
        id={context.getContentId(item.value)}
        role="region"
        aria-labelledby={context.getTriggerId(item.value)}
        hidden={!isOpen}
        aria-hidden={!isOpen}
        className={cx("mosaic-accordion__content", className)}
        data-state={isOpen ? "open" : "closed"}
      >
        {children}
      </div>
    );
  },
);

AccordionContent.displayName = "Accordion.Content";

export interface AccordionComponent
  extends ForwardRefExoticComponent<AccordionProps & RefAttributes<HTMLDivElement>> {
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
}) as AccordionComponent;

