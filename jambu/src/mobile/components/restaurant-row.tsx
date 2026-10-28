import { Pressable, View } from "react-native";
import type { Restaurant } from "@/domain/jambu";
import { useJambuTheme } from "@/design/theme";
import { Icon } from "@/components/jambu/icon";
import { IconButton, T } from "./primitives";

export function RestaurantRow({
  place,
  onPress,
  saved,
  onSave,
}: {
  place: Restaurant;
  onPress: () => void;
  saved?: boolean;
  onSave?: () => void;
}) {
  const { colors } = useJambuTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 7,
      }}
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Abrir ${place.name}`}
        onPress={onPress}
        style={({ pressed }) => ({
          flex: 1,
          minHeight: 68,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Icon name="pin" color={colors.muted} size={22} />
        <View style={{ flex: 1, gap: 3 }}>
          <T size={15} weight="600">
            {place.name}
          </T>
          <T size={12} muted numberOfLines={2}>
            {place.location}
          </T>
        </View>
        {!onSave ? (
          <Icon name="chevron" size={17} color={colors.muted} />
        ) : null}
      </Pressable>
      {onSave ? (
        <IconButton
          name="bookmark"
          active={saved}
          label={
            saved ? `Remover ${place.name} dos salvos` : `Salvar ${place.name}`
          }
          onPress={onSave}
        />
      ) : null}
    </View>
  );
}
