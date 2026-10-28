import { useState } from "react";
import { Pressable, View } from "react-native";
import { useJambu } from "../data/provider";
import { Empty, IconButton, Photo, T, Tabs } from "../components/primitives";
import { Page, PageBar, PageScroll } from "../components/screen";
import { RestaurantRow } from "../components/restaurant-row";
import { MealFeedCard } from "../components/meal-feed-card";
import { openRestaurant } from "../navigation";

export default function SavedScreen() {
  const { state, repository, user } = useJambu();
  const { collections, restaurants } = state;
  const [tab, setTab] = useState("Listas");
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const selected = collections.find(
    (collection) => collection.id === collectionId,
  );
  const savedLists = collections.filter(
    (collection) =>
      collection.owner.id !== user.id &&
      state.savedCollectionIds.includes(collection.id),
  );
  const places = restaurants.filter((place) =>
    state.savedRestaurantIds.includes(place.id),
  );
  const reviews = state.meals.filter((meal) =>
    state.savedMealIds.includes(meal.id),
  );
  const cards = (ids: string[]) =>
    state.meals
      .filter((meal) => ids.includes(meal.id))
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
      ));
  if (selected)
    return (
      <Page>
        <PageBar title="Lista salva" onBack={() => setCollectionId(null)} />
        <PageScroll>
          <View style={{ padding: 20, gap: 8 }}>
            <T size={24} weight="600">
              {selected.title}
            </T>
            <T size={13} muted>
              Uma lista de {selected.owner.name}
            </T>
            <T size={15}>{selected.description}</T>
          </View>
          {cards(selected.mealIds)}
        </PageScroll>
      </Page>
    );
  return (
    <Page>
      <View
        style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 }}
      >
        <T accessibilityRole="header" size={22} weight="600">
          Para lembrar depois
        </T>
      </View>
      <Tabs
        items={["Listas", "Lugares", "Avaliações"]}
        value={tab}
        onChange={setTab}
      />
      <PageScroll>
        {tab === "Listas"
          ? savedLists.map((collection) => (
              <View
                key={collection.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  gap: 10,
                }}
              >
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={`Abrir lista ${collection.title}, de ${collection.owner.name}`}
                  onPress={() => setCollectionId(collection.id)}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <Photo
                    uri={
                      state.meals.find((meal) =>
                        collection.mealIds.includes(meal.id),
                      )?.dishes[0].imageUrl ?? ""
                    }
                    label={collection.title}
                    style={{ width: 80, height: 96, borderRadius: 10 }}
                  />
                  <View style={{ flex: 1, gap: 5 }}>
                    <T size={16} weight="600">
                      {collection.title}
                    </T>
                    <T size={12} muted>
                      de {collection.owner.name}
                    </T>
                    <T size={12} muted>
                      {collection.mealIds.length} experiências
                    </T>
                  </View>
                </Pressable>
                <IconButton
                  name="bookmark"
                  active
                  label={`Deixar de salvar ${collection.title}`}
                  onPress={() => {
                    void repository.toggleCollection(collection.id);
                  }}
                />
              </View>
            ))
          : null}
        {tab === "Lugares"
          ? places.map((place) => (
              <RestaurantRow
                key={place.id}
                place={place}
                onPress={() => openRestaurant(place.id)}
                saved
                onSave={() => {
                  void repository.toggleRestaurant(place.id);
                }}
              />
            ))
          : null}
        {tab === "Avaliações" ? cards(reviews.map((meal) => meal.id)) : null}
        {(tab === "Listas" && !savedLists.length) ||
        (tab === "Lugares" && !places.length) ||
        (tab === "Avaliações" && !reviews.length) ? (
          <Empty title="Guarde uma próxima vontade">
            Listas de outras pessoas, lugares e avaliações salvos ficam aqui.
          </Empty>
        ) : null}
      </PageScroll>
    </Page>
  );
}
