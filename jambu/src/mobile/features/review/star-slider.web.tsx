import { useRef } from "react";
import { View } from "react-native";
import { useJambuTheme } from "@/design/theme";
import { formatRating } from "@/domain/jambu";
import { RatingStar, T } from "../../components/primitives";
import { ratingAtPosition } from "./rating-position";

export function StarSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { colors } = useJambuTheme();
  const gesture = useRef<{ x: number; y: number; dragging: boolean } | null>(
    null,
  );
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <T size={17} weight="600" style={{ flex: 1 }}>
          O que você achou do prato?
        </T>
        <T size={24} weight="600" style={{ fontVariant: ["tabular-nums"] }}>
          {formatRating(value)}
        </T>
      </View>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Nota do prato"
        aria-valuemin={0.5}
        aria-valuemax={5}
        aria-valuenow={value || 0.5}
        aria-valuetext={
          value ? `${formatRating(value)} de 5 estrelas` : "Escolha uma nota"
        }
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          minHeight: 60,
          touchAction: "pan-y",
          cursor: "ew-resize",
          borderRadius: 8,
        }}
        onKeyDown={(event) => {
          const delta = ["ArrowRight", "ArrowUp"].includes(event.key)
            ? 0.5
            : ["ArrowLeft", "ArrowDown"].includes(event.key)
              ? -0.5
              : 0;
          if (delta || ["Home", "End"].includes(event.key)) {
            event.preventDefault();
            onChange(
              event.key === "Home"
                ? 0.5
                : event.key === "End"
                  ? 5
                  : Math.max(0.5, Math.min(5, value + delta)),
            );
          }
        }}
        onPointerDown={(event) => {
          gesture.current = {
            x: event.clientX,
            y: event.clientY,
            dragging: false,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const start = gesture.current;
          if (!start) return;
          if (Math.abs(event.clientY - start.y) > 12 && !start.dragging) {
            gesture.current = null;
            return;
          }
          if (Math.abs(event.clientX - start.x) > 6) start.dragging = true;
          if (start.dragging) {
            const box = event.currentTarget.getBoundingClientRect();
            onChange(
              ratingAtPosition(event.clientX - box.left, box.width, "drag"),
            );
          }
        }}
        onPointerUp={(event) => {
          if (gesture.current) {
            const box = event.currentTarget.getBoundingClientRect();
            onChange(
              ratingAtPosition(
                event.clientX - box.left,
                box.width,
                gesture.current.dragging ? "drag" : "tap",
              ),
            );
          }
          gesture.current = null;
        }}
        onPointerCancel={() => {
          gesture.current = null;
        }}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            aria-hidden="true"
            style={{ pointerEvents: "none" }}
          >
            <RatingStar
              size={36}
              fraction={Math.max(0, Math.min(1, value - index))}
            />
          </span>
        ))}
      </div>
      <T size={13} style={{ color: colors.muted }}>
        Toque para dar a nota. Arraste para ajustar meias estrelas.
      </T>
    </View>
  );
}
