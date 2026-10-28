import { Stack } from "expo-router/js-stack";
import Head from "expo-router/head";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { JambuThemeProvider, useJambuTheme } from "@/design/theme";
import { JambuProvider } from "@/mobile/data/provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppShell, WebScreenFrame } from "@/mobile/components/app-shell.web";
import { overlayScreenOptions } from "@/mobile/navigation/screen-transition";
import { MediaProvider } from "@/mobile/features/media/media-provider";
import "@/global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});
function Navigation() {
  const { colors, dark, reducedMotion } = useJambuTheme();
  return (
    <>
      <Head>
        <title>Jambu · Prato por prato</title>
        <meta name="theme-color" content={colors.background} />
      </Head>
      <StatusBar style={dark ? "light" : "dark"} />
      <AppShell>
        <Stack
          screenLayout={WebScreenFrame}
          screenOptions={{
            title: "Jambu",
            headerShown: false,
            cardStyle: {
              backgroundColor: colors.background,
              height: "100%",
              overflow: "hidden",
            },
            animation: "none",
            cardShadowEnabled: false,
            cardOverlayEnabled: false,
          }}
        >
          {["meal/[id]", "profile/[id]", "restaurant/[id]", "settings", "new"].map(
            (name) => (
              <Stack.Screen key={name} name={name} options={overlayScreenOptions(reducedMotion)} />
            ),
          )}
        </Stack>
      </AppShell>
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
            <MediaProvider>
              <Navigation />
            </MediaProvider>
          </JambuProvider>
        </JambuThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
