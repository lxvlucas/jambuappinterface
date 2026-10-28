import { useViewport } from "@/design/viewport";
import { router } from "expo-router";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { Brand, Button, Field, Photo, T } from "@/components/jambu/ui";
import { fixtureMeals } from "@/data/demo";
import { useJambuTheme } from "@/design/theme";

export default function LoginScreen() {
  const { width } = useViewport();
  const wide = width >= 900;
  const { colors } = useJambuTheme();
  const [name, setName] = useState("spikespiegel");
  const [password, setPassword] = useState("pratoporprato");
  const [error, setError] = useState("");
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: wide ? "row" : "column",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: wide ? 70 : 28,
          paddingTop: wide ? 54 : 40,
          paddingBottom: 40,
          justifyContent: "center",
          maxWidth: wide ? 600 : 520,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <View style={{ marginBottom: wide ? 70 : 42 }}>
          <Brand />
        </View>
        <T
          accessibilityRole="header"
          size={wide ? 44 : 36}
          weight="600"
          style={{
            lineHeight: wide ? 49 : 41,
            letterSpacing: -1.1,
            marginBottom: 14,
          }}
        >
          Cada prato,{"\n"}uma opinião.
        </T>
        <T muted style={{ maxWidth: 360, marginBottom: 36 }}>
          Guarde o que você provou. Compartilhe o que ficou.
        </T>
        <View style={{ gap: 18 }}>
          <Field
            label="E-mail ou nome de usuário"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            autoComplete="username"
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
            error={error}
          />
          <Button
            onPress={() => {
              if (!name.trim() || password.length < 12) {
                setError(
                  "Preencha o usuário e uma senha de pelo menos 12 caracteres.",
                );
                return;
              }
              router.replace("/");
            }}
          >
            Entrar no protótipo
          </Button>
        </View>
        <T size={12} muted style={{ marginTop: 22 }}>
          Demonstração com dados fictícios. Os campos não são enviados a um
          servidor.
        </T>
      </View>
      {wide ? (
        <View
          style={{
            flex: 1,
            minHeight: 760,
            backgroundColor: colors.surface,
            padding: 44,
            justifyContent: "center",
            gap: 20,
          }}
        >
          <View style={{ flexDirection: "row", gap: 18, alignItems: "center" }}>
            <Photo
              uri={fixtureMeals[1].dishes[0].imageUrl}
              label={fixtureMeals[1].dishes[0].name}
              style={{ flex: 1, aspectRatio: 3 / 4, borderRadius: 16 }}
            />
            <View style={{ flex: 1, gap: 18, paddingTop: 60 }}>
              <Photo
                uri={fixtureMeals[2].dishes[1].imageUrl}
                label={fixtureMeals[2].dishes[1].name}
                style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 16 }}
              />
              <T size={20} weight="600">
                O gosto de lembrar.
              </T>
            </View>
          </View>
          <T size={13} muted>
            Dos almoços de sempre às descobertas que viram favoritas.
          </T>
        </View>
      ) : null}
    </ScrollView>
  );
}
