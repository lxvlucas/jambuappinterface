import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { formatRating } from "@/domain/jambu";
import { RatingStar, T } from "../../components/primitives";
import { ratingAtPosition } from "./rating-position";

function SliderStar({
  index,
  preview,
}: {
  index: number;
  preview: SharedValue<number>;
}) {
  const filled = useAnimatedStyle(() => ({
    width: 36 * Math.max(0, Math.min(1, preview.get() - index)),
  }));
  return (
    <View style={{ width: 36, height: 36 }}>
      <RatingStar fraction={0} size={36} />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            height: 36,
            overflow: "hidden",
          },
          filled,
        ]}
      >
        <RatingStar fraction={1} size={36} />
      </Animated.View>
    </View>
  );
}

export function StarSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const width = useSharedValue(1);
  const preview = useSharedValue(value);
  const dragging = useSharedValue(false);
  useEffect(() => {
    if (!dragging.get()) preview.set(value);
  }, [value, preview, dragging]);
  // Cross to React only on a half-star detent, never for continuous scroll frames.
  useAnimatedReaction(
    () => preview.get(),
    (next, previous) => {
      if (next !== previous && next !== value && next >= 0.5)
        scheduleOnRN(onChange, next);
    },
    [onChange, value],
  );
  const pan = Gesture.Pan()
    .maxPointers(1)
    .activeOffsetX([-6, 6])
    .failOffsetY([-12, 12])
    .onStart((event) => {
      dragging.set(true);
      preview.set(ratingAtPosition(event.x, width.get(), "drag"));
    })
    .onUpdate((event) => {
      preview.set(ratingAtPosition(event.x, width.get(), "drag"));
    })
    .onFinalize(() => {
      dragging.set(false);
    });
  const tap = Gesture.Tap()
    .maxDistance(10)
    .onEnd((event, success) => {
      if (success) preview.set(ratingAtPosition(event.x, width.get(), "tap"));
    });
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <T size={15} weight="600" style={{ flex: 1 }}>
          O que você achou do prato?
        </T>
        <T size={20} weight="600" style={{ fontVariant: ["tabular-nums"] }}>
          {formatRating(value)}
        </T>
      </View>
      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Ajustar nota em meias estrelas"
          accessibilityValue={{
            min: 0,
            max: 5,
            now: value,
            text: `${formatRating(value)} de cinco estrelas`,
          }}
          accessibilityActions={[
            { name: "increment", label: "Aumentar meia estrela" },
            { name: "decrement", label: "Diminuir meia estrela" },
          ]}
          onAccessibilityAction={({ nativeEvent }) =>
            onChange(
              Math.max(
                0.5,
                Math.min(
                  5,
                  value + (nativeEvent.actionName === "increment" ? 0.5 : -0.5),
                ),
              ),
            )
          }
          collapsable={false}
          onLayout={(event) => width.set(event.nativeEvent.layout.width)}
          style={{ height: 60, flexDirection: "row" }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`Dar ${index + 1} ${index === 0 ? "estrela" : "estrelas"}`}
              accessibilityState={{ selected: value === index + 1 }}
              onPress={() => {
                preview.set(index + 1);
                onChange(index + 1);
              }}
              style={{
                flex: 1,
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SliderStar index={index} preview={preview} />
            </Pressable>
          ))}
        </View>
      </GestureDetector>
      <T size={12} muted>
        Toque para dar a nota. Arraste para ajustar meias estrelas.
      </T>
    </View>
  );
}
