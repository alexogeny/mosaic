import { useCallback, useState } from "react";

interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export const useControllableState = <T,>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [isControlled ? (value as T) : (internalValue as T), setValue] as const;
};
