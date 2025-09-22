import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { cx } from "../utils/cx";

type StackDirection = "row" | "column";
type StackGap = "none" | "xs" | "sm" | "md" | "lg";
type StackAlign = "start" | "center" | "end" | "stretch";
type StackJustify =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly";

const gapMap: Record<StackGap, string> = {
  none: "0",
  xs: "var(--mosaic-spacing-xs)",
  sm: "var(--mosaic-spacing-sm)",
  md: "var(--mosaic-spacing-md)",
  lg: "var(--mosaic-spacing-lg)",
};

const alignMap: Record<StackAlign, CSSProperties["alignItems"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const justifyMap: Record<StackJustify, CSSProperties["justifyContent"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  "space-evenly": "space-evenly",
};

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "column",
      gap = "md",
      align = "stretch",
      justify = "start",
      wrap = false,
      className,
      style: inlineStyle,
      ...rest
    },
    ref,
  ) => {
    const styles: CSSProperties = { ...(inlineStyle as CSSProperties | undefined) };
    Object.assign(styles, {
      "--mosaic-stack-gap": gapMap[gap],
      "--mosaic-stack-align": alignMap[align] ?? "stretch",
      "--mosaic-stack-justify": justifyMap[justify] ?? "flex-start",
    });

    if (wrap) {
      styles.flexWrap = "wrap";
    }

    return (
      <div
        ref={ref}
        data-direction={direction}
        className={cx("mosaic-stack", className)}
        style={styles}
        {...rest}
      />
    );
  },
);

Stack.displayName = "Stack";
