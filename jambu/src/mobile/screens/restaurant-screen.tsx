import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/jambu/ui";
import { useJambu } from "../data/provider";
import { Empty, T } from "../components/primitives";
import { Page, PageBar, PageScroll } from "../components/screen";
import { MealFeedCard } from "../components/meal-feed-card";

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, repository } = useJambu();
  const { restaurants } = state;
  const place = restaurants.find((value) => value.id === id);
  if (!place)
    return (
      <Page>
        <PageBar title="Lugar" />
        <Empty title="Lugar não encontrado">
          Volte à busca para encontrar outro restaurante.
        </Empty>
      </Page>
    );
  return (
    <Page>
      <PageBar title="Lugar" />
      <PageScroll>
        <View style={{ padding: 20, gap: 10 }}>
          <T accessibilityRole="header" size={25} weight="600">
            {place.name}
          </T>
          <T size={14} muted>
            {place.category}
          </T>
          <T size={13} muted>
            {place.location}
          </T>
          <Button
            variant={
              state.savedRestaurantIds.includes(place.id)
                ? "secondary"
                : "primary"
            }
            icon="bookmark"
            onPress={() => {
              void repository.toggleRestaurant(place.id);
            }}
          >
            {state.savedRestaurantIds.includes(place.id)
              ? "Lugar salvo"
              : "Salvar para visitar"}
          </Button>
          <T size={18} weight="600" style={{ marginTop: 16 }}>
            O que provaram por aqui
          </T>
        </View>
        {state.meals
          .filter((meal) => meal.restaurant.id === place.id)
          .map((meal) => (
            <MealFeedCard
              key={meal.id}
              meal={meal}
              liked={state.likedIds.includes(meal.id)}
              saved={state.savedMealIds.includes(meal.id)}
              onLike={() => {
                void repository.toggleLike(meal.id);
              }}
              onSave={() => {
                void repository.toggleMeal(meal.id);
              }}
            />
          ))}
      </PageScroll>
    </Page>
  );
}
