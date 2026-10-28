import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { useJambuTheme } from "@/design/theme";
import { reviewSegments, type TextSelection } from "@/domain/review-document";
import type { ReviewEditing } from "./review-editing";

function restoreSelection(node: HTMLDivElement, selection: TextSelection) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode(), offset = 0;
    let start: { node: Node; offset: number } | null = null, end: { node: Node; offset: number } | null = null;
    while (current) {
      const length = current.textContent?.length ?? 0;
      if (!start && offset + length >= selection.start) start = { node: current, offset: Math.max(0, selection.start - offset) };
      if (offset + length >= selection.end) { end = { node: current, offset: Math.max(0, selection.end - offset) }; break; }
      offset += length;
      current = walker.nextNode();
    }
    if (start && end) {
      const range = document.createRange();
      range.setStart(start.node, start.offset);
      range.setEnd(end.node, end.offset);
      const selected = window.getSelection();
      selected?.removeAllRanges(); selected?.addRange(range);
    }
}

// The browser owns the editable subtree. React owns its document model only;
// reconciling React children against browser edits duplicates typed characters.
export function RichInput({ editor }: { editor: ReviewEditing }) {
  const { colors } = useJambuTheme();
  const root = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const rendered = useRef("");
  const saveSelection = () => {
    const selected = window.getSelection();
    if (!root.current || !selected?.rangeCount || !root.current.contains(selected.anchorNode) || !root.current.contains(selected.focusNode)) return;
    const range = selected.getRangeAt(0), before = range.cloneRange();
    before.selectNodeContents(root.current);
    before.setEnd(range.startContainer, range.startOffset);
    const start = before.toString().length;
    editor.select({ start, end: start + range.toString().length });
  };
  const { registerFocus } = editor;
  useEffect(() => {
    registerFocus((selection) => {
      const node = root.current;
      if (!node) return;
      node.focus();
      if (selection) restoreSelection(node, selection);
    });
    return () => registerFocus(null);
  }, [registerFocus]);
  useLayoutEffect(() => {
    const node = root.current;
    if (!node || composing.current) return;
    const signature = JSON.stringify([editor.document, colors.action, colors.ink]);
    if (signature !== rendered.current) {
      const fragment = document.createDocumentFragment();
      for (const segment of reviewSegments(editor.document)) {
        const span = document.createElement("span");
        const interactive = segment.marks.some(mark => mark.type === "dish" || mark.type === "link");
        span.textContent = segment.text;
        span.style.fontWeight = segment.marks.some(mark => mark.type === "bold") ? "600" : "400";
        span.style.fontStyle = segment.marks.some(mark => mark.type === "italic") ? "italic" : "normal";
        span.style.color = interactive ? colors.action : colors.ink;
        span.style.textDecoration = interactive ? "underline" : "none";
        fragment.appendChild(span);
      }
      node.replaceChildren(fragment);
      rendered.current = signature;
    }
    if (document.activeElement !== node) return;
    restoreSelection(node, editor.selection);
  }, [editor.document, editor.selection, colors.action, colors.ink]);
  return <div ref={root} role="textbox" aria-label="Escrever review" aria-multiline="true" contentEditable suppressContentEditableWarning spellCheck
    data-placeholder="O sabor, a textura, o que ficou na memória…" data-empty={!editor.document.text}
    onCompositionStart={() => { composing.current = true; }}
    onCompositionEnd={event => { composing.current = false; rendered.current = ""; editor.changeText(event.currentTarget.textContent ?? ""); saveSelection(); }}
    onInput={event => { if (!composing.current) { editor.changeText(event.currentTarget.textContent ?? ""); saveSelection(); } }}
    onMouseUp={saveSelection} onKeyUp={saveSelection}
    onPaste={event => { event.preventDefault(); editor.insert(event.clipboardData.getData("text/plain")); }}
    onKeyDown={event => {
      if (event.key === "Enter") { event.preventDefault(); editor.insert("\n"); }
      if ((event.ctrlKey || event.metaKey) && ["b", "i"].includes(event.key.toLowerCase())) { event.preventDefault(); editor.toggle(event.key.toLowerCase() === "b" ? "bold" : "italic"); }
    }}
    style={{ "--jambu-placeholder": colors.muted, flex: 1, minHeight: 240, paddingTop: 12, paddingBottom: 16, fontFamily: "Figtree", fontSize: 17, lineHeight: "26px", color: colors.ink, caretColor: colors.action, whiteSpace: "pre-wrap", overflowWrap: "anywhere" } as CSSProperties}
  />;
}
