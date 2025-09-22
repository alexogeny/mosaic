import {
  forwardRef,
  type AriaAttributes,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { getCssVar } from "../theme/ThemeProvider";
import { cx } from "../utils/cx";
import { VisuallyHidden } from "./VisuallyHidden";

type SpinnerTone = "neutral" | "primary" | "success" | "warning" | "danger";
type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  tone?: SpinnerTone;
  size?: SpinnerSize;
  label?: string;
}

const toneStyles: Record<SpinnerTone, Record<string, string>> = {
  neutral: {
    "--mosaic-spinner-color": getCssVar("color-neutral"),
    "--mosaic-spinner-track": getCssVar("color-neutral-border"),
  },
  primary: {
    "--mosaic-spinner-color": getCssVar("color-primary"),
    "--mosaic-spinner-track": getCssVar("color-primary-border"),
  },
  success: {
    "--mosaic-spinner-color": getCssVar("color-success"),
    "--mosaic-spinner-track": getCssVar("color-success-border"),
  },
  warning: {
    "--mosaic-spinner-color": getCssVar("color-warning"),
    "--mosaic-spinner-track": getCssVar("color-warning-border"),
  },
  danger: {
    "--mosaic-spinner-color": getCssVar("color-danger"),
    "--mosaic-spinner-track": getCssVar("color-danger-border"),
  },
};

const sizeMap: Record<SpinnerSize, string> = {
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
};

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>((props, ref) => {
  const { tone = "primary", size = "md", label = "Loading", className, style, ...rest } = props;

  const { ["aria-live"]: ariaLiveProp, ...restProps } = rest as typeof rest & {
    ["aria-live"]?: AriaAttributes["aria-live"];
  };

  const sizeVars: Record<string, string> = {
    "--mosaic-spinner-size": sizeMap[size],
  };

  const styles: CSSProperties = {
    ...toneStyles[tone],
    ...sizeVars,
    ...(style as CSSProperties | undefined),
  };

  return (
    <span
      ref={ref}
      className={cx("mosaic-spinner", className)}
      role="status"
      aria-live={ariaLiveProp ?? "polite"}
      style={styles}
      {...restProps}
    >
      <span className="mosaic-spinner__circle" aria-hidden="true" />
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
});

Spinner.displayName = "Spinner";
