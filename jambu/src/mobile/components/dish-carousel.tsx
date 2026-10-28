import { useMeasuredWidth } from "@/design/content-layout";
import { useEffect, useId, useRef, useState, type ComponentRef } from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import type { Meal } from "@/domain/jambu";
import { useJambuTheme } from "@/design/theme";
import { ChoiceSeal, Photo, Rating, T } from "./primitives";
import { useMedia } from "../features/media/media-provider";

export function DishCarousel({
  meal,
  initialIndex = 0,
}: {
  meal: Meal;
  initialIndex?: number;
}) {
  const { width, onLayout } = useMeasuredWidth();
  const media = useMedia();
  const { colors, reducedMotion } = useJambuTheme();
  const first = Math.max(0, Math.min(initialIndex, meal.dishes.length - 1));
  const [index, setIndex] = useState(first);
  const active = useRef(first);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const offset = useSharedValue(first * width);
  const requested = useRef(first);
  const dots = useRef<ComponentRef<typeof ScrollView>>(null);
  const onScroll = useAnimatedScrollHandler((event) => {
    offset.set(event.contentOffset.x);
  });
  const indicator = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          Math.max(0, Math.min(meal.dishes.length - 1, offset.get() / width)) *
          48,
      },
    ],
  }));
  const gradient = useId().replace(/[^a-zA-Z0-9]/g, "");
  useEffect(() => {
    const changed = requested.current !== first;
    if (changed) {
      active.current = first;
      requested.current = first;
      setIndex(first);
    }
    scroll.current?.scrollTo({
      x: width * active.current,
      animated: changed && !reducedMotion,
    });
  }, [width, first, reducedMotion]);
  useEffect(() => {
    dots.current?.scrollTo({
      x: Math.max(0, index * 48 - width / 2 + 24),
      animated: !reducedMotion,
    });
  }, [index, width, reducedMotion]);
  const select = (next: number) => {
    active.current = next;
    setIndex(next);
    scroll.current?.scrollTo({ x: width * next, animated: !reducedMotion });
  };
  return (
    <View onLayout={onLayout}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scroll}
        horizontal
        pagingEnabled
        contentOffset={{ x: first * width, y: 0 }}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const next = Math.max(
            0,
            Math.min(
              Math.round(event.nativeEvent.contentOffset.x / width),
              meal.dishes.length - 1,
            ),
          );
          active.current = next;
          setIndex(next);
        }}
      >
        {meal.dishes.map((dish, dishIndex) => (
          <View
            key={dish.id}
            style={{
              width,
              height:
                Platform.OS === "web"
                  ? Math.min((width * 4) / 3, 560)
                  : (width * 4) / 3,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Ampliar foto de ${dish.name}`}
              onPress={() => media.open(meal.id, dishIndex)}
              style={{ width: "100%", height: "100%" }}
            >
              <Photo
                uri={dish.imageUrl}
                label={dish.name}
                style={{ width: "100%", height: "100%" }}
              />
            </Pressable>
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: 164,
              }}
            >
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient
                    id={`${gradient}-${dish.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <Stop offset="0" stopColor="#000000" stopOpacity={0} />
                    <Stop offset="1" stopColor="#000000" stopOpacity={0.9} />
                  </LinearGradient>
                </Defs>
                <Rect
                  width="100%"
                  height="100%"
                  fill={`url(#${gradient}-${dish.id})`}
                />
              </Svg>
            </View>
            {meal.choiceDishId === dish.id ? (
              <View pointerEvents="none" style={{ position: "absolute", top: 14, left: 16 }}>
                <ChoiceSeal />
              </View>
            ) : null}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                right: 20,
                gap: 8,
              }}
            >
              <T size={18} weight="600" style={{ color: "#FFFFFF" }}>
                {dish.name}
              </T>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Rating value={dish.rating} size={18} inverse />
                {dish.price !== null ? (
                  <T size={13} style={{ color: "#FFFFFF" }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(dish.price)}
                  </T>
                ) : null}
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      {meal.dishes.length > 1 ? (
        <ScrollView
          ref={dots}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View
            style={{
              flexDirection: "row",
              height: 48,
              width: meal.dishes.length * 48,
            }}
          >
            {meal.dishes.map((dish, i) => (
              <Pressable
                key={dish.id}
                accessibilityRole="button"
                accessibilityLabel={`Mostrar prato ${i + 1}: ${dish.name}`}
                accessibilityState={{ selected: index === i }}
                onPress={() => select(i)}
                style={{
                  width: 48,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: colors.line,
                  }}
                />
              </Pressable>
            ))}
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: "absolute",
                  left: 16,
                  top: 21.5,
                  width: 16,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: colors.ink,
                },
                indicator,
              ]}
            />
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}
