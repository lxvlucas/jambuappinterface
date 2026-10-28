import { useMeasuredWidth } from "@/design/content-layout";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Button } from "@/components/jambu/ui";
import { useJambu } from "../data/provider";
import { Avatar, Empty, Photo, T, Tabs } from "../components/primitives";
import { Page, PageBar, PageScroll } from "../components/screen";
import { MealFeedCard } from "../components/meal-feed-card";
import { CollectionCard } from "../components/collection-card";
import { openMeal } from "../navigation";

export default function ProfileScreen({ own = false }: { own?: boolean }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, repository, user } = useJambu();
  const { collections, people } = state;
  const { width, onLayout } = useMeasuredWidth();
  const [tab, setTab] = useState("Pratos");
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const person = own ? user : people.find((value) => value.id === id);
  if (!person)
    return (
      <Page>
        <PageBar title="Perfil" />
        <Empty title="Perfil não encontrado">
          Volte e procure outra pessoa.
        </Empty>
      </Page>
    );
  const meals = state.meals.filter((meal) => meal.user.id === person.id);
  const dishes = meals.flatMap((meal) =>
    meal.dishes.map((dish, index) => ({ dish, meal, index })),
  );
  const cell = Math.floor((width - 4) / 3);
  const personCollections = own
    ? []
    : collections.filter((collection) => collection.owner.id === person.id);
  const selectedCollection = personCollections.find(
    (collection) => collection.id === collectionId,
  );
  if (selectedCollection)
    return (
      <Page>
        <PageBar
          title={selectedCollection.title}
          onBack={() => setCollectionId(null)}
        />
        <PageScroll>
          <View style={{ padding: 20, gap: 8 }}>
            <T size={13} muted>
              Uma lista de {selectedCollection.owner.name}
            </T>
            <T size={15}>{selectedCollection.description}</T>
          </View>
          {state.meals
            .filter((meal) => selectedCollection.mealIds.includes(meal.id))
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
  return (
    <Page>
      {!own ? <PageBar title={person.username} /> : null}
      <PageScroll>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: own ? 12 : 8,
            paddingBottom: 12,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 17 }}>
            <Avatar person={person} size={70} />
            <View style={{ flex: 1, gap: 0 }}>
              <T
                accessibilityRole="header"
                size={24}
                weight="600"
                style={{ letterSpacing: -0.5 }}
              >
                {person.name}
              </T>
              <T size={15} muted>
                {person.username}
              </T>
            </View>
          </View>
          <T size={15}>{person.bio}</T>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <T size={12} muted>
              {dishes.length} pratos · {meals.length} refeições
            </T>
            {person.id !== user.id ? (
              <Button
                variant="secondary"
                onPress={() => {
                  void repository.toggleFollow(person.id);
                }}
              >
                {state.followedIds.includes(person.id) ? "Seguindo" : "Seguir"}
              </Button>
            ) : null}
          </View>
        </View>
        <Tabs
          items={
            personCollections.length
              ? ["Pratos", "Refeições", "Listas"]
              : ["Pratos", "Refeições"]
          }
          value={tab}
          onChange={setTab}
        />
        {tab === "Listas"
          ? personCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onOpen={() => setCollectionId(collection.id)}
              />
            ))
          : null}
        {tab === "Pratos" ? (
          <View
            onLayout={onLayout}
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 2,
              paddingTop: 2,
            }}
          >
            {dishes.map(({ dish, meal, index }) => (
              <Pressable
                key={dish.id}
                accessibilityRole="link"
                accessibilityLabel={`${dish.name}, nota ${dish.rating}`}
                onPress={() => openMeal(meal.id, index)}
                style={{ width: cell }}
              >
                <Photo
                  uri={dish.imageUrl}
                  label={dish.name}
                  style={{ width: cell, aspectRatio: 3 / 4 }}
                />
              </Pressable>
            ))}
          </View>
        ) : tab === "Refeições" ? (
          meals.map((meal) => (
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
          ))
        ) : null}
        {!meals.length ? (
          <Empty title="Seu próximo prato começa o diário">
            As experiências que você registrar vão aparecer aqui.
          </Empty>
        ) : null}
      </PageScroll>
    </Page>
  );
}
