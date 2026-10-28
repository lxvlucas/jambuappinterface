import { createContext, useContext, useState, type ReactNode } from 'react';
import raw from './source-meals.json';
import type { Meal, Dish, Restaurant } from './models';

export const fixtureMeals = raw as Meal[];
export const demoUser = fixtureMeals[0].user;
export const people = fixtureMeals.map(meal => meal.user);
export const restaurants = Array.from(new Map(fixtureMeals.map(meal => [meal.restaurant.id, meal.restaurant])).values());

function useDemoState() {
  const [meals, setMeals] = useState<Meal[]>(fixtureMeals);
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>(['usr-02', 'usr-03']);
  const [notice, setNotice] = useState('');
  const toggle = (list: string[], id: string) => list.includes(id) ? list.filter(x => x !== id) : [...list, id];
  return {
    meals, liked, saved, followed, notice, setNotice,
    toggleLike: (id: string) => setLiked(list => toggle(list, id)),
    toggleSave: (id: string) => setSaved(list => toggle(list, id)),
    toggleFollow: (id: string) => setFollowed(list => toggle(list, id)),
    addComment: (id: string, text: string) => setMeals(list => list.map(meal => meal.id !== id ? meal : {
      ...meal,
      comments: [...meal.comments, { ...demoUser, id: `comment-${Date.now()}`, text: text.trim(), timeAgo: 'Agora' }],
      stats: { ...meal.stats, commentsCount: meal.stats.commentsCount + 1 },
    })),
    publish: (restaurant: Restaurant, dishes: Dish[], review: string) => {
      const id = `meal-${Date.now()}`;
      setMeals(list => [{ id, createdAt: new Date().toISOString(), timeAgo: 'Agora', user: demoUser, restaurant, dishes, review,
        stats: { likesCount: 0, commentsCount: 0, savesCount: 0, sharesCount: 0 }, comments: [] }, ...list]);
      setNotice('Sua avaliação já está no diário.');
      return id;
    },
  };
}
const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) { const value = useDemoState(); return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>; }
export function useDemo() { const value = useContext(DemoContext); if (!value) throw new Error('DemoProvider ausente'); return value; }
