import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { brandSvg } from "@/design/brand";
import { useJambuTheme } from "@/design/theme";
import { Icon, type IconName } from "@/components/jambu/icon";
import { useJambu } from "../data/provider";
import { Avatar, IconButton, T } from "./primitives";

const tabs = [
  { path: "/", label: "Início", icon: "home" },
  { path: "/explore", label: "Explorar", icon: "search" },
  { path: "/new", label: "Avaliar", icon: "plus" },
  { path: "/saved", label: "Salvos", icon: "bookmark" },
  { path: "/diary", label: "Diário", icon: "book" },
] as const;
export function AppShell({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname?: string;
}) {
  const activePath = usePathname();
  // Native stack scenes keep their own chrome even when another route is active.
  const path = pathname ?? activePath;
  const { user } = useJambu();
  const { colors, dark, setPreference } = useJambuTheme();
  const insets = useSafeAreaInsets();
  const primary = tabs.some((tab) => tab.path === path) && path !== "/new";
  const bottom =
    !path.startsWith("/meal/") && path !== "/new" && path !== "/login";
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: colors.background,
      }}
    >
      {primary ? (
        <View
          style={{
            minHeight: 48,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Jambu, início"
            onPress={() => router.replace("/")}
            style={{
              minHeight: 48,
              flexDirection: "row",
              gap: 7,
              alignItems: "center",
            }}
          >
            <SvgXml xml={brandSvg} width={25} height={25} />
            <T size={26} weight="600" style={{ letterSpacing: -0.8 }}>
              jambu
            </T>
          </Pressable>
          <View style={{ flexDirection: "row" }}>
            <IconButton
              name={dark ? "sun" : "moon"}
              label={dark ? "Usar tema claro" : "Usar tema escuro"}
              onPress={() => setPreference(dark ? "light" : "dark")}
            />
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Abrir ajustes"
              onPress={() => router.push("/settings")}
              style={{
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar person={user} size={28} />
            </Pressable>
          </View>
        </View>
      ) : null}
      <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
      {bottom ? (
        <View
          style={{
            paddingBottom: Math.max(insets.bottom, 6),
            borderTopWidth: 1,
            borderTopColor: colors.line,
            flexDirection: "row",
          }}
        >
          {tabs.map((tab) => {
            const active = path === tab.path;
            return (
              <Pressable
                key={tab.path}
                accessibilityRole="link"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: active }}
                onPress={() =>
                  tab.path === "/new"
                    ? router.push("/new")
                    : router.replace(tab.path)
                }
                style={({ pressed }) => ({
                  flex: 1,
                  minHeight: 58,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <View
                  style={{
                    width: 48,
                    height: 32,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      tab.path === "/new" ? colors.action : "transparent",
                  }}
                >
                  <Icon
                    name={tab.icon as IconName}
                    color={
                      tab.path === "/new"
                        ? colors.onAction
                        : active
                          ? colors.ink
                          : colors.muted
                    }
                    size={23}
                  />
                </View>
                <T size={11} weight={active ? "600" : "400"} muted={!active}>
                  {tab.label}
                </T>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={{ height: insets.bottom }} />
      )}
    </View>
  );
}
