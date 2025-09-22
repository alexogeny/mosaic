import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";

export type SkeletonVariant = "rect" | "text" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animate?: boolean;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
  const { variant = "rect", animate = true, className, style, ...rest } = props;

  const skeletonVars: Record<string, string> = {
    "--mosaic-skeleton-base": getCssVar("color-surface-hover"),
    "--mosaic-skeleton-highlight": getCssVar("color-surface"),
  };

  const styles: CSSProperties = {
    ...skeletonVars,
    ...(style as CSSProperties | undefined),
  };

  return (
    <div
      ref={ref}
      className={cx("mosaic-skeleton", className)}
      data-variant={variant}
      data-animate={animate ? undefined : "false"}
      role="presentation"
      aria-hidden="true"
      style={styles}
      {...rest}
    />
  );
});

Skeleton.displayName = "Skeleton";
