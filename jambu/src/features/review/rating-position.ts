export function ratingAtPosition(
  x: number,
  width: number,
  mode: "tap" | "drag",
) {
  "worklet";
  if (width <= 0 || !Number.isFinite(x)) return 0.5;
  const position = Math.max(0, Math.min(1, x / width)) * 5;
  return Math.max(
    0.5,
    Math.min(
      5,
      mode === "tap" ? Math.ceil(position) : Math.round(position * 2) / 2,
    ),
  );
}
