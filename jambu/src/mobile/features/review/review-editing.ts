import { useCallback, useRef, useState } from "react";
import type { Dish, ReviewDocument } from "@/domain/jambu";
import {
  editReview,
  replaceReviewRange,
  safeExternalUrl,
  toggleReviewStyle,
  type TextSelection,
} from "@/domain/review-document";
export function useReviewEditing(
  document: ReviewDocument,
  onChange: (document: ReviewDocument) => void,
) {
  const [selection, setSelection] = useState<TextSelection>({
    start: 0,
    end: 0,
  });
  const [active, setActive] = useState<("bold" | "italic")[]>([]);
  const focus = useRef<((selection?:TextSelection) => void) | null>(null);
  const pendingCursor = useRef<TextSelection | undefined>(undefined);
  const registerFocus=useCallback((action:((selection?:TextSelection)=>void)|null)=>{focus.current=action;},[]);
  const focusEditor=useCallback(()=>{
    focus.current?.(pendingCursor.current);
    pendingCursor.current=undefined;
  },[]);
  const select = useCallback((next: TextSelection) => {
    setSelection(next);
  },[]);
  const insert = (
    text: string,
    kind?: { type: "dish"; dishId: string } | { type: "link"; url: string },
  ) => {
    if (
      document.text.length - selection.end + selection.start + text.length >
      5000
    )
      return;
    const end = selection.start + text.length;
    onChange(
      replaceReviewRange(document, selection, text, [
        ...active.map((type) => ({ type, start: selection.start, end })),
        ...(kind ? [{ ...kind, start: selection.start, end }] : []),
      ]),
    );
    setSelection({ start: end, end });
    pendingCursor.current={start:end,end};
    focus.current?.(pendingCursor.current);
  };
  const toggle = (type: "bold" | "italic") => {
    if (selection.end > selection.start)
      onChange(toggleReviewStyle(document, selection, type));
    else
      setActive((values) =>
        values.includes(type)
          ? values.filter((value) => value !== type)
          : [...values, type],
      );
    focus.current?.();
  };
  return {
    document,
    selection,
    select,
    active,
    registerFocus,
    focusEditor,
    insert,
    toggle,
    changeText: (text: string) => {
      onChange(editReview(document, text.slice(0,5000), active));
    },
    cite: (dish: Dish) => insert(dish.name, { type: "dish", dishId: dish.id }),
    link: (url: string, label: string) => {
      const safe = safeExternalUrl(url);
      if (!safe) return false;
      insert(label || safe, { type: "link", url: safe });
      return true;
    },
  };
}
export type ReviewEditing = ReturnType<typeof useReviewEditing>;
