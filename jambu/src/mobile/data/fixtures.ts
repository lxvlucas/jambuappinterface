import raw from "./meals.json";
import {
  validateReview,
  type Meal,
  type Person,
  type Restaurant,
  type SavedCollection,
} from "@/domain/jambu";

// Explicit illustrative selections for this UI proposal, not migrated API fields.
const demoChoices: Record<string, string> = {
  "meal-012": "dish-25",
  "meal-013": "dish-27",
  "meal-014": "dish-28",
  "meal-002": "dish-02",
  "meal-004": "dish-08",
};
export const fixtureMeals: Meal[] = raw
  .map((meal) => {
    const value: Meal = {
      ...meal,
      dishes: meal.dishes.map(
        ({ wouldEatAgain: _legacyFlag, ...dish }) => dish,
      ),
      choiceDishId: demoChoices[meal.id] ?? null,
    };
    const error = validateReview({
      restaurantId: value.restaurant.id,
      dishes: value.dishes,
      review: value.review,
      choiceDishId: value.choiceDishId,
    });
    if (error) throw new Error(`Fixture ${value.id}: ${error}`);
    return value;
  })
  .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
export const currentUser = fixtureMeals.find(
  (meal) => meal.user.id === "usr-01",
)!.user;
export const people: Person[] = Array.from(
  new Map(fixtureMeals.map((meal) => [meal.user.id, meal.user])).values(),
);
export const restaurants: Restaurant[] = Array.from(
  new Map(
    fixtureMeals.map((meal) => [meal.restaurant.id, meal.restaurant]),
  ).values(),
);
export const collections: SavedCollection[] = [
  {
    id: "collection-burgers",
    title: "Um bom hambúrguer resolve",
    owner: people.find((p) => p.id === "usr-02")!,
    description: "Pratos para guardar para a próxima vontade.",
    mealIds: ["meal-002", "meal-013"],
  },
  {
    id: "collection-sunday",
    title: "Domingo sem pressa",
    owner: people.find((p) => p.id === "usr-04")!,
    description: "Massas, carnes e uma conversa longa à mesa.",
    mealIds: ["meal-004", "meal-011", "meal-014"],
  },
];
