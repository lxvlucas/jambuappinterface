import { useState } from "react";
import { Pressable, type GestureResponderEvent } from "react-native";
import Animated, { cubicBezier } from "react-native-reanimated";
import { useJambuTheme } from "@/design/theme";
import { Icon } from "@/components/jambu/icon";
import { T } from "./primitives";

export function LikeButton({
  liked,
  count,
  label,
  onPress,
}: {
  liked: boolean;
  count: number;
  label: string;
  onPress: () => void;
}) {
  const { colors, reducedMotion } = useJambuTheme();
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: liked }}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={(event: GestureResponderEvent) => {
        event.stopPropagation();
        onPress();
      }}
      style={{ minHeight: 48, minWidth: 48, justifyContent: "center" }}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          gap: 6,
          alignItems: "center",
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: reducedMotion ? 1 : pressed ? 0.94 : 1 }],
          transitionProperty: ["transform", "opacity"],
          transitionDuration: 120,
          transitionTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
        }}
      >
        <Icon
          name="heart"
          size={20}
          filled={liked}
          color={liked ? colors.action : colors.muted}
        />
        <T size={12} style={{ color: liked ? colors.action : colors.muted }}>
          {count}
        </T>
      </Animated.View>
    </Pressable>
  );
}
