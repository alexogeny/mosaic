import { forwardRef, useMemo, useState, type HTMLAttributes } from "react";
import { cx } from "../utils/cx";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle" | "square";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
}

const getInitials = (name?: string, fallback?: string) => {
  if (fallback) return fallback;
  if (!name) return "";
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  const first = parts[0] ?? "";
  const last = parts[parts.length - 1] ?? "";
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { src, alt = "", name, fallback, size = "md", shape = "circle", className, children, ...rest },
    ref,
  ) => {
    const [status, setStatus] = useState<"idle" | "loaded" | "error">(src ? "idle" : "error");

    const initials = useMemo(() => getInitials(name, fallback), [name, fallback]);

    const showFallback = !src || status === "error";

    return (
      <div
        ref={ref}
        className={cx("mosaic-avatar", className)}
        data-size={size}
        data-shape={shape}
        data-loaded={status === "loaded" ? "true" : undefined}
        {...rest}
      >
        {src && !showFallback ? (
          <img
            className="mosaic-avatar__image"
            src={src}
            alt={alt}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        ) : null}
        {showFallback ? (
          <span className="mosaic-avatar__fallback" aria-hidden={children ? undefined : "true"}>
            {children ?? (initials || "")}
          </span>
        ) : null}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
