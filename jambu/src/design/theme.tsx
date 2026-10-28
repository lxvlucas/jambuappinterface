import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AccessibilityInfo, Platform } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const palette = {
  light: {
    background: "#FFFFFF",
    surface: "#F2F5F2",
    raised: "#FFFFFF",
    ink: "#072C0D",
    muted: "#636863",
    line: "#DCE2DC",
    outline: "#636863",
    action: "#072C0D",
    onAction: "#FFFFFF",
    yellow: "#FFCE0F",
    emptyStar: "#DCE2DC",
    positive: "#21762F",
    positiveBg: "#E8F7E9",
    error: "#B42318",
    ratingLow: "#B42318",
    ratingMiddle: "#8A6507",
    scrim: "rgba(7,17,7,0.52)",
  },
  dark: {
    background: "#101110",
    surface: "#1C1F1C",
    raised: "#242624",
    ink: "#F7F9F6",
    muted: "#ABB3AB",
    line: "#303630",
    outline: "#869086",
    action: "#3BE058",
    onAction: "#072C0D",
    yellow: "#FFCE0F",
    emptyStar: "#636863",
    positive: "#B3FDBA",
    positiveBg: "#072C0D",
    error: "#FFB4AB",
    ratingLow: "#FFB4AB",
    ratingMiddle: "#E6C16A",
    scrim: "rgba(0,0,0,0.65)",
  },
};
export type ThemeColors = typeof palette.light;
export type ThemePreference = "system" | "light" | "dark";
const serverPreference = (): ThemePreference => "system";
const browserPreference = (): ThemePreference => {
  try {
    const value = globalThis.localStorage?.getItem("jambu-prototype-theme");
    return value === "dark" || value === "light" ? value : "system";
  } catch {
    return "system";
  }
};
const subscribeTheme = (listener: () => void) => {
  if (Platform.OS !== "web" || typeof window === "undefined") return () => {};
  window.addEventListener("storage", listener);
  window.addEventListener("jambu-theme", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("jambu-theme", listener);
  };
};
const ThemeContext = createContext<{
  colors: ThemeColors;
  dark: boolean;
  preference: ThemePreference;
  setPreference: (theme: ThemePreference) => void;
  reducedMotion: boolean;
} | null>(null);
export function JambuThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [nativePreference, setPreferenceState] =
    useState<ThemePreference>("system");
  const storedPreference = useSyncExternalStore(
    subscribeTheme,
    browserPreference,
    serverPreference,
  );
  const preference =
    Platform.OS === "web" ? storedPreference : nativePreference;
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReducedMotion,
    );
    return () => listener.remove();
  }, []);
  const setPreference = (value: ThemePreference) => {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem("jambu-prototype-theme", value);
        window.dispatchEvent(new Event("jambu-theme"));
      } catch {}
    } else {
      setPreferenceState(value);
    }
  };
  const dark =
    preference === "system" ? system === "dark" : preference === "dark";
  return (
    <ThemeContext.Provider
      value={{
        colors: palette[dark ? "dark" : "light"],
        dark,
        preference,
        setPreference,
        reducedMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export function useJambuTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("JambuThemeProvider ausente");
  return theme;
}

/** Photo viewing uses a dark canvas without changing the user's chosen theme. */
export function DarkSurface({ children }: { children: ReactNode }) {
  const theme = useJambuTheme();
  return (
    <ThemeContext.Provider
      value={{ ...theme, colors: palette.dark, dark: true }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
