import { Alert, Linking } from "react-native";
import type { Dish, ReviewMark } from "@/domain/jambu";
import { reviewSegments, safeExternalUrl } from "@/domain/review-document";
import { useJambuTheme } from "@/design/theme";
import { T } from "./primitives";
function legacyMarks(text: string, dishes: Dish[]): ReviewMark[] {
  const marks: ReviewMark[] = [];
  const lower = text.toLocaleLowerCase("pt-BR");
  let cursor = 0;
  while (cursor < text.length) {
    const next = dishes
      .map((dish) => ({
        dish,
        start: lower.indexOf(dish.name.toLocaleLowerCase("pt-BR"), cursor),
      }))
      .filter((value) => value.start >= 0 && value.dish.name.length)
      .sort(
        (a, b) => a.start - b.start || b.dish.name.length - a.dish.name.length,
      )[0];
    if (!next) break;
    marks.push({
      type: "dish",
      dishId: next.dish.id,
      start: next.start,
      end: next.start + next.dish.name.length,
    });
    cursor = next.start + next.dish.name.length;
  }
  return marks;
}
export function ReviewText({
  text,
  dishes,
  onDish,
  marks,
  numberOfLines,
}: {
  text: string;
  dishes: Dish[];
  onDish: (index: number) => void;
  marks?: ReviewMark[];
  numberOfLines?: number;
}) {
  const { colors } = useJambuTheme();
  const segments = reviewSegments({
    text,
    marks: marks ?? legacyMarks(text, dishes),
  });
  return (
    <T size={16} numberOfLines={numberOfLines} style={{ lineHeight: 25 }}>
      {segments.map((segment) => {
        const mention = segment.marks.find((mark) => mark.type === "dish");
        const link = segment.marks.find((mark) => mark.type === "link");
        const dishIndex =
          mention?.type === "dish"
            ? dishes.findIndex((dish) => dish.id === mention.dishId)
            : -1;
        const interactive = dishIndex >= 0 || link?.type === "link";
        return (
          <T
            key={segment.start}
            size={16}
            weight={
              segment.marks.some((mark) => mark.type === "bold") ||
              dishIndex >= 0
                ? "600"
                : "400"
            }
            accessibilityRole={interactive ? "link" : undefined}
            onPress={
              interactive
                ? () => {
                    if (dishIndex >= 0) onDish(dishIndex);
                    else if (link?.type === "link" && safeExternalUrl(link.url))
                      void Linking.openURL(link.url).catch(() =>
                        Alert.alert("Não foi possível abrir o link"),
                      );
                  }
                : undefined
            }
            style={{
              fontStyle: segment.marks.some((mark) => mark.type === "italic")
                ? "italic"
                : "normal",
              color: interactive ? colors.action : colors.ink,
              textDecorationLine: interactive ? "underline" : "none",
              lineHeight: 25,
            }}
          >
            {segment.text}
          </T>
        );
      })}
    </T>
  );
}
