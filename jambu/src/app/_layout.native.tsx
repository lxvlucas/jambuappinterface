import { Stack } from "expo-router/js-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, type ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { JambuThemeProvider, useJambuTheme } from "@/design/theme";
import { JambuProvider } from "@/mobile/data/provider";
import { AppShell } from "@/mobile/components/app-shell";
import { MediaProvider } from "@/mobile/features/media/media-provider";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { overlayScreenOptions } from "@/mobile/navigation/screen-transition";

SplashScreen.preventAutoHideAsync().catch(() => {});

// The shell belongs to a scene, not to the navigator's changing active pathname.
// Keeping this renderer stable also preserves the underlying screen and its scroll.
function NativeScreenFrame({
  children,
  route,
}: {
  children: ReactNode;
  route: { name: string };
}) {
  return (
    <AppShell pathname={route.name === "index" ? "/" : `/${route.name}`}>
      {children}
    </AppShell>
  );
}

function Navigation() {
  const { colors, dark, reducedMotion } = useJambuTheme();
  return (
    <>
      <StatusBar style={dark ? "light" : "dark"} />
      <Stack
        screenLayout={NativeScreenFrame}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          animation: "none",
          cardShadowEnabled: false,
          cardOverlayEnabled: false,
        }}
      >
        {["meal/[id]", "profile/[id]", "restaurant/[id]", "settings", "new"].map((name) => (
          <Stack.Screen
            key={name}
            name={name}
            options={overlayScreenOptions(reducedMotion)}
          />
        ))}
      </Stack>
    </>
  );
}
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Figtree: require("@/assets/fonts/Figtree.ttf"),
  });
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <JambuThemeProvider>
          <JambuProvider>
            <KeyboardProvider>
              <MediaProvider>
                <Navigation />
              </MediaProvider>
            </KeyboardProvider>
          </JambuProvider>
        </JambuThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
