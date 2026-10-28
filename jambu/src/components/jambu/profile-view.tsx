import { useViewport } from '@/design/viewport';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { demoUser, useDemo } from '@/data/demo';
import type { Person } from '@/data/models';
import { useJambuTheme } from '@/design/theme';
import { Screen, go } from './shell';
import { Avatar, Button, EmptyState, Photo, Stars, T } from './ui';
import { MealCard } from './meal-card';

export function ProfileView({ person, own = false }: { person: Person; own?: boolean }) {
  const demo = useDemo(); const { colors } = useJambuTheme(); const { width } = useViewport();
  const [view, setView] = useState('Pratos'); const [container, setContainer] = useState(Math.min(width-40,1000));
  const meals = demo.meals.filter(meal=>meal.user.id===person.id); const dishes = meals.flatMap(meal=>meal.dishes.map((dish,index)=>({dish,meal,index})));
  const columns=width<600?2:3; const cell=(container-(columns-1)*16)/columns;
  return <Screen title={own?'Meu diário':'Perfil'} backButton={!own}>
    <View style={{gap:20,marginBottom:32}}><View style={{flexDirection:'row',gap:18,alignItems:'center'}}><Avatar uri={person.avatarUrl} name={person.name} size={76}/><View style={{flex:1}}><T size={25} weight="600" style={{letterSpacing:-.5}}>{person.name}</T><T size={14} muted>{person.username}</T></View></View><T style={{maxWidth:580}}>{person.bio}</T><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12}}><T size={14} muted>{dishes.length} {dishes.length===1?'prato registrado':'pratos registrados'} · {meals.length} {meals.length===1?'refeição':'refeições'}</T>{person.id!==demoUser.id?<Button variant={demo.followed.includes(person.id)?'secondary':'primary'} onPress={()=>demo.toggleFollow(person.id)}>{demo.followed.includes(person.id)?'Seguindo':'Seguir'}</Button>:null}</View></View>
    <View style={{flexDirection:'row',gap:24,borderBottomWidth:1,borderBottomColor:colors.line,marginBottom:24}}>{['Pratos','Refeições'].map(label=><Pressable key={label} accessibilityRole="tab" accessibilityState={{selected:view===label}} onPress={()=>setView(label)} style={{minHeight:48,justifyContent:'center',borderBottomWidth:2,borderBottomColor:view===label?colors.ink:'transparent',marginBottom:-1}}><T size={15} weight={view===label?'600':'400'} muted={view!==label}>{label}</T></Pressable>)}</View>
    {view==='Pratos'?<View onLayout={e=>setContainer(e.nativeEvent.layout.width)} style={{flexDirection:'row',flexWrap:'wrap',gap:16}}>{dishes.map(({dish,meal,index})=><Pressable key={dish.id} accessibilityRole="link" accessibilityLabel={'Ver '+dish.name} onPress={()=>go('/meal/'+meal.id+'?dish='+index)} style={{width:cell,gap:9,marginBottom:16}}><Photo uri={dish.imageUrl} label={dish.name} style={{width:cell,height:cell*4/3,borderRadius:12}}/><T size={15} weight="600" numberOfLines={2}>{dish.name}</T><Stars value={dish.rating} size={14}/><T size={12} muted>{meal.timeAgo}</T></Pressable>)}</View>:meals.map(meal=><MealCard key={meal.id} meal={meal}/>)}
    {!meals.length?<EmptyState title="Toda memória começa com um prato" message="As experiências registradas aparecem aqui." action={own?'Avaliar um prato':undefined} onPress={own?()=>go('/new'):undefined}/>:null}
  </Screen>;
}
