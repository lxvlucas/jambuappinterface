import { ratingColor } from "@/domain/rating-color";
import { formatRating } from "@/domain/jambu";
import { useJambuTheme } from "@/design/theme";
import { T, RatingStar } from "./primitives";
import { View } from "react-native";

export function PostScore({ value }: { value: number }) {
  const { colors } = useJambuTheme();
  const color = ratingColor(value, {
    low: colors.ratingLow,
    middle: colors.ratingMiddle,
    high: colors.action,
  });
  return (
    <View
      accessible
      accessibilityLabel={`Média ${formatRating(value)} de cinco estrelas`}
      style={{ alignItems: "flex-end", gap: 1 }}
    >
      <T
        size={25}
        weight="600"
        style={{ fontVariant: ["tabular-nums"], color, lineHeight: 28 }}
      >
        {formatRating(value)}
      </T>
      <View aria-hidden style={{ flexDirection: "row", gap: 1 }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <RatingStar
            key={index}
            fraction={Math.max(0, Math.min(1, value - index))}
            size={10}
            color={color}
          />
        ))}
      </View>
    </View>
  );
}
