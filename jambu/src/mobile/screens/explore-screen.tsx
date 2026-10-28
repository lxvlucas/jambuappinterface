import { useMeasuredWidth } from "@/design/content-layout";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { normalizeSearch } from "@/domain/jambu";
import { useJambu } from "../data/provider";
import {
  Avatar,
  Empty,
  Photo,
  Rating,
  SearchField,
  T,
  Tabs,
} from "../components/primitives";
import { Page } from "../components/screen";
import { RestaurantRow } from "../components/restaurant-row";
import { openMeal, openProfile, openRestaurant } from "../navigation";

export default function ExploreScreen() {
  const { state, repository } = useJambu();
  const { people, restaurants } = state;
  const { width, onLayout } = useMeasuredWidth();
  const [term, setTerm] = useState("");
  const [tab, setTab] = useState("Lugares");
  const query = normalizeSearch(term);
  const places = restaurants.filter((place) =>
    normalizeSearch(place.name + " " + place.location).includes(query),
  );
  const persons = people.filter((person) =>
    normalizeSearch(person.name + " " + person.username).includes(query),
  );
  const dishes = state.meals
    .flatMap((meal) =>
      meal.dishes.map((dish, index) => ({ meal, dish, index })),
    )
    .filter(({ dish, meal }) =>
      normalizeSearch(dish.name + " " + meal.restaurant.name).includes(query),
    );
  const cell = (width - 44) / 2;
  const empty =
    (tab === "Lugares" && !places.length) ||
    (tab === "Pessoas" && !persons.length) ||
    (tab === "Pratos" && !dishes.length);
  return (
    <Page>
      <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 4 }}>
        <SearchField
          value={term}
          onChange={setTerm}
          placeholder="Busque um lugar, prato ou pessoa"
        />
      </View>
      <ScrollView
        stickyHeaderIndices={[1]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <T accessibilityRole="header" size={20} weight="600">
            Uma boa descoberta
          </T>
        </View>
        <Tabs
          items={["Lugares", "Pratos", "Pessoas"]}
          value={tab}
          onChange={setTab}
        />
        <View onLayout={onLayout} style={{ paddingTop: 8 }}>
          {tab === "Lugares"
            ? places.map((place) => (
                <RestaurantRow
                  key={place.id}
                  place={place}
                  onPress={() => openRestaurant(place.id)}
                  saved={state.savedRestaurantIds.includes(place.id)}
                  onSave={() => {
                    void repository.toggleRestaurant(place.id);
                  }}
                />
              ))
            : null}
          {tab === "Pessoas"
            ? persons.map((person) => (
                <Pressable
                  key={person.id}
                  accessibilityRole="link"
                  accessibilityLabel={`Ver perfil de ${person.name}`}
                  onPress={() => openProfile(person.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    minHeight: 76,
                  }}
                >
                  <Avatar person={person} size={44} />
                  <View style={{ flex: 1 }}>
                    <T size={16} weight="600">
                      {person.name}
                    </T>
                    <T size={14} muted>
                      {person.username}
                    </T>
                  </View>
                </Pressable>
              ))
            : null}
          {tab === "Pratos" ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 16,
                gap: 12,
              }}
            >
              {dishes.map(({ dish, meal, index }) => (
                <Pressable
                  key={dish.id}
                  accessibilityRole="link"
                  accessibilityLabel={`Ver ${dish.name}`}
                  onPress={() => openMeal(meal.id, index)}
                  style={{ width: cell, gap: 7, marginBottom: 12 }}
                >
                  <Photo
                    uri={dish.imageUrl}
                    label={dish.name}
                    style={{
                      width: cell,
                      aspectRatio: 3 / 4,
                      borderRadius: 10,
                    }}
                  />
                  <T size={14} weight="600" numberOfLines={2}>
                    {dish.name}
                  </T>
                  <Rating value={dish.rating} size={14} />
                </Pressable>
              ))}
            </View>
          ) : null}
          {empty ? (
            <Empty title="Não encontramos por aqui">
              Tente outro nome ou limpe a busca para ver os exemplos.
            </Empty>
          ) : null}
        </View>
      </ScrollView>
    </Page>
  );
}
