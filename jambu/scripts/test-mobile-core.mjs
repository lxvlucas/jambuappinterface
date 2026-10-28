import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const root = resolve("dist/mobile-core-tests");
for (const file of [
  "mobile/features/media/photo-geometry.ts",
  "domain/jambu.ts",
  "domain/review-document.ts",
  "domain/rating-color.ts",
  "mobile/data/memory-repository.ts",
  "mobile/features/review/draft.ts",
  "mobile/features/review/rating-position.ts",
]) {
  const output = resolve(root, file.replace(/\.ts$/, ".js"));
  await mkdir(dirname(output), { recursive: true });
  const result = ts.transpileModule(
    await readFile(resolve("src", file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: file,
    },
  );
  await writeFile(output, result.outputText);
}
const require = createRequire(import.meta.url);
const { starFractions, validateReview } = require(
  resolve(root, "domain/jambu.js"),
);
const { draftReducer, emptyDraft } = require(
  resolve(root, "mobile/features/review/draft.js"),
);
const { ratingColor } = require(resolve(root, "domain/rating-color.js"));
const scale = { low: "#b42318", middle: "#8a6507", high: "#072c0d" };
assert.equal(ratingColor(0.5, scale), scale.low);
assert.equal(ratingColor(5, scale), scale.high);
assert.equal(ratingColor(2.75, scale), scale.middle);
assert.equal(ratingColor(-1, scale), scale.low);
assert.equal(ratingColor(9, scale), scale.high);
const { ratingAtPosition } = require(
  resolve(root, "mobile/features/review/rating-position.js"),
);
assert.equal(ratingAtPosition(150, 300, "tap"), 3);
assert.equal(ratingAtPosition(150, 300, "drag"), 2.5);
assert.equal(ratingAtPosition(-10, 300, "drag"), 0.5);
assert.equal(ratingAtPosition(400, 300, "drag"), 5);
assert.equal(ratingAtPosition(0, 0, "tap"), 0.5);
const { MemoryJambuRepository } = require(
  resolve(root, "mobile/data/memory-repository.js"),
);
const fixtures = JSON.parse(
  await readFile("src/mobile/data/meals.json", "utf8"),
);
const user = fixtures.find((meal) => meal.user.id === "usr-01").user;
const places = [
  ...new Map(
    fixtures.map((meal) => [meal.restaurant.id, meal.restaurant]),
  ).values(),
];
const repo = new MemoryJambuRepository(fixtures, user, places);
const dish = {
  id: "test-dish",
  name: "Prato de teste",
  imageUrl: "file:///local-example.jpg",
  rating: 3.5,
  price: null,
};
const valid = {
  restaurantId: places[0].id,
  dishes: [dish],
  review: "Uma opinião específica.",
  choiceDishId: dish.id,
};

for (let value = 0; value <= 5; value += 0.5) {
  const fractions = starFractions(value);
  assert.equal(fractions.length, 5);
  assert.equal(
    fractions.reduce((sum, fraction) => sum + fraction, 0),
    value,
    `Estrelas devem representar ${value}`,
  );
  assert.ok(fractions.every((fraction) => [0, 0.5, 1].includes(fraction)));
}
assert.equal(validateReview(valid), null);
for (const meal of fixtures)
  assert.equal(
    validateReview({
      restaurantId: meal.restaurant.id,
      dishes: meal.dishes,
      review: meal.review,
      choiceDishId: null,
    }),
    null,
    meal.id,
  );
assert.ok(
  Math.abs(starFractions(4.8).reduce((sum, value) => sum + value, 0) - 4.8) <
    0.0001,
);
for (const rating of [0, 5.5, NaN])
  assert.ok(validateReview({ ...valid, dishes: [{ ...dish, rating }] }));
assert.ok(validateReview({ ...valid, dishes: [{ ...dish, imageUrl: "" }] }));
assert.ok(validateReview({ ...valid, dishes: [dish, dish] }));
assert.ok(validateReview({ ...valid, choiceDishId: "missing-dish" }));
let draft = draftReducer(emptyDraft, { type: "dish", dish });
draft = draftReducer(draft, { type: "choice", id: dish.id });
draft = draftReducer(draft, { type: "remove", id: dish.id });
assert.equal(draft.choiceDishId, null);
assert.equal(draft.dishes.length, 0);
const higher = { ...dish, id: "higher", rating: 5 };
const lower = { ...dish, id: "lower", rating: 2.5 };
let freeChoice = draftReducer(emptyDraft, {
  type: "save-dish",
  dish: higher,
  choice: true,
});
freeChoice = draftReducer(freeChoice, {
  type: "save-dish",
  dish: lower,
  choice: true,
});
assert.equal(
  freeChoice.choiceDishId,
  lower.id,
  "Uma nota menor também pode ser a escolha",
);
freeChoice = draftReducer(freeChoice, {
  type: "save-dish",
  dish: { ...higher, name: "Outro nome" },
  choice: false,
});
assert.equal(
  freeChoice.choiceDishId,
  lower.id,
  "Editar outro prato preserva a escolha",
);
freeChoice = draftReducer(freeChoice, {
  type: "save-dish",
  dish: lower,
  choice: false,
});
assert.equal(
  freeChoice.choiceDishId,
  null,
  "Desmarcar o prato escolhido retira o selo",
);
assert.equal(
  emptyDraft.dishes.length,
  0,
  "Reducer não altera o estado inicial",
);
let notifications = 0;
const unsubscribe = repo.subscribe(() => notifications++);
const before = repo.getSnapshot();
await assert.rejects(repo.publish({ ...valid, dishes: [] }));
assert.strictEqual(
  repo.getSnapshot(),
  before,
  "Publicação inválida não altera o repositório",
);
const id = await repo.publish(valid);
const created = repo.getSnapshot().meals[0];
assert.equal(created.id, id);
assert.equal(created.user.id, user.id);
assert.equal(created.choiceDishId, dish.id);
assert.equal(before.meals.length, fixtures.length);
await repo.addComment(id, " Comentário local ");
assert.equal(repo.getSnapshot().meals[0].comments[0].text, "Comentário local");
assert.equal(repo.getSnapshot().meals[0].stats.commentsCount, 1);
await repo.toggleRestaurant(places[0].id);
await repo.toggleRestaurant(places[0].id);
assert.deepEqual(
  repo.getSnapshot().savedRestaurantIds,
  before.savedRestaurantIds,
);
assert.ok(notifications >= 4);
unsubscribe();
process.stdout.write(
  "Mobile core: estrelas 0–5/meias notas, validação, selo único, reducer, publicação/comentários e favoritos passaram.\n",
);

const {
  editReview,
  replaceReviewRange,
  reviewSegments,
  safeExternalUrl,
  toggleReviewStyle,
} = require(resolve(root, "domain/review-document.js"));
const textDoc = {
  text: "Antes Pizza depois",
  marks: [{ type: "dish", dishId: "pizza-id", start: 6, end: 11 }],
};
const prefixed = replaceReviewRange(textDoc, { start: 0, end: 0 }, "Oi ");
assert.equal(prefixed.text, "Oi Antes Pizza depois");
assert.deepEqual(prefixed.marks, [
  { type: "dish", dishId: "pizza-id", start: 9, end: 14 },
]);
const editedMention = replaceReviewRange(textDoc, { start: 8, end: 9 }, "x");
assert.equal(
  editedMention.marks.length,
  0,
  "Editar o texto de uma citação remove vínculo atômico, sem apontar a outro prato",
);
const inserted = replaceReviewRange(
  { text: "A  ficou boa", marks: [] },
  { start: 2, end: 2 },
  "Pizza",
  [{ type: "dish", dishId: "pizza-id", start: 2, end: 7 }],
);
assert.equal(inserted.text, "A Pizza ficou boa");
const bold = toggleReviewStyle(inserted, { start: 0, end: 7 }, "bold");
assert.ok(
  reviewSegments(bold).some(
    (segment) =>
      segment.text === "Pizza" &&
      segment.marks.some((mark) => mark.type === "bold") &&
      segment.marks.some((mark) => mark.type === "dish"),
  ),
);
const unbold = toggleReviewStyle(bold, { start: 2, end: 7 }, "bold");
assert.ok(
  !reviewSegments(unbold)
    .find((segment) => segment.text === "Pizza")
    .marks.some((mark) => mark.type === "bold"),
);
assert.equal(safeExternalUrl("javascript:alert(1)"), null);
assert.equal(safeExternalUrl("data:text/html,test"), null);
assert.equal(
  safeExternalUrl("https://example.com/prato"),
  "https://example.com/prato",
);
assert.equal(
  editReview({ text: "Oi ", marks: [] }, "Oi gostoso", ["italic"]).marks[0]
    .start,
  3,
);
const richId = await repo.publish({
  ...valid,
  review: " Prato de teste !",
  reviewMarks: [{ type: "dish", dishId: dish.id, start: 1, end: 15 }],
});
assert.equal(
  repo.getSnapshot().meals[0].review,
  " Prato de teste !",
  "Não aparar texto sem ajustar offsets de formatação",
);
assert.equal(repo.getSnapshot().meals[0].reviewMarks[0].dishId, dish.id);
await repo.addComment(richId, "Primeiro");
const parentComment = repo.getSnapshot().meals[0].comments[0];
await repo.addComment(richId, "Resposta", parentComment.id);
assert.equal(
  repo.getSnapshot().meals[0].comments[1].parentId,
  parentComment.id,
);
const beforeBadReply = repo.getSnapshot();
await assert.rejects(repo.addComment(richId, "Não entra", "missing-parent"));
assert.strictEqual(repo.getSnapshot(), beforeBadReply);
process.stdout.write(
  "Rich review: inserção no cursor, estilos sobrepostos, menções, links seguros e respostas a comentários passaram.\n",
);

const { photoBounds } = require(
  resolve(root, "mobile/features/media/photo-geometry.js"),
);
assert.deepEqual(photoBounds(400, 800, 1200, 900, 1), { x: 0, y: 0 });
assert.deepEqual(photoBounds(400, 800, 1200, 900, 2), { x: 200, y: 0 });
assert.ok(Math.abs(photoBounds(400, 800, 900, 1200, 3).y - 400) < 1e-9);
assert.equal(photoBounds(400, 800, 900, 1200, 3).x, 400);
assert.deepEqual(photoBounds(800, 400, 1200, 900, 1), { x: 0, y: 0 });
console.log(
  "Media geometry: contained portrait/landscape photos keep zoom inside actual image bounds.",
);
