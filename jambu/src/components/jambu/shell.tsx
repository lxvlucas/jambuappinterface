import { useViewport } from '@/design/viewport';
import { router, usePathname, type Href } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode, type ComponentRef } from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJambuTheme } from '@/design/theme';
import { demoUser, useDemo } from '@/data/demo';
import { Icon, type IconName } from './icon';
import { Avatar, Brand, Button, IconButton, T } from './ui';

export const go = (path: string) => router.push(path as Href);
export function back() { if (router.canGoBack()) router.back(); else router.replace('/'); }
const navigation: { path: string; label: string; icon: IconName }[] = [
  { path: '/', label: 'Início', icon: 'home' }, { path: '/explore', label: 'Explorar', icon: 'search' },
  { path: '/diary', label: 'Meu diário', icon: 'book' }, { path: '/saved', label: 'Guardados', icon: 'bookmark' },
];
function Notice() {
  const { notice, setNotice } = useDemo(); const { colors, reducedMotion } = useJambuTheme();
  const [opacity] = useState(() => new Animated.Value(0));
  useEffect(() => { if (!notice) return; opacity.setValue(0); Animated.timing(opacity, { toValue: 1, duration: reducedMotion ? 0 : 160, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start(); const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice, opacity, reducedMotion, setNotice]);
  if (!notice) return null;
  return <Animated.View pointerEvents="none" style={{ position: 'absolute', bottom: 92, alignSelf: 'center', maxWidth: 360, marginHorizontal: 20, zIndex: 10, backgroundColor: colors.ink, borderRadius: 12, padding: 16, opacity }}><T size={14} style={{ color: colors.background }} accessibilityLiveRegion="polite">{notice}</T></Animated.View>;
}
export function AppFrame({ children }: { children: ReactNode }) {
  const { width } = useViewport(); const desktop = width >= 1000;
  const path = usePathname(); const { colors, dark, setPreference } = useJambuTheme(); const insets = useSafeAreaInsets();
  const bare = path === '/login';
  return <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'web' ? 0 : insets.top }}><View style={{ flex: 1, flexDirection: 'row' }}>
    {desktop && !bare ? <View style={{ width: 224, paddingTop: 35, paddingHorizontal: 24, paddingBottom: 24, borderRightWidth: 1, borderRightColor: colors.line }}>
      <Pressable onPress={() => go('/')} accessibilityLabel="Jambu, início" accessibilityRole="link"><Brand/></Pressable>
      <View style={{ marginTop: 52, gap: 7 }}>{navigation.map(item => { const active = path === item.path; return <Pressable key={item.path} accessibilityRole="link" accessibilityState={{ selected: active }} onPress={() => go(item.path)} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 50, paddingHorizontal: 14, borderRadius: 12, backgroundColor: active || pressed ? colors.surface : 'transparent' })}><Icon name={item.icon} color={active ? colors.ink : colors.muted}/><T size={16} weight={active ? '600' : '400'} muted={!active}>{item.label}</T></Pressable>; })}</View>
      <Button icon="plus" onPress={() => go('/new')} style={{ marginTop: 30, paddingHorizontal: 12 }}>Avaliar um prato</Button><View style={{ flex: 1 }}/>
      <View style={{ gap: 10 }}><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><T size={13} muted>{dark ? 'Tema escuro' : 'Tema claro'}</T><IconButton name={dark ? 'sun' : 'moon'} label={dark ? 'Usar tema claro' : 'Usar tema escuro'} onPress={() => setPreference(dark ? 'light' : 'dark')}/></View>
        <Pressable accessibilityRole="link" onPress={() => go('/diary')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><Avatar uri={demoUser.avatarUrl} name={demoUser.name} size={36}/><View style={{ flex: 1 }}><T size={13} weight="600">Spike Spiegel</T><T size={12} muted>Meu perfil</T></View><Icon name="chevron" size={17} color={colors.muted}/></Pressable>
        <Pressable accessibilityRole="link" onPress={() => go('/settings')} style={{ minHeight: 40, justifyContent: 'center' }}><T size={12} muted>Ajustes · Dados de demonstração</T></Pressable>
      </View>
    </View> : null}
    <View style={{ flex: 1, minWidth: 0 }}>
      {!desktop && !bare ? <View style={{ height: 68, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background }}><Pressable onPress={() => go('/')} accessibilityRole="link" accessibilityLabel="Jambu, início"><Brand compact/></Pressable><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><IconButton name={dark ? 'sun' : 'moon'} label={dark ? 'Usar tema claro' : 'Usar tema escuro'} onPress={() => setPreference(dark ? 'light' : 'dark')}/><Pressable accessibilityRole="link" accessibilityLabel="Abrir ajustes" onPress={() => go('/settings')} style={{ minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}><Avatar uri={demoUser.avatarUrl} name={demoUser.name} size={30}/></Pressable></View></View> : null}
      <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
      {!desktop && !bare && path !== '/new' ? <View style={{ flexDirection: 'row', backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.line, paddingBottom: Math.max(insets.bottom, 10), paddingTop: 6 }}>
        {[navigation[0], navigation[1], { path: '/new', label: 'Avaliar', icon: 'plus' as const }, { ...navigation[2], label: 'Diário' }].map(item => <Pressable key={item.path} accessibilityRole="link" accessibilityLabel={item.label} accessibilityState={{ selected: path === item.path }} onPress={() => go(item.path)} style={({ pressed }) => ({ flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', gap: 3, opacity: pressed ? .6 : 1 })}><View style={{ paddingHorizontal: item.path === '/new' ? 15 : 0, paddingVertical: 3, borderRadius: 9, backgroundColor: item.path === '/new' ? colors.action : 'transparent' }}><Icon name={item.icon} size={22} color={item.path === '/new' ? colors.onAction : path === item.path ? colors.ink : colors.muted}/></View><T size={11} weight={path === item.path ? '600' : '400'} muted={path !== item.path}>{item.label}</T></Pressable>)}
      </View> : null}
    </View>
  </View><Notice/></View>;
}
export function Screen({ children, title, subtitle, backButton, action, narrow = false, end = false }: { children: ReactNode; title?: string; subtitle?: string; backButton?: boolean; action?: ReactNode; narrow?: boolean; end?: boolean }) {
  const { width } = useViewport(); const { colors } = useJambuTheme();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null); const scrolled = useRef(false);
  return <ScrollView ref={scroll} onContentSizeChange={()=>{if(end&&!scrolled.current){scrolled.current=true;scroll.current?.scrollToEnd({animated:false});}}} style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ width: '100%', maxWidth: narrow ? 820 : 1168, alignSelf: 'center', paddingHorizontal: width < 600 ? 20 : 36, paddingTop: width < 600 ? 14 : 38, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
    {title ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: subtitle ? 26 : 24 }}>{backButton ? <IconButton name="back" label="Voltar" onPress={back} style={{ marginLeft: -14 }}/>: null}<View style={{ flex: 1 }}><T accessibilityRole="header" size={width < 600 ? 25 : 29} weight="600" style={{ letterSpacing: -.6 }}>{title}</T>{subtitle ? <T size={14} muted style={{ marginTop: 5 }}>{subtitle}</T> : null}</View>{action}</View> : null}{children}
  </ScrollView>;
}
