import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Link, usePathname } from "expo-router";
import { SvgXml } from "react-native-svg";
import { brandSvg } from "@/design/brand";
import { ContentWidth } from "@/design/content-layout";
import { useViewport } from "@/design/viewport";
import { useJambuTheme } from "@/design/theme";
import { Icon, type IconName } from "@/components/jambu/icon";
import { useJambu } from "../data/provider";
import { Avatar, IconButton, T } from "./primitives";
import { AppShell as PhoneShell } from "./native-shell";

const links = [
  { href: "/", label: "Início", icon: "home" },
  { href: "/explore", label: "Explorar", icon: "search" },
  { href: "/saved", label: "Salvos", icon: "bookmark" },
  { href: "/diary", label: "Meu diário", icon: "book" },
] as const;

function DiscoveryRail() {
  const { state, repository, user } = useJambu();
  const { colors } = useJambuTheme();
  const people = state.people
    .filter((person) => person.id !== user.id)
    .slice(0, 3);
  const places = state.restaurants
    .filter((place) => state.savedRestaurantIds.includes(place.id))
    .slice(0, 3);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 32, paddingTop: 28, paddingBottom: 28 }}
    >
      <Link href="/diary" asChild>
        <Pressable
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            minHeight: 48,
          }}
        >
          <Avatar person={user} size={42} />
          <View style={{ flex: 1 }}>
            <T size={16} weight="600">
              {user.name}
            </T>
            <T size={14} muted>
              {user.username}
            </T>
          </View>
          <Icon name="book" size={19} color={colors.muted} />
        </Pressable>
      </Link>
      <View style={{ gap: 14 }}>
        <T size={16} weight="600">
          Pessoas para acompanhar
        </T>
        {people.map((person) => (
          <View
            key={person.id}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <Link
              href={{ pathname: "/profile/[id]", params: { id: person.id } }}
              asChild
            >
              <Pressable
                style={{
                  flexDirection: "row",
                  gap: 10,
                  flex: 1,
                  alignItems: "center",
                  minHeight: 48,
                }}
              >
                <Avatar person={person} size={34} />
                <View style={{ flex: 1 }}>
                  <T size={16} weight="600" numberOfLines={1}>
                    {person.name}
                  </T>
                  <T size={14} muted numberOfLines={1}>
                    {person.username}
                  </T>
                </View>
              </Pressable>
            </Link>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${state.followedIds.includes(person.id) ? "Deixar de seguir" : "Seguir"} ${person.name}`}
              onPress={() => {
                void repository.toggleFollow(person.id);
              }}
              style={{ minHeight: 44, justifyContent: "center" }}
            >
              <T size={12} weight="600">
                {state.followedIds.includes(person.id) ? "Seguindo" : "Seguir"}
              </T>
            </Pressable>
          </View>
        ))}
      </View>
      {places.length ? (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <T size={16} weight="600" style={{ flex: 1 }}>
              Para visitar depois
            </T>
            <Link href="/saved" accessibilityLabel="Ver todos os salvos">
              <T size={12} muted>
                Ver todos
              </T>
            </Link>
          </View>
          {places.map((place) => (
            <Link
              key={place.id}
              href={{ pathname: "/restaurant/[id]", params: { id: place.id } }}
              asChild
            >
              <Pressable style={{ paddingVertical: 9, gap: 3 }}>
                <T size={14} weight="600">
                  {place.name}
                </T>
                <T size={12} muted>
                  {place.location}
                </T>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
      <T size={12} muted>
        Prato por prato.
      </T>
    </ScrollView>
  );
}

type SceneFrameProps = { children: ReactNode; route: { name: string } };

function WebScene({ children, route }: SceneFrameProps) {
  const { width, height } = useViewport();
  const path = route.name === "index" ? "/" : `/${route.name}`;
  const title = links.find((link) => link.href === path)?.label;
  if (width < 760) return (
    <View style={{ height, overflow: "hidden" }}>
      <PhoneShell pathname={path}>{children}</PhoneShell>
    </View>
  );
  return (
    <View style={{ height, minHeight: 0, overflow: "hidden" }}>
      {title ? (
        <View style={{ minHeight: 64, paddingHorizontal: 20, justifyContent: "center" }}>
          <T accessibilityRole="header" size={20} weight="600">{title}</T>
        </View>
      ) : null}
      <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
    </View>
  );
}

// screenLayout is a render callback; hooks must live in the returned component.
export function WebScreenFrame(props: SceneFrameProps) {
  return <WebScene {...props} />;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { width } = useViewport();
  const path = usePathname();
  const { colors, dark, setPreference } = useJambuTheme();
  const { user } = useJambu();
  if (width < 760)
    return (
      <ContentWidth.Provider value={width}>
        <View style={{ height: "100dvh" as unknown as number }}>
          {children}
        </View>
      </ContentWidth.Provider>
    );
  if (path === "/login")
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {children}
      </View>
    );
  const labels = width >= 1000;
  const rail = width >= 1200;
  // Wide: 216 + 600 + 260 + 2×32 = 1140px. Tablet: 88 + 600 + 24 = 712px.
  return (
    <View
      style={{
        height: "100dvh" as unknown as number,
        backgroundColor: colors.background,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          minHeight: 0,
          width: labels ? (rail ? 1140 : 848) : 712,
          maxWidth: "100%",
          flexDirection: "row",
          gap: labels ? 32 : 24,
        }}
      >
        <View
          accessibilityRole="navigation"
          style={{
            width: labels ? 216 : 88,
            paddingVertical: 20,
            paddingHorizontal: labels ? 4 : 12,
            gap: 22,
          }}
        >
          <Link href="/" asChild>
            <Pressable
              accessibilityLabel="Jambu, início"
              style={{
                minHeight: 48,
                flexDirection: "row",
                alignItems: "center",
                gap: 9,
                paddingLeft: labels ? 12 : 10,
              }}
            >
              <SvgXml xml={brandSvg} width={29} height={29} />
              {labels ? (
                <T size={29} weight="600" style={{ letterSpacing: -1 }}>
                  jambu
                </T>
              ) : null}
            </Pressable>
          </Link>
          <View style={{ gap: 8 }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} asChild>
                <Pressable
                  accessibilityLabel={link.label}
                  accessibilityState={{ selected: path === link.href }}
                  style={{
                    minHeight: 52,
                    paddingHorizontal: labels ? 14 : 16,
                    flexDirection: "row",
                    gap: 15,
                    alignItems: "center",
                    borderRadius: 12,
                    backgroundColor:
                      path === link.href ? colors.surface : "transparent",
                  }}
                >
                  <Icon name={link.icon as IconName} size={24} />
                  {labels ? (
                    <T size={18} weight={path === link.href ? "600" : "400"}>
                      {link.label}
                    </T>
                  ) : null}
                </Pressable>
              </Link>
            ))}
            <Link href="/new" asChild>
              <Pressable
                accessibilityLabel="Avaliar"
                style={{
                  marginTop: 10,
                  minHeight: 50,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  backgroundColor: colors.action,
                }}
              >
                <Icon name="plus" color={colors.onAction} size={23} />
                {labels ? (
                  <T size={16} weight="600" style={{ color: colors.onAction }}>
                    Avaliar um prato
                  </T>
                ) : null}
              </Pressable>
            </Link>
          </View>
          <View style={{ flex: 1 }} />
          <View
            style={{
              flexDirection: labels ? "row" : "column",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Link href="/settings" asChild>
              <Pressable
                accessibilityLabel="Abrir ajustes"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 48,
                  flexShrink: 1,
                }}
              >
                <Avatar person={user} size={32} />
                {labels ? (
                  <T size={14} numberOfLines={1}>
                    {user.username}
                  </T>
                ) : null}
              </Pressable>
            </Link>
            <IconButton
              name={dark ? "sun" : "moon"}
              label={dark ? "Usar tema claro" : "Usar tema escuro"}
              onPress={() => setPreference(dark ? "light" : "dark")}
            />
          </View>
        </View>
        <ContentWidth.Provider value={598}>
          <View
            style={{
              width: 600,
              minHeight: 0,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: colors.line,
            }}
          >
            <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
          </View>
        </ContentWidth.Provider>
        {rail ? (
          <View accessibilityRole="complementary" style={{ width: 260 }}>
            <DiscoveryRail />
          </View>
        ) : null}
      </View>
    </View>
  );
}
