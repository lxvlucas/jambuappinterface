import { memo } from "react";
import { Pressable, View } from "react-native";
import { averageRating, formatRating, type Meal } from "@/domain/jambu";
import { useJambuTheme } from "@/design/theme";
import { Icon } from "@/components/jambu/icon";
import { openMeal, openProfile } from "../navigation";
import { Avatar, T } from "./primitives";
import { FeedPhotos } from "./feed-photos";
import { LikeButton } from "./like-button";
import { PostScore } from "./post-score";

interface Props {
  meal: Meal;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}
export const MealFeedCard = memo(function MealFeedCard({
  meal,
  liked,
  saved,
  onLike,
  onSave,
}: Props) {
  const { colors } = useJambuTheme();
  const open = () => openMeal(meal.id);
  const time = meal.timeAgo
    .replace("Há ", "")
    .replace(" minutos", "m")
    .replace(" horas", "h");
  return (
    <Pressable
      accessible={false}
      onPress={open}
      style={{
        paddingTop: 18,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}
    >
      <View style={{ paddingLeft: 64, paddingRight: 16 }}>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Ver perfil de ${meal.user.name}`}
          onPress={(e) => {
            e.stopPropagation();
            openProfile(meal.user.id);
          }}
          style={{
            position: "absolute",
            left: 8,
            top: -4,
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar person={meal.user} size={38} />
        </Pressable>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Abrir avaliação de ${meal.restaurant.name}`}
          onPress={open}
          style={{ minHeight: 48, justifyContent: "center" }}
        >
          <T numberOfLines={1} size={14} muted style={{ lineHeight: 21 }}>
            <T size={16} weight="600">
              {meal.user.name}
            </T>{" "}
            {meal.user.username} · {time}
          </T>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "flex-start",
              paddingTop: 2,
            }}
          >
            <T size={17} weight="600" style={{ flex: 1, lineHeight: 24 }}>
              {meal.restaurant.name}
            </T>
            <View style={{ width: 58, paddingTop: 1 }}>
              <PostScore value={averageRating(meal)} />
            </View>
          </View>
        </Pressable>
        <T
          size={14}
          muted
          numberOfLines={2}
          style={{ lineHeight: 21, marginTop: 2, marginBottom: 8 }}
        >
          {meal.dishes
            .map((d) => `${d.name} ${formatRating(d.rating)}`)
            .join(" • ")}
        </T>
      </View>
      <FeedPhotos meal={meal} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 64,
          paddingRight: 8,
          gap: 8,
        }}
      >
        <LikeButton
          liked={liked}
          count={meal.stats.likesCount + Number(liked)}
          label={`${liked ? "Descurtir" : "Curtir"} avaliação de ${meal.user.name}`}
          onPress={onLike}
        />
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Abrir ${meal.comments.length} comentários`}
          onPress={(e) => {
            e.stopPropagation();
            openMeal(meal.id, 0, true);
          }}
          style={{
            minWidth: 48,
            minHeight: 48,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon name="comment" size={22} color={colors.muted} />
          <T size={12} muted>
            {meal.comments.length}
          </T>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            saved ? "Remover avaliação dos salvos" : "Salvar avaliação"
          }
          onPress={(e) => {
            e.stopPropagation();
            onSave();
          }}
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            name="bookmark"
            size={22}
            filled={saved}
            color={saved ? colors.ink : colors.muted}
          />
        </Pressable>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Ver avaliação completa"
          onPress={open}
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="more" size={22} color={colors.muted} />
        </Pressable>
      </View>
    </Pressable>
  );
});
