import { Pressable, View } from "react-native";
import type { SavedCollection } from "@/domain/jambu";
import { useJambu } from "../data/provider";
import { IconButton, Photo, T } from "./primitives";

export function CollectionCard({
  collection,
  onOpen,
}: {
  collection: SavedCollection;
  onOpen: () => void;
}) {
  const { state, repository } = useJambu();
  const cover = state.meals.find((meal) => collection.mealIds.includes(meal.id))
    ?.dishes[0];
  const saved = state.savedCollectionIds.includes(collection.id);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 10,
      }}
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Abrir lista ${collection.title}, de ${collection.owner.name}`}
        onPress={onOpen}
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 14,
          alignItems: "center",
          minHeight: 88,
        }}
      >
        {cover ? (
          <Photo
            uri={cover.imageUrl}
            label={collection.title}
            style={{ width: 72, height: 88, borderRadius: 10 }}
          />
        ) : null}
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
        active={saved}
        label={`${saved ? "Deixar de salvar" : "Salvar"} lista ${collection.title}`}
        onPress={() => {
          void repository.toggleCollection(collection.id);
        }}
      />
    </View>
  );
}
