import { useMeasuredWidth } from "@/design/content-layout";
import { Platform, Pressable, ScrollView, View } from "react-native";
import type { Meal } from "@/domain/jambu";
import { formatRating } from "@/domain/jambu";
import { useMedia } from "../features/media/media-provider";
import { ChoiceSeal, Photo } from "./primitives";

export function FeedPhotos({ meal }: { meal: Meal }) {
  const { width, onLayout } = useMeasuredWidth();
  const media = useMedia();
  const free = meal.dishes.length >= 3;
  const available = width - 80;
  const cell = free
    ? Platform.OS === "web" && width > 500
      ? 190
      : 152
    : meal.dishes.length === 1
      ? available
      : (available - 6) / 2;
  const height = free
    ? Platform.OS === "web" && width > 500
      ? 248
      : 202
    : meal.dishes.length === 1
      ? Math.min(available, 360)
      : Math.min((cell * 4) / 3, 330);
  const photos = meal.dishes.map((dish, index) => (
    <Pressable
      key={dish.id}
      accessibilityRole="link"
      accessibilityLabel={`Ver ${dish.name}, nota ${formatRating(dish.rating)}`}
      onPress={(event) => {
        event.stopPropagation();
        media.open(meal.id, index);
      }}
      style={({ pressed }) => ({
        width: cell,
        height,
        opacity: pressed ? 0.85 : 1,
        overflow: "hidden",
        borderRadius: 12,
      })}
    >
      <Photo
        uri={dish.imageUrl}
        label={dish.name}
        style={{ width: "100%", height: "100%" }}
      />
      {meal.choiceDishId === dish.id ? (
        <View style={{ position: "absolute", left: 7, bottom: 7 }}>
          <ChoiceSeal compact />
        </View>
      ) : null}
    </Pressable>
  ));
  return free ? (
    <ScrollView
      onLayout={onLayout}
      horizontal
      directionalLockEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: 64,
        paddingRight: 16,
        gap: 8,
        paddingVertical: 5,
      }}
    >
      {photos}
    </ScrollView>
  ) : (
    <View
      onLayout={onLayout}
      style={{
        flexDirection: "row",
        paddingLeft: 64,
        paddingRight: 16,
        gap: 6,
        paddingVertical: 5,
      }}
    >
      {photos}
    </View>
  );
}
