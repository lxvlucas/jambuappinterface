import { router } from "expo-router";

export const openMeal = (id: string, dish = 0, comments = false) =>
  router.push({
    pathname: "/meal/[id]",
    params: { id, dish: String(dish), comments: comments ? "1" : undefined },
  });
export const openProfile = (id: string) =>
  router.push({ pathname: "/profile/[id]", params: { id } });
export const openRestaurant = (id: string) =>
  router.push({ pathname: "/restaurant/[id]", params: { id } });
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/");
}
