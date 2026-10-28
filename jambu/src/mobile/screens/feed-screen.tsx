import { useViewport } from "@/design/viewport";
import { useState } from "react";
import { FlatList } from "react-native";
import { useJambu } from "../data/provider";
import { Empty, T, Tabs } from "../components/primitives";
import { Page } from "../components/screen";
import { MealFeedCard } from "../components/meal-feed-card";

export default function FeedScreen() {
  const { state, repository, user } = useJambu();
  const { width } = useViewport();
  const [tab, setTab] = useState("Para você");
  const meals = state.meals.filter(
    (meal) =>
      meal.user.id !== user.id &&
      (tab === "Para você" || state.followedIds.includes(meal.user.id)),
  );
  return (
    <Page>
      <Tabs items={["Para você", "Seguindo"]} value={tab} onChange={setTab} />
      <FlatList
        data={meals}
        keyExtractor={(meal) => meal.id}
        initialNumToRender={4}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <T
            accessibilityRole="header"
            aria-level={width >= 760 ? 2 : 1}
            size={20}
            weight="600"
            style={{ paddingHorizontal: 16, paddingTop: 17, paddingBottom: 3 }}
          >
            O que estão provando
          </T>
        }
        renderItem={({ item }) => (
          <MealFeedCard
            meal={item}
            liked={state.likedIds.includes(item.id)}
            saved={state.savedMealIds.includes(item.id)}
            onLike={() => {
              void repository.toggleLike(item.id);
            }}
            onSave={() => {
              void repository.toggleMeal(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <Empty title="Seu feed começa com pessoas">
            Siga alguém para acompanhar os pratos que essa pessoa anda provando.
          </Empty>
        }
        ListFooterComponent={
          meals.length ? (
            <T size={12} muted style={{ textAlign: "center", padding: 28 }}>
              Você está em dia.
            </T>
          ) : undefined
        }
      />
    </Page>
  );
}
