export interface Person { id: string; name: string; username: string; avatarUrl: string; bio: string }
export interface Restaurant { id: string; name: string; category: string; location: string }
export interface Dish { id: string; name: string; imageUrl: string; price: number | null; rating: number; wouldEatAgain: boolean }
export interface Comment { id: string; name: string; username: string; avatarUrl: string; text: string; timeAgo: string }
export interface Meal {
  id: string; createdAt: string; timeAgo: string; user: Person; restaurant: Restaurant;
  dishes: Dish[]; review: string;
  stats: { likesCount: number; commentsCount: number; savesCount: number; sharesCount: number };
  comments: Comment[];
}
export const money = (value: number | null) => value === null ? 'Preço não informado' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const score = (value: number) => value.toFixed(1).replace('.', ',');
export const normalized = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
