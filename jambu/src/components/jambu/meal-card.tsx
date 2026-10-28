import { useViewport } from '@/design/viewport';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, ScrollView, Share, View } from 'react-native';
import { useDemo } from '@/data/demo';
import { money, type Meal } from '@/data/models';
import { useJambuTheme } from '@/design/theme';
import { Again, Avatar, IconButton, Photo, Stars, T } from './ui';
import { Icon } from './icon';
import { go } from './shell';

export async function shareMeal(meal: Meal, notify: (text: string) => void) {
  try { if (Platform.OS === 'web') { await navigator.clipboard.writeText(`${window.location.origin}/meal/${meal.id}`); notify('Link da avaliação copiado.'); } else { await Share.share({ message: `${meal.user.name}: ${meal.dishes.map(d => d.name).join(', ')} no Jambu.` }); } } catch { notify('Não deu para compartilhar agora. Tente de novo.'); }
}
export function MealCard({ meal, expanded = false, initialDish = 0 }: { meal: Meal; expanded?: boolean; initialDish?: number }) {
  const { width } = useViewport(); const wide = width >= 1100;
  const { colors } = useJambuTheme(); const demo = useDemo();
  const [index, setIndex] = useState(Math.min(initialDish, meal.dishes.length - 1));
  const mediaWidth = wide ? 292 : Math.min(width - 40, 460);
  const carousel = useRef<ComponentRef<typeof ScrollView>>(null); const [readMore, setReadMore] = useState(expanded);
  const activeIndex = useRef(index);
  const setDishIndex = (next: number) => { activeIndex.current = next; setIndex(next); };
  useEffect(() => { carousel.current?.scrollTo({ x: mediaWidth * activeIndex.current, animated: false }); }, [mediaWidth]);
  const dish = meal.dishes[index]; const liked = demo.liked.includes(meal.id); const saved = demo.saved.includes(meal.id);
  const select = (next: number) => { setDishIndex(next); carousel.current?.scrollTo({ x: mediaWidth * next, animated: false }); };
  const summary = <View style={{ gap: 10 }}><Pressable accessibilityRole="link" onPress={() => go(`/meal/${meal.id}?dish=${index}`)}><T size={wide ? 23 : 21} weight="600" style={{ lineHeight: wide ? 29 : 27, letterSpacing: -.4 }} numberOfLines={expanded ? undefined : 2}>{dish.name}</T></Pressable><View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}><Stars value={dish.rating} size={17}/><T size={14} muted style={{ fontVariant: ['tabular-nums'] }}>{money(dish.price)}</T></View>{dish.wouldEatAgain ? <Again/> : null}</View>;
  const media = <View style={{ width: wide ? 292 : '100%', maxWidth: wide ? 292 : 460, alignSelf: 'center' }} onLayout={() => { requestAnimationFrame(() => carousel.current?.scrollTo({ x: mediaWidth * index, animated: false })); }}>
    <ScrollView ref={carousel} horizontal pagingEnabled contentOffset={{ x: mediaWidth * Math.min(initialDish, meal.dishes.length - 1), y: 0 }} showsHorizontalScrollIndicator={false} scrollEventThrottle={64} onScroll={event => { const next = Math.round(event.nativeEvent.contentOffset.x / mediaWidth); if (next >= 0 && next < meal.dishes.length && next !== index) setDishIndex(next); }} style={{ borderRadius: 14, overflow: 'hidden' }}>
      {meal.dishes.map((item, i) => <Pressable key={item.id} accessibilityRole="link" accessibilityLabel={`Ver ${item.name}, prato ${i + 1} de ${meal.dishes.length}`} onPress={() => go(`/meal/${meal.id}?dish=${i}`)}><Photo uri={item.imageUrl} label={item.name} style={{ width: mediaWidth, height: mediaWidth * 4 / 3 }}/></Pressable>)}
    </ScrollView>
    {meal.dishes.length > 1 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 }}><T size={12} muted>{index + 1} de {meal.dishes.length} pratos</T><View style={{ flexDirection: 'row', gap: 4 }}>{meal.dishes.map((item, i) => <Pressable key={item.id} onPress={() => select(i)} accessibilityRole="button" accessibilityLabel={`Ver prato ${i + 1}: ${item.name}`} accessibilityState={{ selected: index === i }} style={{ minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: index === i ? 18 : 5, height: 5, borderRadius: 3, backgroundColor: index === i ? colors.ink : colors.line }}/></Pressable>)}</View></View> : null}
  </View>;
  const relato = <View style={{ gap: 9 }}><T size={15} numberOfLines={readMore ? undefined : wide ? 5 : 2} style={{ lineHeight: 23 }}>{meal.review || 'Uma nova experiência para o diário.'}</T>{!readMore && meal.review.length > 145 ? <Pressable accessibilityRole="button" onPress={() => setReadMore(true)} style={{ minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' }}><T size={13} weight="600">Ler relato completo</T></Pressable> : null}</View>;
  const actions = <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: wide ? 4 : 12 }}>
    <Pressable accessibilityRole="button" accessibilityLabel={`${liked ? 'Descurtir' : 'Curtir'} avaliação de ${meal.user.name}`} accessibilityState={{ selected: liked }} onPress={() => demo.toggleLike(meal.id)} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 48, opacity: pressed ? .55 : 1 })}><Icon name="heart" size={21} color={liked ? colors.positive : colors.muted} filled={liked}/><T size={13} muted>{meal.stats.likesCount + (liked ? 1 : 0)}</T></Pressable>
    <Pressable accessibilityRole="link" accessibilityLabel={`Ver ${meal.comments.length} comentários`} onPress={() => go(`/meal/${meal.id}?comments=1`)} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 48, opacity: pressed ? .55 : 1 })}><Icon name="comment" size={21} color={colors.muted}/><T size={13} muted>{meal.comments.length}</T></Pressable>
    <View style={{ flex: 1 }}/><IconButton name="share" label="Compartilhar avaliação" onPress={() => shareMeal(meal, demo.setNotice)} color={colors.muted}/><IconButton name="bookmark" label={saved ? 'Remover dos guardados' : 'Guardar avaliação'} onPress={() => { demo.toggleSave(meal.id); demo.setNotice(saved ? 'Avaliação removida dos guardados.' : 'Avaliação guardada para lembrar depois.'); }} active={saved} color={saved ? colors.ink : colors.muted} style={{ marginLeft: -18 }}/>
  </View>;
  return <View style={{ paddingBottom: 28, marginBottom: 28, borderBottomWidth: 1, borderBottomColor: colors.line }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 18 }}>
      <Pressable accessibilityRole="link" accessibilityLabel={`Ver perfil de ${meal.user.name}`} onPress={() => go(`/profile/${meal.user.id}`)} style={({ pressed }) => ({ flex: 1, minWidth: 0, minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, opacity: pressed ? .6 : 1 })}>
        <Avatar uri={meal.user.avatarUrl} name={meal.user.name} size={38}/>
        <View style={{ flex: 1, minWidth: 0 }}><T size={14} weight="600" numberOfLines={1}>{meal.user.name}</T><T size={12} muted>{meal.timeAgo}</T></View>
      </Pressable>
      <Pressable accessibilityRole="link" accessibilityLabel={`Ver lugar: ${meal.restaurant.name}`} onPress={() => go(`/restaurant/${meal.restaurant.id}`)} style={({ pressed }) => ({ minWidth: 48, minHeight: 48, maxWidth: '44%', justifyContent: 'center', alignItems: 'flex-end', opacity: pressed ? .6 : 1 })}>
        <T size={12} muted numberOfLines={2} style={{ textAlign: 'right' }}>{meal.restaurant.name}</T>
      </Pressable>
    </View>
    {wide ? <View style={{ flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>{media}<View style={{ flex: 1, gap: 20, minWidth: 0 }}>{summary}{meal.dishes.length > 1 ? <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{meal.dishes.map((item, i) => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Mostrar ${item.name}`} accessibilityState={{ selected: index === i }} onPress={() => select(i)} style={{ padding: 3, borderWidth: 1.5, borderColor: index === i ? colors.ink : 'transparent', borderRadius: 8 }}><Photo uri={item.imageUrl} label={item.name} style={{ width: 42, height: 56, borderRadius: 5 }}/></Pressable>)}</View> : null}{relato}{actions}</View></View> : <View style={{ gap: 16 }}>{summary}{media}{relato}{actions}</View>}
  </View>;
}
