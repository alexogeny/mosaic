import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

export interface PortalProps extends PropsWithChildren {
  container?: HTMLElement | null;
}

export const Portal = ({ children, container }: PortalProps) => {
  const [mounted, setMounted] = useState(false);
  const node = useMemo(() => {
    if (!canUseDOM) return null;
    const element = document.createElement("div");
    element.setAttribute("data-mosaic-portal", "");
    return element;
  }, []);

  useEffect(() => {
    if (!canUseDOM || !node) return;
    const target = container ?? document.body;
    target.appendChild(node);
    setMounted(true);
    return () => {
      setMounted(false);
      if (node.parentElement) {
        node.parentElement.removeChild(node);
      }
    };
  }, [container, node]);

  if (!canUseDOM || !node || !mounted) {
    return null;
  }

  return createPortal(children, node);
};
