export interface Person {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
}
export interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: string;
}
export interface Dish {
  id: string;
  name: string;
  imageUrl: string;
  price: number | null;
  rating: number;
}
export interface Comment {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  text: string;
  timeAgo: string;
  parentId?: string | null;
}
export type ReviewMark = { start: number; end: number } & (
  | { type: "bold" | "italic" }
  | { type: "link"; url: string }
  | { type: "dish"; dishId: string }
);
export interface ReviewDocument {
  text: string;
  marks: ReviewMark[];
}
export interface Meal {
  id: string;
  createdAt: string;
  timeAgo: string;
  user: Person;
  restaurant: Restaurant;
  dishes: Dish[];
  review: string;
  reviewMarks?: ReviewMark[];
  choiceDishId: string | null;
  stats: {
    likesCount: number;
    commentsCount: number;
    savesCount: number;
    sharesCount: number;
  };
  comments: Comment[];
}
export interface SavedCollection {
  id: string;
  title: string;
  owner: Person;
  description: string;
  mealIds: string[];
}
export interface ReviewDraft {
  restaurantId: string;
  dishes: Dish[];
  review: string;
  reviewMarks?: ReviewMark[];
  choiceDishId: string | null;
}
export interface JambuSnapshot {
  currentUser: Person;
  people: Person[];
  restaurants: Restaurant[];
  collections: SavedCollection[];
  meals: Meal[];
  likedIds: string[];
  savedMealIds: string[];
  followedIds: string[];
  savedRestaurantIds: string[];
  savedCollectionIds: string[];
}
export interface JambuRepository {
  getSnapshot(): JambuSnapshot;
  subscribe(listener: () => void): () => void;
  publish(draft: ReviewDraft): Promise<string>;
  addComment(mealId: string, text: string, parentId?: string): Promise<void>;
  toggleLike(id: string): Promise<void>;
  toggleMeal(id: string): Promise<void>;
  toggleFollow(id: string): Promise<void>;
  toggleRestaurant(id: string): Promise<void>;
  toggleCollection(id: string): Promise<void>;
}
export const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
export const formatRating = (rating: number) =>
  rating.toFixed(1).replace(".", ",");
export const averageRating = (meal: Meal) =>
  meal.dishes.reduce((sum, dish) => sum + dish.rating, 0) / meal.dishes.length;
export const starFractions = (rating: number) =>
  Array.from({ length: 5 }, (_, index) =>
    Math.max(0, Math.min(1, rating - index)),
  );
export function validateReview(draft: ReviewDraft): string | null {
  if (!draft.restaurantId) return "Escolha o restaurante para continuar.";
  if (!draft.dishes.length)
    return "Adicione pelo menos um prato com foto e nota.";
  if (draft.dishes.length > 20)
    return "Você pode avaliar até 20 pratos por publicação.";
  if (new Set(draft.dishes.map((dish) => dish.id)).size !== draft.dishes.length)
    return "Cada prato precisa de um identificador próprio.";
  if (
    draft.dishes.some(
      (d) =>
        !d.name.trim() ||
        !d.imageUrl ||
        !Number.isFinite(d.rating) ||
        d.rating < 0.5 ||
        d.rating > 5,
    )
  )
    return "Cada prato precisa de foto, nome e nota de meia a cinco estrelas.";
  if (
    draft.choiceDishId &&
    !draft.dishes.some((d) => d.id === draft.choiceDishId)
  )
    return "Escolha um dos pratos da publicação para o selo.";
  if (draft.review.length > 5000)
    return "Seu relato pode ter até 5.000 caracteres.";
  return null;
}
