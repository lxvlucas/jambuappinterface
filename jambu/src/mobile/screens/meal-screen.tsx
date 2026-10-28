import { useRef, useState, type ComponentRef } from "react";
import {
  Pressable,
  ScrollView,
  Share,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useJambuTheme } from "@/design/theme";
import { useJambu } from "../data/provider";
import { Avatar, Empty, IconButton, T } from "../components/primitives";
import { Page, PageBar } from "../components/screen";
import { LikeButton } from "../components/like-button";
import { DishCarousel } from "../components/dish-carousel";
import { ReviewText } from "../components/review-text";
import { Identity } from "../components/identity";
import { KeyboardFrame } from "../components/keyboard-frame";
import {
  CommentComposer,
  CommentList,
  type CommentComposerHandle,
} from "../components/comments";
import { useMedia } from "../features/media/media-provider";
import { openProfile, openRestaurant } from "../navigation";
export default function MealScreen() {
  const { id, dish, comments } = useLocalSearchParams<{
    id: string;
    dish?: string;
    comments?: string;
  }>();
  const { state, repository } = useJambu();
  const { colors } = useJambuTheme();
  const media = useMedia();
  const [error, setError] = useState("");
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const composer = useRef<CommentComposerHandle>(null);
  const jumped = useRef(false);
  const meal = state.meals.find((value) => value.id === id);
  if (!meal)
    return (
      <Page>
        <PageBar title="Avaliação" />
        <Empty title="Avaliação não encontrada">
          Os registros de demonstração são reiniciados ao recarregar.
        </Empty>
      </Page>
    );
  const share = async () => {
    try {
      await Share.share({
        message: `${meal.restaurant.name} — ${meal.dishes.map((value) => value.name).join(", ")}. Uma experiência de ${meal.user.name} no Jambu.`,
      });
    } catch {
      setError("Não foi possível compartilhar agora.");
    }
  };
  return (
    <Page>
      <PageBar
        title="Avaliação"
        action={
          <IconButton
            name="share"
            label="Compartilhar avaliação"
            onPress={() => {
              void share();
            }}
          />
        }
      />
      <KeyboardFrame>
        <ScrollView
          ref={scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => {
            if (comments === "1" && !jumped.current) {
              jumped.current = true;
              scroll.current?.scrollToEnd({ animated: false });
            }
          }}
        >
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Ver perfil de ${meal.user.name}`}
            onPress={() => openProfile(meal.user.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 20,
              minHeight: 62,
            }}
          >
            <Avatar person={meal.user} size={36} />
            <Identity person={meal.user} time={meal.timeAgo} />
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Ver lugar ${meal.restaurant.name}`}
            onPress={() => openRestaurant(meal.restaurant.id)}
            style={{
              paddingHorizontal: 20,
              minHeight: 48,
              justifyContent: "center",
              paddingBottom: 8,
            }}
          >
            <T size={18} weight="600">
              {meal.restaurant.name}
            </T>
          </Pressable>
          <DishCarousel
            key={meal.id}
            meal={meal}
            initialIndex={Number(dish) || 0}
          />
          <View style={{ paddingHorizontal: 20, paddingTop: 14, gap: 16 }}>
            <ReviewText
              text={meal.review || "Uma experiência para lembrar."}
              marks={meal.reviewMarks}
              dishes={meal.dishes}
              onDish={(index) => media.open(meal.id, index)}
            />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <LikeButton
                liked={state.likedIds.includes(meal.id)}
                count={
                  meal.stats.likesCount +
                  Number(state.likedIds.includes(meal.id))
                }
                label={
                  state.likedIds.includes(meal.id)
                    ? "Descurtir avaliação"
                    : "Curtir avaliação"
                }
                onPress={() => {
                  void repository.toggleLike(meal.id);
                }}
              />
              <T size={13} muted style={{ flex: 1 }}>
                {meal.comments.length} comentários
              </T>
              <IconButton
                name="bookmark"
                active={state.savedMealIds.includes(meal.id)}
                label={
                  state.savedMealIds.includes(meal.id)
                    ? "Remover dos salvos"
                    : "Salvar avaliação"
                }
                onPress={() => {
                  void repository.toggleMeal(meal.id);
                }}
              />
            </View>
            {error ? (
              <T size={13} style={{ color: colors.error }}>
                {error}
              </T>
            ) : null}
            <T size={18} weight="600">
              Na conversa
            </T>
            <CommentList
              meal={meal}
              onReply={(comment) => composer.current?.reply(comment)}
            />
          </View>
        </ScrollView>
        <CommentComposer
          ref={composer}
          meal={meal}
          onSent={() => scroll.current?.scrollToEnd({ animated: false })}
        />
      </KeyboardFrame>
    </Page>
  );
}
