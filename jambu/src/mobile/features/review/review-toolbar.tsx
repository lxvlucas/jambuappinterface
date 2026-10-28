import { useEffect, useRef, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, View } from "react-native";
import type { Dish } from "@/domain/jambu";
import { useJambuTheme } from "@/design/theme";
import { Button } from "@/components/jambu/ui";
import { Icon } from "@/components/jambu/icon";
import { Field, IconButton, Photo, T } from "../../components/primitives";
import { KeyboardFrame } from "../../components/keyboard-frame";
import type { ReviewEditing } from "./review-editing";
export function ReviewToolbar({
  editor,
  dishes,
}: {
  editor: ReviewEditing;
  dishes: Dish[];
}) {
  const { colors } = useJambuTheme();
  const { focusEditor } = editor;
  const [picker, setPicker] = useState<"dish" | "link" | null>(null);
  const [url, setUrl] = useState(""),
    [label, setLabel] = useState(""),
    [error, setError] = useState("");
  const wasOpen = useRef(false);
  useEffect(() => {
    if (picker) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      // Android must regain its window after the platform modal fade finishes.
      const timer = setTimeout(
        () => focusEditor(),
        Platform.OS === "android" ? 320 : 180,
      );
      return () => clearTimeout(timer);
    }
  }, [picker, focusEditor]);
  const close = () => setPicker(null);
  return (
    <>
      <View
        accessibilityRole="toolbar"
        style={{
          minHeight: 52,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderColor: colors.line,
          paddingHorizontal: 12,
        }}
      >
        {(["bold", "italic"] as const).map((type) => (
          <Pressable
            key={type}
            accessibilityRole="button"
            accessibilityLabel={type === "bold" ? "Negrito" : "Itálico"}
            accessibilityState={{ selected: editor.active.includes(type) }}
            onPress={() => editor.toggle(type)}
            style={{
              width: 52,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: editor.active.includes(type)
                ? colors.line
                : "transparent",
            }}
          >
            <Icon
              name={type}
              size={22}
              color={editor.active.includes(type) ? colors.action : colors.ink}
            />
          </Pressable>
        ))}
        <IconButton
          name="link"
          label="Inserir link externo"
          onPress={() => {
            setLabel(
              editor.document.text.slice(
                editor.selection.start,
                editor.selection.end,
              ),
            );
            setUrl("");
            setError("");
            setPicker("link");
          }}
        />
        <IconButton
          name="quote"
          label="Citar um prato"
          onPress={() => setPicker("dish")}
        />
      </View>
      {picker ? (
        <Modal transparent animationType="fade" onRequestClose={close}>
          <KeyboardFrame>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.scrim,
                justifyContent: Platform.OS === "web" ? "center" : "flex-end",
                alignItems: "center",
                padding: 20,
              }}
            >
              <View
                role="dialog"
                aria-modal
                accessibilityLabel={
                  picker === "dish"
                    ? "Escolher prato para citar"
                    : "Adicionar link externo"
                }
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 16,
                  width: "100%",
                  maxWidth: 480,
                  maxHeight: "100%",
                  padding: 20,
                  gap: 14,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <T size={20} weight="600" style={{ flex: 1 }}>
                    {picker === "dish"
                      ? "Qual prato você quer citar?"
                      : "Adicionar um link"}
                  </T>
                  <IconButton
                    name="close"
                    label="Fechar seleção"
                    onPress={close}
                  />
                </View>
                {picker === "dish" ? (
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ gap: 8 }}
                  >
                    {dishes.map((dish) => (
                      <Pressable
                        key={dish.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Citar ${dish.name}`}
                        onPress={() => {
                          editor.cite(dish);
                          setPicker(null);
                        }}
                        style={{
                          flexDirection: "row",
                          gap: 12,
                          alignItems: "center",
                          minHeight: 64,
                        }}
                      >
                        <Photo
                          uri={dish.imageUrl}
                          label={dish.name}
                          style={{ width: 44, height: 54, borderRadius: 8 }}
                        />
                        <T size={16} style={{ flex: 1 }}>
                          {dish.name}
                        </T>
                        <Icon name="plus" size={20} />
                      </Pressable>
                    ))}
                    {!dishes.length ? (
                      <T muted>
                        Adicione um prato à avaliação para citá-lo aqui.
                      </T>
                    ) : null}
                  </ScrollView>
                ) : (
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ gap: 14 }}
                  >
                    <Field
                      label="Texto do link"
                      value={label}
                      onChangeText={setLabel}
                      placeholder="Como ele deve aparecer"
                    />
                    <Field
                      label="Endereço do link"
                      value={url}
                      onChangeText={setUrl}
                      placeholder="https://"
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                    {error ? (
                      <T size={13} style={{ color: colors.error }}>
                        {error}
                      </T>
                    ) : null}
                    <Button
                      onPress={() => {
                        if (editor.link(url, label)) setPicker(null);
                        else
                          setError(
                            "Use um endereço completo começando com https:// ou http://.",
                          );
                      }}
                    >
                      Inserir link
                    </Button>
                  </ScrollView>
                )}
              </View>
            </View>
          </KeyboardFrame>
        </Modal>
      ) : null}
    </>
  );
}
