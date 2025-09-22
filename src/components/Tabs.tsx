import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type RefAttributes,
} from "react";
import { cx } from "../utils/cx";
import { useControllableState } from "../utils/use-controllable-state";
import { useIsomorphicLayoutEffect } from "../utils/use-isomorphic-layout-effect";

const sanitizeValue = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");

type TabsOrientation = "horizontal" | "vertical";
type TabsActivationMode = "automatic" | "manual";

interface TriggerRecord {
  node: HTMLButtonElement | null;
  disabled: boolean;
}

interface TabsContextValue {
  value: string | null;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
  registerValue: (value: string) => () => void;
  setTriggerNode: (value: string, node: HTMLButtonElement | null) => void;
  setTriggerDisabled: (value: string, disabled: boolean) => void;
  selectValue: (value: string) => void;
  getFirstEnabledValue: () => string | undefined;
  moveFocus: (currentValue: string | null, direction: 1 | -1) => void;
  focusFirst: () => void;
  focusLast: () => void;
  getTriggerId: (value: string) => string;
  getPanelId: (value: string) => string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return context;
};

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  activationMode?: TabsActivationMode;
}

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      value: valueProp,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      activationMode = "automatic",
      className,
      ...rest
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = useControllableState<string | null>({
      value: valueProp,
      defaultValue: defaultValue ?? null,
      onChange: (next) => {
        if (next !== null) {
          onValueChange?.(next);
        }
      },
    });

    const isControlled = valueProp !== undefined;
    const isControlledRef = useRef(isControlled);
    isControlledRef.current = isControlled;
    const selectedValueRef = useRef<string | null>(selectedValue);
    selectedValueRef.current = selectedValue;

    const setSelectedValueSafely = useCallback(
      (next: string | null) => {
        if (selectedValueRef.current === next) {
          return;
        }
        setSelectedValue(next);
      },
      [setSelectedValue],
    );

    const selectValue = useCallback(
      (next: string) => {
        setSelectedValueSafely(next);
      },
      [setSelectedValueSafely],
    );

    const triggerRefs = useRef<Map<string, TriggerRecord>>(new Map());
    const orderedValuesRef = useRef<string[]>([]);
    const valueIdsRef = useRef<Map<string, string>>(new Map());
    const idPrefix = useId();

    const getFirstEnabledValue = useCallback(() => {
      for (const value of orderedValuesRef.current) {
        const entry = triggerRefs.current.get(value);
        if (entry && !entry.disabled) {
          return value;
        }
      }
      return undefined;
    }, []);

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
        if (!isControlledRef.current) {
          const firstEnabled = getFirstEnabledValue();
          if (firstEnabled && selectedValueRef.current == null) {
            setSelectedValueSafely(firstEnabled);
          }
        }

        return () => {
          orderedValuesRef.current = orderedValuesRef.current.filter((item) => item !== value);
          triggerRefs.current.delete(value);
          valueIdsRef.current.delete(value);

          if (!isControlledRef.current && selectedValueRef.current === value) {
            const nextValue = getFirstEnabledValue();
            setSelectedValueSafely(nextValue ?? null);
          }
        };
      },
      [getFirstEnabledValue, setSelectedValueSafely],
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

        if (!isControlledRef.current && disabled && selectedValueRef.current === value) {
          const nextValue = getFirstEnabledValue();
          setSelectedValueSafely(nextValue ?? null);
        }
      },
      [getFirstEnabledValue, setSelectedValueSafely],
    );

    const focusValue = useCallback((value: string) => {
      const entry = triggerRefs.current.get(value);
      entry?.node?.focus();
    }, []);

    const moveFocus = useCallback(
      (currentValue: string | null, direction: 1 | -1) => {
        const enabledValues = orderedValuesRef.current.filter((value) => {
          const entry = triggerRefs.current.get(value);
          return entry && !entry.disabled;
        });
        if (enabledValues.length === 0) {
          return;
        }

        const currentIndex = currentValue ? enabledValues.indexOf(currentValue) : -1;
        let nextIndex: number;
        if (currentIndex === -1) {
          nextIndex = direction === 1 ? 0 : enabledValues.length - 1;
        } else {
          nextIndex = (currentIndex + direction + enabledValues.length) % enabledValues.length;
        }

        const nextValue = enabledValues[nextIndex];
        focusValue(nextValue);
        if (activationMode === "automatic") {
          setSelectedValueSafely(nextValue);
        }
      },
      [activationMode, focusValue, setSelectedValueSafely],
    );

    const focusFirst = useCallback(() => {
      const firstEnabled = getFirstEnabledValue();
      if (!firstEnabled) return;
      focusValue(firstEnabled);
      if (activationMode === "automatic") {
        setSelectedValueSafely(firstEnabled);
      }
    }, [activationMode, focusValue, getFirstEnabledValue, setSelectedValueSafely]);

    const focusLast = useCallback(() => {
      const enabledValues = orderedValuesRef.current.filter((value) => {
        const entry = triggerRefs.current.get(value);
        return entry && !entry.disabled;
      });
      if (enabledValues.length === 0) {
        return;
      }
      const lastValue = enabledValues[enabledValues.length - 1];
      focusValue(lastValue);
      if (activationMode === "automatic") {
        setSelectedValueSafely(lastValue);
      }
    }, [activationMode, focusValue, setSelectedValueSafely]);

    const getTriggerId = useCallback(
      (value: string) => {
        const unique = valueIdsRef.current.get(value) ?? sanitizeValue(value);
        return `mosaic-tab-${idPrefix}-${unique}-trigger`;
      },
      [idPrefix],
    );

    const getPanelId = useCallback(
      (value: string) => {
        const unique = valueIdsRef.current.get(value) ?? sanitizeValue(value);
        return `mosaic-tab-${idPrefix}-${unique}-panel`;
      },
      [idPrefix],
    );

    const contextValue = useMemo<TabsContextValue>(
      () => ({
        value: selectedValue,
        orientation,
        activationMode,
        registerValue,
        setTriggerNode,
        setTriggerDisabled,
        selectValue,
        getFirstEnabledValue,
        moveFocus,
        focusFirst,
        focusLast,
        getTriggerId,
        getPanelId,
      }),
      [
        activationMode,
        focusFirst,
        focusLast,
        getFirstEnabledValue,
        getPanelId,
        getTriggerId,
        moveFocus,
        orientation,
        registerValue,
        selectedValue,
        selectValue,
        setTriggerDisabled,
        setTriggerNode,
      ],
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          {...rest}
          ref={ref}
          className={cx("mosaic-tabs", className)}
          data-orientation={orientation}
          data-activation={activationMode}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

TabsRoot.displayName = "Tabs";

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(({ className, ...rest }, ref) => {
  const { orientation } = useTabsContext();
  return (
    <div
      {...rest}
      ref={ref}
      role="tablist"
      aria-orientation={orientation}
      className={cx("mosaic-tabs__list", className)}
      data-orientation={orientation}
    />
  );
});

TabsList.displayName = "Tabs.List";

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  value: string;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, disabled = false, onKeyDown, onClick, children, ...rest }, ref) => {
    const context = useTabsContext();

    useIsomorphicLayoutEffect(() => context.registerValue(value), [context, value]);

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
      context.setTriggerDisabled(value, disabled);
    }, [context, value, disabled]);

    const isSelected = context.value === value;
    const firstEnabled = context.getFirstEnabledValue();
    const isFocusable = isSelected || (!context.value && firstEnabled === value);
    const tabIndex = disabled ? -1 : isFocusable ? 0 : -1;

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) return;

      const isHorizontal = context.orientation === "horizontal";
      if (event.key === "ArrowRight" && isHorizontal) {
        event.preventDefault();
        context.moveFocus(value, 1);
      } else if (event.key === "ArrowLeft" && isHorizontal) {
        event.preventDefault();
        context.moveFocus(value, -1);
      } else if (event.key === "ArrowDown" && context.orientation === "vertical") {
        event.preventDefault();
        context.moveFocus(value, 1);
      } else if (event.key === "ArrowUp" && context.orientation === "vertical") {
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
        context.selectValue(value);
      }
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;
      context.selectValue(value);
    };

    return (
      <button
        {...rest}
        ref={setRef}
        role="tab"
        type="button"
        id={context.getTriggerId(value)}
        className={cx("mosaic-tabs__trigger", className)}
        aria-selected={isSelected}
        aria-controls={context.getPanelId(value)}
        tabIndex={tabIndex}
        data-state={isSelected ? "active" : "inactive"}
        data-disabled={disabled ? "true" : undefined}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  },
);

TabsTrigger.displayName = "Tabs.Trigger";

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(({ value, className, children, ...rest }, ref) => {
  const context = useTabsContext();
  const isSelected = context.value === value;
  return (
    <div
      {...rest}
      ref={ref}
      role="tabpanel"
      id={context.getPanelId(value)}
      aria-labelledby={context.getTriggerId(value)}
      hidden={!isSelected}
      aria-hidden={!isSelected}
      tabIndex={0}
      className={cx("mosaic-tabs__panel", className)}
      data-state={isSelected ? "active" : "inactive"}
    >
      {children}
    </div>
  );
});

TabsPanel.displayName = "Tabs.Panel";

export interface TabsComponent extends ForwardRefExoticComponent<TabsProps & RefAttributes<HTMLDivElement>> {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Panel: typeof TabsPanel;
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
}) as TabsComponent;

