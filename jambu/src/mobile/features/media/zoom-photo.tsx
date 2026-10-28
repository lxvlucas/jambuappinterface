import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { Dish } from "@/domain/jambu";
import { photoBounds } from "./photo-geometry";
import { pictures } from "../../data/pictures";
import { T } from "../../components/primitives";

export interface ZoomPhotoHandle {
  toggleZoom: () => void;
  goTo: (index: number) => void;
}
export interface ZoomPhotoProps {
  dishes: Dish[];
  initialIndex: number;
  onIndexChange: (index: number) => void;
  onDismiss: () => void;
  dragY: SharedValue<number>;
}
const snap = { duration: 400, dampingRatio: 0.85 };
function GalleryPage({
  dish,
  page,
  index,
  scale,
  x,
  y,
  width,
  sizes,
}: {
  dish: Dish;
  page: number;
  index: SharedValue<number>;
  scale: SharedValue<number>;
  x: SharedValue<number>;
  y: SharedValue<number>;
  width: number;
  sizes: SharedValue<Record<number, { width: number; height: number }>>;
}) {
  const [failed, setFailed] = useState(false);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: index.get() === page ? x.get() : 0 },
      { translateY: index.get() === page ? y.get() : 0 },
      { scale: index.get() === page ? scale.get() : 1 },
    ],
  }));
  return (
    <Animated.View style={[{ width, height: "100%" }, style]}>
      {failed ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <T>Foto indisponível</T>
        </View>
      ) : (
        <Image
          source={pictures[dish.imageUrl] ?? { uri: dish.imageUrl }}
          contentFit="contain"
          accessibilityLabel={`Foto de ${dish.name}. Use dois dedos para ampliar.`}
          onLoad={(e) =>
            sizes.set({
              ...sizes.get(),
              [page]: { width: e.source.width, height: e.source.height },
            })
          }
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </Animated.View>
  );
}
/** All pages stay mounted. The strip follows the finger on the UI runtime. */
export const ZoomPhoto = forwardRef<ZoomPhotoHandle, ZoomPhotoProps>(
  function ZoomPhoto(
    { dishes, initialIndex, onIndexChange, onDismiss, dragY },
    ref,
  ) {
    const [layout, setLayout] = useState({ width: 1, height: 1 });
    const width = useSharedValue(1),
      height = useSharedValue(1),
      index = useSharedValue(initialIndex);
    const offset = useSharedValue(0),
      scale = useSharedValue(1),
      x = useSharedValue(0),
      y = useSharedValue(0);
    const savedX = useSharedValue(0),
      savedY = useSharedValue(0),
      start = useSharedValue(0),
      axis = useSharedValue(0),
      base = useSharedValue(1);
    const focalX = useSharedValue(0),
      focalY = useSharedValue(0);
    const sizes = useSharedValue<
      Record<number, { width: number; height: number }>
    >({});
    const reduced = useReducedMotion();
    const goTo = (target: number) => {
      const next = Math.max(0, Math.min(dishes.length - 1, target));
      index.set(next);
      scale.set(1);
      x.set(0);
      y.set(0);
      offset.set(
        reduced ? -next * width.get() : withSpring(-next * width.get(), snap),
      );
      onIndexChange(next);
    };
    const toggleZoom = () => {
      scale.set(
        withSpring(scale.get() > 1.05 ? 1 : 2.5, {
          duration: 280,
          dampingRatio: 1,
        }),
      );
      x.set(withSpring(0, snap));
      y.set(withSpring(0, snap));
    };
    useImperativeHandle(ref, () => ({ toggleZoom, goTo }));
    const gestures = useMemo(() => {
      const clamp = (v: number, b: number) => {
        "worklet";
        return Math.max(-b, Math.min(b, v));
      };
      const bounds = (zoom: number) => {
        "worklet";
        const size = sizes.get()[index.get()];
        return photoBounds(
          width.get(),
          height.get(),
          size?.width ?? width.get(),
          size?.height ?? height.get(),
          zoom,
        );
      };
      const pan = Gesture.Pan()
        .maxPointers(1)
        .minDistance(8)
        .onStart(() => {
          cancelAnimation(offset);
          cancelAnimation(dragY);
          start.set(offset.get());
          savedX.set(x.get());
          savedY.set(y.get());
          axis.set(0);
        })
        .onUpdate((e) => {
          if (scale.get() > 1.05) {
            x.set(clamp(savedX.get() + e.translationX, bounds(scale.get()).x));
            y.set(clamp(savedY.get() + e.translationY, bounds(scale.get()).y));
            return;
          }
          if (!axis.get() && Math.hypot(e.translationX, e.translationY) > 8)
            axis.set(
              Math.abs(e.translationY) > Math.abs(e.translationX) * 1.15
                ? 2
                : 1,
            );
          if (axis.get() === 2) dragY.set(e.translationY);
          else if (axis.get() === 1) {
            const value = start.get() + e.translationX,
              min = -(dishes.length - 1) * width.get();
            offset.set(
              value > 0
                ? value * 0.22
                : value < min
                  ? min + (value - min) * 0.22
                  : value,
            );
          }
        })
        .onEnd((e) => {
          if (scale.get() > 1.05) {
            offset.set(withSpring(-index.get() * width.get(), snap));
            return;
          }
          if (axis.get() === 2) {
            // A vertical gesture may interrupt a horizontal settle halfway through.
            // Restore its selected page as well as the vertical position.
            offset.set(withSpring(-index.get() * width.get(), snap));
            const dismiss =
              Math.abs(e.translationY) > 90 ||
              (Math.abs(e.translationY) > 16 && Math.abs(e.velocityY) > 750);
            if (dismiss) {
              const direction = e.translationY < 0 ? -1 : 1;
              dragY.set(
                withTiming(
                  direction * height.get(),
                  { duration: reduced ? 0 : 200 },
                  (done) => {
                    if (done) scheduleOnRN(onDismiss);
                  },
                ),
              );
            } else dragY.set(withSpring(0, { ...snap, velocity: e.velocityY }));
          } else {
            const delta = offset.get() + index.get() * width.get();
            const step =
              Math.abs(delta) > width.get() * 0.18 ||
              (Math.abs(delta) > 16 && Math.abs(e.velocityX) > 650);
            const next = Math.max(
              0,
              Math.min(
                dishes.length - 1,
                index.get() + (step ? (delta < 0 ? 1 : -1) : 0),
              ),
            );
            index.set(next);
            offset.set(
              withSpring(-next * width.get(), {
                ...snap,
                velocity: e.velocityX,
              }),
            );
            scheduleOnRN(onIndexChange, next);
          }
        })
        .onFinalize((_e, success) => {
          if (!success) {
            offset.set(withSpring(-index.get() * width.get(), snap));
            dragY.set(withSpring(0, snap));
          }
        });
      const pinch = Gesture.Pinch()
        .onStart((e) => {
          base.set(scale.get());
          savedX.set(x.get());
          savedY.set(y.get());
          focalX.set(e.focalX - width.get() / 2);
          focalY.set(e.focalY - height.get() / 2);
        })
        .onUpdate((e) => {
          const next = Math.max(1, Math.min(4, base.get() * e.scale));
          scale.set(next);
          x.set(
            clamp(
              focalX.get() -
                ((focalX.get() - savedX.get()) * next) / base.get(),
              bounds(next).x,
            ),
          );
          y.set(
            clamp(
              focalY.get() -
                ((focalY.get() - savedY.get()) * next) / base.get(),
              bounds(next).y,
            ),
          );
        });
      const tap = Gesture.Tap()
        .numberOfTaps(2)
        .maxDistance(8)
        .maxDuration(220)
        .maxDelay(280)
        .onEnd((_e, success) => {
          if (success) {
            scale.set(
              withSpring(scale.get() > 1.05 ? 1 : 2.5, {
                duration: 280,
                dampingRatio: 1,
              }),
            );
            x.set(withSpring(0, snap));
            y.set(withSpring(0, snap));
          }
        });
      return Gesture.Simultaneous(pinch, Gesture.Race(pan, tap));
    }, [
      sizes,
      base,
      dragY,
      dishes.length,
      focalX,
      focalY,
      height,
      index,
      offset,
      onDismiss,
      onIndexChange,
      reduced,
      savedX,
      savedY,
      scale,
      start,
      axis,
      width,
      x,
      y,
    ]);
    const strip = useAnimatedStyle(() => ({
      transform: [{ translateX: offset.get() }],
    }));
    const stage = useAnimatedStyle(() => ({
      transform: [
        { translateY: dragY.get() },
        { scale: 1 - Math.min(Math.abs(dragY.get()) / height.get(), 1) * 0.12 },
      ],
    }));
    return (
      <View
        style={StyleSheet.absoluteFill}
        onLayout={(e) => {
          const next = e.nativeEvent.layout;
          setLayout({ width: next.width, height: next.height });
          width.set(next.width);
          height.set(next.height);
          offset.set(-index.get() * next.width);
        }}
      >
        <GestureDetector gesture={gestures}>
          <Animated.View style={[{ flex: 1, overflow: "hidden" }, stage]}>
            <Animated.View
              style={[
                {
                  height: "100%",
                  width: layout.width * dishes.length,
                  flexDirection: "row",
                },
                strip,
              ]}
            >
              {dishes.map((dish, page) => (
                <GalleryPage
                  key={dish.id}
                  dish={dish}
                  page={page}
                  index={index}
                  scale={scale}
                  x={x}
                  y={y}
                  sizes={sizes}
                  width={layout.width}
                />
              ))}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  },
);
