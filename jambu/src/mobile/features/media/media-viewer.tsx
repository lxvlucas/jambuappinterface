import { useRef, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { pictures } from "../../data/pictures";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useJambuTheme } from "@/design/theme";
import { Icon } from "@/components/jambu/icon";
import { useJambu } from "../../data/provider";
import { Avatar, IconButton, T } from "../../components/primitives";
import { Identity } from "../../components/identity";
import { KeyboardFrame } from "../../components/keyboard-frame";
import { LikeButton } from "../../components/like-button";
import { ReviewText } from "../../components/review-text";
import {
  CommentComposer,
  CommentList,
  type CommentComposerHandle,
} from "../../components/comments";
import { openMeal } from "../../navigation";
import { ZoomPhoto, type ZoomPhotoHandle } from "./zoom-photo";
import { EdgeShade } from "./edge-shade";

type Props = {
  selection: { mealId: string; index: number };
  onClose: () => void;
};
export function MediaViewer(props: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={props.onClose}
    >
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ViewerContents {...props} />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Modal>
  );
}
function ViewerContents({ selection, onClose }: Props) {
  const { state, repository, user } = useJambu(),
    { colors } = useJambuTheme(),
    insets = useSafeAreaInsets();
  const meal = state.meals.find((m) => m.id === selection.mealId);
  const [index, setIndex] = useState(selection.index),
    [comments, setComments] = useState(false);
  const gallery = useRef<ZoomPhotoHandle>(null),
    composer = useRef<CommentComposerHandle>(null);
  const dragY = useSharedValue(0);
  const backdrop = useAnimatedStyle(() => ({
    opacity: Math.max(0.08, 1 - Math.abs(dragY.get()) / 450),
  }));
  const chrome = useAnimatedStyle(() => ({
    opacity: Math.max(0, 1 - Math.abs(dragY.get()) / 160),
  }));
  if (!meal) return null;
  const selected = Math.max(0, Math.min(index, meal.dishes.length - 1)),
    dish = meal.dishes[selected];
  const followed = state.followedIds.includes(meal.user.id),
    liked = state.likedIds.includes(meal.id);
  const goTo = (next: number) => gallery.current?.goTo(next);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: "#000" }, backdrop]}
      >
        <Image
          source={pictures[dish.imageUrl] ?? { uri: dish.imageUrl }}
          contentFit="cover"
          blurRadius={16}
          accessible={false}
          transition={180}
          style={[StyleSheet.absoluteFill, { opacity: 0.48 }]}
        />
      </Animated.View>
      <ZoomPhoto
        ref={gallery}
        dishes={meal.dishes}
        initialIndex={selected}
        onIndexChange={setIndex}
        onDismiss={onClose}
        dragY={dragY}
      />
      <Animated.View
        pointerEvents="box-none"
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: insets.top,
            paddingBottom: 48,
          },
          chrome,
        ]}
      >
        <EdgeShade top />
        <View
          style={{
            width: "100%",
            maxWidth: 760,
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            minHeight: 56,
          }}
        >
          <IconButton
            name="close"
            label="Fechar foto e voltar"
            onPress={onClose}
          />
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Abrir avaliação completa"
            onPress={() => {
              onClose();
              openMeal(meal.id, selected);
            }}
            style={{
              flex: 1,
              paddingHorizontal: 8,
              minHeight: 48,
              justifyContent: "center",
              gap: 2,
            }}
          >
            <T size={15} weight="600" numberOfLines={1}>
              {dish.name}
            </T>
            <T size={12} muted numberOfLines={1}>
              {meal.restaurant.name}
            </T>
          </Pressable>
          <IconButton
            name="expand"
            label="Ampliar ou restaurar foto"
            onPress={() => gallery.current?.toggleZoom()}
          />
        </View>
      </Animated.View>
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <KeyboardFrame pointerEvents="box-none">
          <View pointerEvents="box-none" style={{ flex: 1 }} />
          <Animated.View
            pointerEvents="box-none"
            style={[
              {
                paddingTop: 64,
                paddingBottom: Math.max(12, insets.bottom),
                paddingHorizontal: 16,
              },
              chrome,
            ]}
          >
            <EdgeShade />
            <View
              style={{
                width: "100%",
                maxWidth: 640,
                alignSelf: "center",
                gap: 6,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Avatar person={meal.user} size={36} />
                <View style={{ flex: 1 }}>
                  <Identity person={meal.user} />
                </View>
                {meal.user.id !== user.id ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${followed ? "Deixar de seguir" : "Seguir"} ${meal.user.name}`}
                    onPress={() => {
                      void repository.toggleFollow(meal.user.id);
                    }}
                    style={{
                      minHeight: 48,
                      minWidth: 78,
                      paddingHorizontal: 16,
                      borderRadius: 24,
                      backgroundColor: "rgba(255,255,255,0.16)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.24)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <T size={14} weight="600">
                      {followed ? "Seguindo" : "Seguir"}
                    </T>
                  </Pressable>
                ) : null}
              </View>
              <ReviewText
                text={meal.review}
                marks={meal.reviewMarks}
                dishes={meal.dishes}
                onDish={goTo}
                numberOfLines={2}
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <LikeButton
                  liked={liked}
                  count={meal.stats.likesCount + Number(liked)}
                  label={liked ? "Descurtir avaliação" : "Curtir avaliação"}
                  onPress={() => {
                    void repository.toggleLike(meal.id);
                  }}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    comments ? "Ocultar comentários" : "Ver comentários"
                  }
                  onPress={() => setComments((v) => !v)}
                  style={{
                    minHeight: 48,
                    minWidth: 48,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon name="comment" size={22} color={colors.ink} />
                  <T size={14}>{meal.comments.length}</T>
                </Pressable>
                <View style={{ flex: 1 }} />
                {meal.dishes.length > 1 ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton
                      name="back"
                      label="Foto anterior"
                      onPress={() => goTo(selected - 1)}
                    />
                    <T size={12} muted accessibilityLiveRegion="polite">
                      {selected + 1} de {meal.dishes.length}
                    </T>
                    <IconButton
                      name="next"
                      label="Próxima foto"
                      onPress={() => goTo(selected + 1)}
                    />
                  </View>
                ) : null}
              </View>
              {comments ? (
                <ScrollView
                  style={{
                    maxHeight: 220,
                    flexGrow: 0,
                    borderRadius: 16,
                    backgroundColor: "rgba(16,19,16,0.94)",
                  }}
                  contentContainerStyle={{ paddingHorizontal: 12 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <CommentList
                    meal={meal}
                    onReply={(comment) => composer.current?.reply(comment)}
                  />
                </ScrollView>
              ) : null}
              <CommentComposer
                floating
                ref={composer}
                meal={meal}
                onSent={() => setComments(true)}
              />
            </View>
          </Animated.View>
        </KeyboardFrame>
      </View>
    </View>
  );
}
