import { Pressable, ScrollView, View } from "react-native";
import type { Dish } from "@/domain/jambu";
import { formatRating } from "@/domain/jambu";
import { useJambuTheme } from "@/design/theme";
import { Icon } from "@/components/jambu/icon";
import { ChoiceSeal, Photo, T } from "../../components/primitives";

export function DishTrail({
  dishes,
  choiceId,
  onAdd,
  onEdit,
  onMention,
  disabled,
}: {
  dishes: Dish[];
  choiceId: string | null;
  onAdd: () => void;
  onEdit: (dish: Dish) => void;
  onMention: (dish: Dish) => void;
  disabled: boolean;
}) {
  const { colors } = useJambuTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 12,
        paddingBottom: 12,
      }}
    >
      {dishes.map((dish) => (
        <Pressable
          key={dish.id}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${dish.name}, nota ${formatRating(dish.rating)}`}
          accessibilityHint="Segure para citar o nome no relato"
          onPress={() => onEdit(dish)}
          onLongPress={() => onMention(dish)}
          style={{ width: 112, gap: 6 }}
        >
          <Photo
            uri={dish.imageUrl}
            label={dish.name}
            style={{ width: 112, height: 148, borderRadius: 12 }}
          />
          <View
            style={{
              position: "absolute",
              left: 6,
              top: 6,
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 3,
              backgroundColor: colors.background,
            }}
          >
            <T size={12} weight="600">
              {formatRating(dish.rating)}
            </T>
          </View>
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 26,
              height: 26,
              borderRadius: 8,
              backgroundColor: colors.background,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="edit" size={16} color={colors.ink} />
          </View>
          {choiceId === dish.id ? (
            <View style={{ position: "absolute", left: 5, top: 117 }}>
              <ChoiceSeal compact />
            </View>
          ) : null}
          <T size={12} weight="600" numberOfLines={2}>
            {dish.name}
          </T>
        </Pressable>
      ))}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adicionar prato da galeria"
        disabled={disabled || dishes.length >= 20}
        onPress={onAdd}
        style={({ pressed }) => ({
          width: 112,
          height: 148,
          borderRadius: 12,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          opacity: disabled || pressed ? 0.5 : 1,
        })}
      >
        <Icon name="plus" size={30} />
        <T size={12} weight="600">
          Adicionar prato
        </T>
      </Pressable>
    </ScrollView>
  );
}
