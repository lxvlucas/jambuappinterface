import {
  validateReview,
  type JambuRepository,
  type JambuSnapshot,
  type Meal,
  type Person,
  type Restaurant,
  type ReviewDraft,
  type SavedCollection,
} from "../../domain/jambu";
import { normalizeMarks } from "../../domain/review-document";

type ToggleKey =
  | "likedIds"
  | "savedMealIds"
  | "followedIds"
  | "savedRestaurantIds"
  | "savedCollectionIds";
export class MemoryJambuRepository implements JambuRepository {
  private snapshot: JambuSnapshot;
  private listeners = new Set<() => void>();
  private sequence = 0;

  constructor(
    meals: Meal[],
    private user: Person,
    private restaurants: Restaurant[],
    collections: SavedCollection[] = [],
  ) {
    this.snapshot = {
      currentUser: user,
      people: Array.from(
        new Map(meals.map((meal) => [meal.user.id, meal.user])).values(),
      ),
      restaurants,
      collections,
      meals,
      likedIds: [],
      savedMealIds: [],
      followedIds: ["usr-02", "usr-03"],
      savedRestaurantIds: ["rest-varanda"],
      savedCollectionIds: ["collection-burgers"],
    };
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private update(patch: Partial<JambuSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((listener) => listener());
  }
  private toggle(key: ToggleKey, id: string) {
    const values = this.snapshot[key];
    this.update({
      [key]: values.includes(id)
        ? values.filter((value) => value !== id)
        : [...values, id],
    });
    return Promise.resolve();
  }
  toggleLike = (id: string) => this.toggle("likedIds", id);
  toggleMeal = (id: string) => this.toggle("savedMealIds", id);
  toggleFollow = (id: string) => this.toggle("followedIds", id);
  toggleRestaurant = (id: string) => this.toggle("savedRestaurantIds", id);
  toggleCollection = (id: string) => this.toggle("savedCollectionIds", id);
  async publish(draft: ReviewDraft) {
    const error = validateReview(draft);
    if (error) throw new Error(error);
    const restaurant = this.restaurants.find(
      (place) => place.id === draft.restaurantId,
    );
    if (!restaurant)
      throw new Error("Esse restaurante não está disponível nos exemplos.");
    const id = `local-meal-${Date.now()}-${this.sequence++}`;
    const meal: Meal = {
      id,
      createdAt: new Date().toISOString(),
      timeAgo: "Agora",
      user: this.user,
      restaurant,
      dishes: draft.dishes.map((d) => ({ ...d, name: d.name.trim() })),
      choiceDishId: draft.choiceDishId,
      review: draft.review,
      reviewMarks: normalizeMarks(
        draft.review,
        draft.reviewMarks,
        draft.dishes.map((dish) => dish.id),
      ),
      stats: { likesCount: 0, commentsCount: 0, savesCount: 0, sharesCount: 0 },
      comments: [],
    };
    this.update({ meals: [meal, ...this.snapshot.meals] });
    return id;
  }
  async addComment(mealId: string, text: string, parentId?: string) {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 1000)
      throw new Error("Escreva um comentário de até 1.000 caracteres.");
    if (!this.snapshot.meals.some((meal) => meal.id === mealId))
      throw new Error("A avaliação não está disponível.");
    if (
      parentId &&
      !this.snapshot.meals
        .find((meal) => meal.id === mealId)
        ?.comments.some((comment) => comment.id === parentId)
    )
      throw new Error("Esse comentário não está mais disponível.");
    this.update({
      meals: this.snapshot.meals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              comments: [
                ...meal.comments,
                {
                  id: `local-comment-${Date.now()}-${this.sequence++}`,
                  name: this.user.name,
                  username: this.user.username,
                  avatarUrl: this.user.avatarUrl,
                  text: trimmed,
                  timeAgo: "Agora",
                  parentId: parentId ?? null,
                },
              ],
              stats: {
                ...meal.stats,
                commentsCount: meal.stats.commentsCount + 1,
              },
            }
          : meal,
      ),
    });
  }
}
