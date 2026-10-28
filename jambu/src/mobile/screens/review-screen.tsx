import { useReviewEditing } from "../features/review/review-editing";
import { RichInput } from "../features/review/rich-input";
import { ReviewToolbar } from "../features/review/review-toolbar";
import { useEffect, useReducer, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "@/components/jambu/ui";
import { normalizeSearch, validateReview, type Dish } from "@/domain/jambu";
import { useJambuTheme } from "@/design/theme";
import { useJambu } from "../data/provider";
import { Empty, SearchField, T } from "../components/primitives";
import { Page, PageBar } from "../components/screen";
import { KeyboardFrame } from "../components/keyboard-frame";
import { RestaurantRow } from "../components/restaurant-row";
import { createDish, draftReducer, emptyDraft } from "../features/review/draft";
import { DishEditor } from "../features/review/dish-editor";
import { DishTrail } from "../features/review/dish-trail";

export default function ReviewScreen() {
  const { colors, reducedMotion } = useJambuTheme();
  const {
    repository,
    state: { restaurants },
  } = useJambu();
  const insets = useSafeAreaInsets();
  const [draft, dispatch] = useReducer(draftReducer, emptyDraft);
  const reviewEditor = useReviewEditing(
    { text: draft.review, marks: draft.reviewMarks ?? [] },
    (document) =>
      dispatch({ type: "review", text: document.text, marks: document.marks }),
  );
  const [selectingPlace, setSelectingPlace] = useState(true);
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<Dish | null>(null);
  const [error, setError] = useState("");
  const [picking, setPicking] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [recoveredPhoto, setRecoveredPhoto] = useState<string | null>(null);
  const place = restaurants.find((value) => value.id === draft.restaurantId);
  const choices = restaurants.filter((value) =>
    normalizeSearch(value.name + " " + value.location).includes(
      normalizeSearch(query),
    ),
  );
  useEffect(() => {
    if (Platform.OS !== "android") return;
    let active = true;
    ImagePicker.getPendingResultAsync()
      .then((result) => {
        if (active && result && "assets" in result && result.assets?.[0])
          setRecoveredPhoto(result.assets[0].uri);
      })
      .catch(() => {
        if (active) setError("Selecione a foto novamente para continuar.");
      });
    return () => {
      active = false;
    };
  }, []);
  const pick = async () => {
    if (picking || publishing) return;
    Keyboard.dismiss();
    setPicking(true);
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0])
        setEditor(createDish(result.assets[0].uri));
    } catch {
      setError(
        "Não foi possível abrir a galeria. Tente selecionar a foto novamente.",
      );
    } finally {
      setPicking(false);
    }
  };
  const publish = async () => {
    if (publishing) return;
    const invalid = validateReview(draft);
    if (invalid) {
      setError(invalid);
      return;
    }
    setPublishing(true);
    setError("");
    try {
      await repository.publish(draft);
      router.replace("/diary");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível compartilhar. Seu rascunho continua aqui.",
      );
      setPublishing(false);
    }
  };
  const selectPlace = (id: string) => {
    dispatch({ type: "restaurant", id });
    setSelectingPlace(false);
    Keyboard.dismiss();
    if (recoveredPhoto) {
      setEditor(createDish(recoveredPhoto));
      setRecoveredPhoto(null);
    }
  };
  return (
    <Page>
      {selectingPlace ? (
        <>
          <PageBar title="Nova avaliação" />
          <View style={{ padding: 20, gap: 12 }}>
            <T accessibilityRole="header" size={25} weight="600">
              Qual foi o lugar?
            </T>
            <T size={15} muted>
              Encontre o restaurante onde você comeu.
            </T>
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Digite o nome do restaurante"
            />
            {recoveredPhoto ? (
              <T size={13}>
                Sua foto está pronta para continuar depois de escolher o lugar.
              </T>
            ) : null}
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {choices.map((value) => (
              <RestaurantRow
                key={value.id}
                place={value}
                onPress={() => selectPlace(value.id)}
              />
            ))}
            {!choices.length ? (
              <Empty title="Ainda não achamos esse lugar">
                Tente outro nome entre os restaurantes dos exemplos.
              </Empty>
            ) : null}
          </ScrollView>
        </>
      ) : (
        <Animated.View
          entering={FadeIn.duration(reducedMotion ? 100 : 180)}
          style={{ flex: 1 }}
        >
          <PageBar
            title="Sua experiência"
            onBack={() => setSelectingPlace(true)}
            action={
              <Pressable
                accessibilityRole="button"
                onPress={() => setSelectingPlace(true)}
                style={({ pressed }) => ({
                  minHeight: 48,
                  paddingHorizontal: 14,
                  justifyContent: "center",
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <T size={13} weight="600">
                  Trocar lugar
                </T>
              </Pressable>
            }
          />
          <KeyboardFrame>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingTop: 12,
                  paddingBottom: 14,
                  gap: 5,
                }}
              >
                <T size={20} weight="600">
                  {place?.name}
                </T>
                <T size={13} muted>
                  Foto, nome e nota para cada prato.
                </T>
              </View>
              <View style={{ flexShrink: 0 }}>
                <DishTrail
                  dishes={draft.dishes}
                  choiceId={draft.choiceDishId}
                  disabled={picking || publishing}
                  onAdd={() => {
                    void pick();
                  }}
                  onEdit={setEditor}
                  onMention={reviewEditor.cite}
                />
              </View>
              <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 6 }}>
                <T size={14} weight="600">
                  O que você achou?
                </T>
                <RichInput editor={reviewEditor} />
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingTop: 8,
                  paddingBottom: Math.max(insets.bottom, 20),
                  gap: 12,
                }}
              >
                {error ? (
                  <T
                    size={14}
                    accessibilityLiveRegion="polite"
                    style={{ color: colors.error }}
                  >
                    {error}
                  </T>
                ) : null}
                <Button
                  disabled={publishing || picking}
                  onPress={() => {
                    void publish();
                  }}
                >
                  {publishing ? "Compartilhando…" : "Compartilhar"}
                </Button>
              </View>
            </ScrollView>
            <ReviewToolbar editor={reviewEditor} dishes={draft.dishes} />
          </KeyboardFrame>
        </Animated.View>
      )}
      {editor ? (
        <DishEditor
          key={editor.id}
          initial={editor}
          choiceId={draft.choiceDishId}
          choiceName={
            draft.dishes.find((dish) => dish.id === draft.choiceDishId)?.name
          }
          onCancel={() => setEditor(null)}
          onConfirm={(dish, choice) => {
            dispatch({ type: "save-dish", dish, choice });
            setEditor(null);
          }}
          onRemove={
            draft.dishes.some((value) => value.id === editor.id)
              ? () => {
                  dispatch({ type: "remove", id: editor.id });
                  setEditor(null);
                }
              : undefined
          }
        />
      ) : null}
    </Page>
  );
}
