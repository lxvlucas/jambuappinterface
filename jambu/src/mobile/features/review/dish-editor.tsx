import { useState } from "react";
import { Modal, Platform, ScrollView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { Dish } from "@/domain/jambu";
import { useViewport } from "@/design/viewport";
import { useJambuTheme } from "@/design/theme";
import { Button } from "@/components/jambu/ui";
import {
  ChoiceSeal,
  Field,
  IconButton,
  Photo,
  T,
} from "../../components/primitives";
import { PageBar } from "../../components/screen";
import { KeyboardFrame } from "../../components/keyboard-frame";
import { ChoiceToggle } from "./choice-toggle";
import { StarSlider } from "./star-slider";

export function DishEditor({
  initial,
  choiceId,
  choiceName,
  onCancel,
  onConfirm,
  onRemove,
}: {
  initial: Dish;
  choiceId: string | null;
  choiceName?: string;
  onCancel: () => void;
  onConfirm: (dish: Dish, choice: boolean) => void;
  onRemove?: () => void;
}) {
  const { colors } = useJambuTheme();
  const { width } = useViewport();
  const desktop = Platform.OS === "web" && width >= 760;
  const [dish, setDish] = useState(initial);
  const [chosen, setChosen] = useState(choiceId === initial.id);
  const replacing = choiceId !== null && choiceId !== initial.id;
  return (
    <Modal
      animationType="fade"
      transparent={desktop}
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel}
    >
      <SafeAreaProvider>
        <GestureHandlerRootView
          style={{
            flex: 1,
            backgroundColor: desktop ? colors.scrim : colors.background,
            padding: desktop ? 32 : 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SafeAreaView
            edges={desktop ? [] : ["top", "bottom"]}
            role={desktop ? "dialog" : undefined}
            aria-modal={desktop || undefined}
            accessibilityLabel={onRemove ? "Editar prato" : "Adicionar prato"}
            style={{
              flex: 1,
              width: "100%",
              maxWidth: desktop ? 520 : undefined,
              maxHeight: desktop ? 760 : undefined,
              borderRadius: desktop ? 16 : 0,
              overflow: "hidden",
              backgroundColor: colors.background,
            }}
          >
            <View
              pointerEvents="none"
              style={{ position: "absolute", inset: 0, opacity: 0.12 }}
            >
              <Photo
                uri={dish.imageUrl}
                label={dish.name || "Prato selecionado"}
                style={{ flex: 1 }}
              />
            </View>
            <View>
              <PageBar
                title={onRemove ? "Editar prato" : "Seu prato"}
                onBack={onCancel}
                action={
                  <IconButton
                    name="close"
                    label="Cancelar prato"
                    onPress={onCancel}
                  />
                }
              />
            </View>
            <KeyboardFrame>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: desktop ? "center" : "flex-end",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 16,
                    padding: 20,
                    gap: 20,
                  }}
                >
                  <Field
                    label="Que prato é esse?"
                    value={dish.name}
                    onChangeText={(name) =>
                      setDish((value) => ({ ...value, name }))
                    }
                    placeholder="Nome do prato"
                    maxLength={150}
                    multiline
                    style={{ minHeight: 60, fontSize: 18, lineHeight: 26 }}
                  />
                  <StarSlider
                    value={dish.rating}
                    onChange={(rating) =>
                      setDish((value) => ({ ...value, rating }))
                    }
                  />
                  <View style={{ gap: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <ChoiceSeal compact />
                      <ChoiceToggle value={chosen} onChange={setChosen} />
                    </View>
                    <T size={13} muted accessibilityLiveRegion="polite">
                      {replacing
                        ? chosen
                          ? `Ao salvar, este prato substitui “${choiceName}” como sua escolha.`
                          : `Sua escolha já é “${choiceName}”. Marque este prato se quiser trocar.`
                        : "A escolha é sua, independentemente da nota. Um prato por publicação."}
                    </T>
                  </View>
                  <Button
                    disabled={!dish.name.trim() || dish.rating < 0.5}
                    onPress={() =>
                      onConfirm({ ...dish, name: dish.name.trim() }, chosen)
                    }
                  >
                    {chosen && replacing
                      ? "Salvar prato e trocar escolha"
                      : onRemove
                        ? "Salvar prato"
                        : "Adicionar à avaliação"}
                  </Button>
                  {onRemove ? (
                    <Button variant="ghost" onPress={onRemove}>
                      Remover este prato
                    </Button>
                  ) : null}
                </View>
              </ScrollView>
            </KeyboardFrame>
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Modal>
  );
}
