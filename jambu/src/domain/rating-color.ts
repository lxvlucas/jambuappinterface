type Scale = { low: string; middle: string; high: string };
export function ratingColor(rating: number, scale: Scale) {
  const unit =
    (Math.max(0.5, Math.min(5, Number.isFinite(rating) ? rating : 0.5)) - 0.5) /
    4.5;
  const from = unit <= 0.5 ? scale.low : scale.middle;
  const to = unit <= 0.5 ? scale.middle : scale.high;
  const ratio = unit <= 0.5 ? unit * 2 : (unit - 0.5) * 2;
  const channel = (hex: string, start: number) =>
    parseInt(hex.slice(start, start + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((start) =>
        Math.round(
          channel(from, start) +
            (channel(to, start) - channel(from, start)) * ratio,
        )
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
