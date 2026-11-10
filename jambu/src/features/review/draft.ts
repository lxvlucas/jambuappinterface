import type { Dish, ReviewDraft, ReviewMark } from "../../../domain/jambu";

export const emptyDraft: ReviewDraft = {
  restaurantId: "",
  dishes: [],
  review: "",
  choiceDishId: null,
};
export type DraftAction =
  | { type: "restaurant"; id: string }
  | { type: "dish"; dish: Dish }
  | { type: "save-dish"; dish: Dish; choice: boolean }
  | { type: "remove"; id: string }
  | { type: "choice"; id: string | null }
  | { type: "review"; text: string; marks?: ReviewMark[] };
export function draftReducer(
  draft: ReviewDraft,
  action: DraftAction,
): ReviewDraft {
  switch (action.type) {
    case "restaurant":
      return { ...draft, restaurantId: action.id };
    case "dish":
      return {
        ...draft,
        dishes: draft.dishes.some((dish) => dish.id === action.dish.id)
          ? draft.dishes.map((dish) =>
              dish.id === action.dish.id ? action.dish : dish,
            )
          : [...draft.dishes, action.dish],
      };
    case "save-dish": {
      const updated = draftReducer(draft, { type: "dish", dish: action.dish });
      return {
        ...updated,
        choiceDishId: action.choice
          ? action.dish.id
          : draft.choiceDishId === action.dish.id
            ? null
            : draft.choiceDishId,
      };
    }
    case "remove":
      return {
        ...draft,
        dishes: draft.dishes.filter((dish) => dish.id !== action.id),
        choiceDishId:
          draft.choiceDishId === action.id ? null : draft.choiceDishId,
      };
    case "choice":
      return { ...draft, choiceDishId: action.id };
    case "review":
      return { ...draft, review: action.text, reviewMarks: action.marks ?? [] };
  }
}
let sequence = 0;
export function createDish(imageUrl: string): Dish {
  return {
    id: `draft-${Date.now()}-${sequence++}`,
    name: "",
    imageUrl,
    price: null,
    rating: 0,
  };
}
