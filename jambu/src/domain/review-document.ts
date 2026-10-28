import type { ReviewDocument, ReviewMark } from "./jambu";
export type TextSelection = { start: number; end: number };
export const safeExternalUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};
export function normalizeMarks(
  text: string,
  marks: ReviewMark[] = [],
  dishIds?: string[],
): ReviewMark[] {
  const valid = marks.filter(
    (mark) =>
      Number.isInteger(mark.start) &&
      Number.isInteger(mark.end) &&
      mark.start >= 0 &&
      mark.end <= text.length &&
      mark.end > mark.start &&
      (mark.type !== "link" || !!safeExternalUrl(mark.url)) &&
      (mark.type !== "dish" || !dishIds || dishIds.includes(mark.dishId)),
  );
  const result = valid.filter(mark => mark.type !== "bold" && mark.type !== "italic");
  for (const type of ["bold", "italic"] as const) {
    const ranges = valid.filter(mark => mark.type === type).sort((a,b) => a.start - b.start);
    let previous: ReviewMark | undefined;
    for (const range of ranges) {
      if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
      else { previous = {...range}; result.push(previous); }
    }
  }
  return result.sort((a,b) => a.start - b.start || a.end - b.end);
}
/** UTF-16 offsets match native TextInput and browser selections. Atomic links break when edited. */
export function replaceReviewRange(
  doc: ReviewDocument,
  selection: TextSelection,
  inserted: string,
  additions: ReviewMark[] = [],
): ReviewDocument {
  const start = Math.max(0, Math.min(doc.text.length, selection.start));
  const end = Math.max(start, Math.min(doc.text.length, selection.end));
  const delta = inserted.length - (end - start);
  const marks: ReviewMark[] = [];
  for (const mark of doc.marks) {
    if (mark.end <= start) marks.push(mark);
    else if (mark.start >= end)
      marks.push({ ...mark, start: mark.start + delta, end: mark.end + delta });
    else if (mark.type === "bold" || mark.type === "italic") {
      const next = {
        ...mark,
        start: Math.min(mark.start, start),
        end: mark.end >= end ? mark.end + delta : start + inserted.length,
      };
      if (next.end > next.start) marks.push(next);
    }
  }
  const text = doc.text.slice(0, start) + inserted + doc.text.slice(end);
  return { text, marks: normalizeMarks(text, [...marks, ...additions]) };
}
export function editReview(
  doc: ReviewDocument,
  text: string,
  active: ("bold" | "italic")[] = [],
): ReviewDocument {
  let start = 0;
  while (
    start < doc.text.length &&
    start < text.length &&
    doc.text[start] === text[start]
  )
    start++;
  let end = doc.text.length,
    nextEnd = text.length;
  while (
    end > start &&
    nextEnd > start &&
    doc.text[end - 1] === text[nextEnd - 1]
  ) {
    end--;
    nextEnd--;
  }
  return replaceReviewRange(
    doc,
    { start, end },
    text.slice(start, nextEnd),
    active.map((type) => ({ type, start, end: nextEnd })),
  );
}
export function toggleReviewStyle(
  doc: ReviewDocument,
  selection: TextSelection,
  type: "bold" | "italic",
): ReviewDocument {
  if (selection.start === selection.end) return doc;
  const existing = doc.marks.some(
    (mark) =>
      mark.type === type &&
      mark.start <= selection.start &&
      mark.end >= selection.end,
  );
  if (!existing)
    return { ...doc, marks: [...doc.marks, { ...selection, type }] };
  return {
    ...doc,
    marks: doc.marks.flatMap<ReviewMark>((mark) => {
      if (
        mark.type !== type ||
        mark.end <= selection.start ||
        mark.start >= selection.end
      )
        return [mark];
      const pieces: ReviewMark[] = [];
      if (mark.start < selection.start)
        pieces.push({ ...mark, end: selection.start });
      if (mark.end > selection.end)
        pieces.push({ ...mark, start: selection.end });
      return pieces;
    }),
  };
}
export function reviewSegments(doc: ReviewDocument) {
  const marks = normalizeMarks(doc.text, doc.marks);
  const edges = [
    ...new Set([
      0,
      doc.text.length,
      ...marks.flatMap((mark) => [mark.start, mark.end]),
    ]),
  ].sort((a, b) => a - b);
  return edges
    .slice(0, -1)
    .map((start, index) => ({
      start,
      text: doc.text.slice(start, edges[index + 1]),
      marks: marks.filter(
        (mark) => mark.start <= start && mark.end >= edges[index + 1],
      ),
    }));
}
