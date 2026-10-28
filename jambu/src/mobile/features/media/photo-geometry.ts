/** Bounds of the actual contained photo, including its letterboxing. */
export function photoBounds(
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number,
  scale: number,
) {
  "worklet";
  const fit = Math.min(
    width / Math.max(1, imageWidth),
    height / Math.max(1, imageHeight),
  );
  return {
    x: Math.max(0, (imageWidth * fit * scale - width) / 2),
    y: Math.max(0, (imageHeight * fit * scale - height) / 2),
  };
}
