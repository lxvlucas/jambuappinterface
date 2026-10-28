import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useJambuTheme, type ThemePreference } from "@/design/theme";
import { Icon } from "@/components/jambu/icon";
import { Button } from "@/components/jambu/ui";
import { useJambu } from "../data/provider";
import { Avatar, T } from "../components/primitives";
import { Page, PageBar, PageScroll } from "../components/screen";

export default function SettingsScreen() {
  const { colors, preference, setPreference } = useJambuTheme();
  const { user } = useJambu();
  const choices: { value: ThemePreference; label: string }[] = [
    { value: "system", label: "Acompanhar o sistema" },
    { value: "light", label: "Tema claro" },
    { value: "dark", label: "Tema escuro" },
  ];
  return (
    <Page>
      <PageBar title="Do seu jeito" />
      <PageScroll>
        <View style={{ padding: 20, gap: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <Avatar person={user} size={56} />
            <View>
              <T size={20} weight="600">
                {user.name}
              </T>
              <T size={13} muted>
                {user.username}
              </T>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <T size={18} weight="600">
              Aparência
            </T>
            {choices.map((choice) => (
              <Pressable
                key={choice.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: preference === choice.value }}
                onPress={() => setPreference(choice.value)}
                style={{
                  minHeight: 56,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <T size={15}>{choice.label}</T>
                {preference === choice.value ? (
                  <Icon name="check" size={19} />
                ) : null}
              </Pressable>
            ))}
          </View>
          <View style={{ gap: 8 }}>
            <T size={18} weight="600">
              Uma versão para experimentar
            </T>
            <T size={14} muted>
              As experiências são fictícias. Seus registros, favoritos e
              comentários desta versão duram até o app recarregar.
            </T>
          </View>
          <Button variant="secondary" onPress={() => router.push("/saved")}>
            Ver meus salvos
          </Button>
          <Button variant="ghost" onPress={() => router.push("/login")}>
            Ver tela de entrada
          </Button>
        </View>
      </PageScroll>
    </Page>
  );
}
