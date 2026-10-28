import { createContext, useCallback, useContext, useState } from "react";
import type { LayoutChangeEvent } from 'react-native';
import { useViewport } from "./viewport";

/** Components size media to their column, rather than to the browser window. */
export const ContentWidth = createContext<number | null>(null);
export function useContentWidth() {
  const column = useContext(ContentWidth);
  const viewport = useViewport();
  return column ?? viewport.width;
}

/** A scroll container can be narrower than its column because of a scrollbar. */
export function useMeasuredWidth() {
  const fallback = useContentWidth();
  const [measured, setMeasured] = useState<number | null>(null);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (next > 0) setMeasured(next);
  }, []);
  return { width: measured ?? fallback, onLayout };
}
