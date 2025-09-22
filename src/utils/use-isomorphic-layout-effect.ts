import { useEffect, useLayoutEffect } from "react";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
