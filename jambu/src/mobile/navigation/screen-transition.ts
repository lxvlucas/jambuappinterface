import { Easing, Platform } from "react-native";
import type { StackNavigationOptions } from "expo-router/js-stack";

// Figma LN8FHBVpv7pnOibbDbjFox, Frame 2 (1:38): only the top
// screen moves. Timeline pauses belong to the demo, not to navigation.
export const screenTransition = {
  enterMs: 295,
  exitMs: 294,
  easing: Easing.bezier(0.7, 0, 0.3, 1),
};

export function overlayScreenOptions(
  reducedMotion: boolean,
): StackNavigationOptions {
  return {
    animation: "default",
    presentation: "transparentModal",
    detachPreviousScreen: false,
    cardShadowEnabled: false,
    cardOverlayEnabled: false,
    gestureEnabled: Platform.OS !== "web",
    gestureDirection: "horizontal",
    transitionSpec: {
      open: {
        animation: "timing",
        config: {
          duration: reducedMotion ? 100 : screenTransition.enterMs,
          easing: screenTransition.easing,
        },
      },
      close: {
        animation: "timing",
        config: {
          duration: reducedMotion ? 100 : screenTransition.exitMs,
          easing: screenTransition.easing,
        },
      },
    },
    // Deliberately ignore `next.progress`: a covered scene must stay still.
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: reducedMotion
        ? { opacity: current.progress }
        : {
            transform: [{
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            }],
          },
    }),
  };
}
