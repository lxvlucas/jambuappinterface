import { Image } from 'expo-image';
import { useId, useState, type ReactNode } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, type TextProps, type TextInputProps, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Defs, ClipPath, Rect, SvgXml } from 'react-native-svg';
import { useJambuTheme } from '@/design/theme';
import { brandSvg } from '@/design/brand';
import { pictures } from '@/data/pictures';
import { score } from '@/data/models';
import { Icon, type IconName } from './icon';

export function T({ children, size = 16, weight = '400', muted = false, style, ...props }: TextProps & { size?: number; weight?: '400' | '500' | '600' | '700'; muted?: boolean }) {
  const { colors } = useJambuTheme();
  return <Text {...props} style={[{ fontFamily: 'Figtree', fontSize: size, fontWeight: weight, lineHeight: Math.round(size * 1.45), color: muted ? colors.muted : colors.ink }, style]}>{children}</Text>;
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }} accessibilityLabel="Jambu"><SvgXml xml={brandSvg} width={compact ? 28 : 34} height={compact ? 28 : 34}/><T size={compact ? 31 : 36} weight="600" style={{ letterSpacing: -1.5, lineHeight: 45 }}>jambu</T></View>;
}
export function Photo({ uri, label, style }: { uri: string; label: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useJambuTheme(); const [failed, setFailed] = useState(false);
  return <View style={[{ overflow: 'hidden', backgroundColor: colors.surface }, style]}>{failed ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}><Icon name="image" color={colors.muted}/><T size={13} muted>Foto indisponível</T></View> : <Image source={pictures[uri] ?? { uri }} contentFit="cover" style={StyleSheet.absoluteFill} accessibilityLabel={label} onError={() => setFailed(true)}/>}</View>;
}
export function Avatar({ uri, name, size = 40 }: { uri: string; name: string; size?: number }) { return <Photo uri={uri} label={`Foto de ${name}`} style={{ width: size, height: size, borderRadius: size / 2 }}/>; }
export function IconButton({ name, label, onPress, active = false, color, style }: { name: IconName; label: string; onPress: () => void; active?: boolean; color?: string; style?: StyleProp<ViewStyle> }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active }} onPress={onPress} style={({ pressed }) => [{ minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', opacity: pressed ? .65 : 1 }, style]}><Icon name={name} color={color} filled={active}/></Pressable>;
}
export function Button({ children, onPress, variant = 'primary', icon, disabled, style }: { children: ReactNode; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; icon?: IconName; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors } = useJambuTheme(); const foreground = variant === 'primary' ? colors.onAction : colors.ink;
  return <Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{ disabled }} onPress={onPress} style={({ pressed }) => [{ minHeight: 48, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, backgroundColor: variant === 'primary' ? colors.action : variant === 'secondary' ? colors.surface : 'transparent', opacity: disabled ? .5 : pressed ? .85 : 1, transform: [{ scale: pressed ? .97 : 1 }] }, style]}>{icon ? <Icon name={icon} size={19} color={foreground}/> : null}<T size={15} weight="600" style={{ color: foreground }}>{children}</T></Pressable>;
}
export function Field({ label, error, style, ...props }: TextInputProps & { label: string; error?: string }) {
  const { colors } = useJambuTheme(); const [focused, setFocused] = useState(false);
  return <View style={{ gap: 7 }}><T size={14} weight="500">{label}</T><TextInput {...props} accessibilityLabel={label} placeholderTextColor={colors.muted} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={[{ fontFamily: 'Figtree', fontSize: 16, color: colors.ink, minHeight: 52, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 1, borderColor: error ? colors.error : focused ? colors.action : colors.outline, backgroundColor: colors.background, textAlignVertical: props.multiline ? 'top' : 'center' }, style]}/>{error ? <T size={13} accessibilityLiveRegion="polite" style={{ color: colors.error }}>{error}</T> : null}</View>;
}
const star = 'm12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3L2.9 9.4l6.3-.9Z';
export function Stars({ value, size = 18, numeric = true }: { value: number; size?: number; numeric?: boolean }) {
  const { colors } = useJambuTheme(); const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return <View accessible accessibilityRole="image" accessibilityLabel={`Nota ${score(value)} de 5 estrelas`} style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }}>{numeric ? <T size={size + 3} weight="600" style={{ fontVariant: ['tabular-nums'] }}>{score(value)}</T> : null}<View style={{ flexDirection: 'row', gap: 1 }} aria-hidden>{[0,1,2,3,4].map(i => <Svg key={i} width={size} height={size} viewBox="0 0 24 24"><Defs><ClipPath id={`${id}-${i}`}><Rect width={24 * Math.max(0, Math.min(1, value - i))} height={24}/></ClipPath></Defs><Path d={star} fill={colors.emptyStar}/><Path d={star} fill={colors.yellow} clipPath={`url(#${id}-${i})`}/></Svg>)}</View></View>;
}
export function Again() { const { colors } = useJambuTheme(); return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Icon name="check" size={15} color={colors.positive}/><T size={12} weight="500" style={{ color: colors.positive }}>Comeria de novo</T></View>; }
export function EmptyState({ title, message, action, onPress }: { title: string; message: string; action?: string; onPress?: () => void }) { const { colors } = useJambuTheme(); return <View style={{ alignItems: 'center', paddingVertical: 64, paddingHorizontal: 24, gap: 12, backgroundColor: colors.surface, borderRadius: 16 }}><Icon name="book" size={32} color={colors.muted}/><T size={21} weight="600" style={{ textAlign: 'center' }}>{title}</T><T muted style={{ textAlign: 'center', maxWidth: 350 }}>{message}</T>{action && onPress ? <Button onPress={onPress} style={{ marginTop: 10 }}>{action}</Button> : null}</View>; }
