import { useState, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import { useJambuTheme } from "@/design/theme";
import { formatRating, starFractions } from "@/domain/jambu";
import { pictures } from "../data/pictures";
import { T, IconButton } from "@/components/jambu/ui";
import { Icon } from "@/components/jambu/icon";

export { T, IconButton };
export function Photo({
  uri,
  label,
  style,
  fit = "cover",
}: {
  uri: string;
  label: string;
  style?: StyleProp<ViewStyle>;
  fit?: "cover" | "contain";
}) {
  const { colors } = useJambuTheme();
  const [failedUri, setFailedUri] = useState<string | null>(null);
  return (
    <View
      style={[{ overflow: "hidden", backgroundColor: colors.surface }, style]}
    >
      {failedUri === uri ? (
        <View style={styles.fallback}>
          <Icon name="image" color={colors.muted} />
          <T size={12} muted>
            Foto indisponível
          </T>
        </View>
      ) : (
        <Image
          source={pictures[uri] ?? { uri }}
          draggable={false}
          accessibilityLabel={label}
          contentFit={fit}
          cachePolicy="memory-disk"
          recyclingKey={uri}
          style={StyleSheet.absoluteFill}
          onError={() => setFailedUri(uri)}
        />
      )}
    </View>
  );
}
export function Avatar({
  person,
  size = 36,
}: {
  person: { name: string; avatarUrl: string };
  size?: number;
}) {
  return (
    <Photo
      uri={person.avatarUrl}
      label={`Foto de ${person.name}`}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}
const starPath =
  "m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3L2.9 9.4l6.3-.9Z";
export function RatingStar({
  fraction,
  size = 18,
  inverse = false,
  color,
}: {
  fraction: number;
  size?: number;
  inverse?: boolean;
  color?: string;
}) {
  const { colors } = useJambuTheme();
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={starPath} fill={inverse ? "#687068" : colors.emptyStar} />
      </Svg>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size * Math.max(0, Math.min(1, fraction)),
          height: size,
          overflow: "hidden",
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d={starPath} fill={color ?? colors.yellow} />
        </Svg>
      </View>
    </View>
  );
}
export function Rating({
  value,
  size = 18,
  numeric = true,
  inverse = false,
}: {
  value: number;
  size?: number;
  numeric?: boolean;
  inverse?: boolean;
}) {
  const { colors } = useJambuTheme();
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Nota ${formatRating(value)} de 5 estrelas`}
      style={styles.rating}
    >
      {numeric ? (
        <T
          size={size + 1}
          weight="600"
          style={{
            color: inverse ? "#FFFFFF" : colors.ink,
            fontVariant: ["tabular-nums"],
          }}
        >
          {formatRating(value)}
        </T>
      ) : null}
      <View style={styles.stars} aria-hidden>
        {starFractions(value).map((fraction, index) => (
          <RatingStar
            key={index}
            fraction={fraction}
            size={size}
            inverse={inverse}
          />
        ))}
      </View>
    </View>
  );
}
export function ChoiceSeal({ compact = false }: { compact?: boolean }) {
  const { colors } = useJambuTheme();
  return (
    <View
      accessibilityLabel="User’s Choice, prato favorito desta publicação"
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: compact ? 4 : 7,
        alignSelf: "flex-start",
        backgroundColor: colors.yellow,
        borderRadius: compact ? 7 : 10,
        paddingHorizontal: compact ? 7 : 11,
        paddingVertical: compact ? 4 : 8,
      }}
    >
      <Svg
        width={compact ? 14 : 18}
        height={compact ? 14 : 18}
        viewBox="0 0 24 24"
      >
        <Path
          d="m12 2 2.6 3.3 4.2.7.7 4.2L23 13l-3.5 2.5-.7 4.2-4.2.7L12 24l-2.6-3.6-4.2-.7-.7-4.2L1 13l3.5-2.8.7-4.2 4.2-.7Z"
          fill="#072C0D"
        />
        <Path
          d="m7.5 12 3 3 6-6"
          fill="none"
          stroke="#FFCE0F"
          strokeWidth={2}
        />
      </Svg>
      <T size={compact ? 11 : 12} weight="600" style={{ color: "#072C0D" }}>
        User’s Choice
      </T>
    </View>
  );
}
export function Tabs({
  items,
  value,
  onChange,
}: {
  items: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { colors } = useJambuTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.tabs,
        { backgroundColor: colors.background, borderBottomColor: colors.line },
      ]}
    >
      {items.map((item) => (
        <Pressable
          key={item}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === item }}
          onPress={() => onChange(item)}
          style={{
            flex: 1,
            minHeight: 48,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: value === item ? colors.ink : "transparent",
          }}
        >
          <T
            size={14}
            weight={value === item ? "600" : "400"}
            muted={value !== item}
          >
            {item}
          </T>
        </Pressable>
      ))}
    </View>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Busque um lugar",
  label = placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const { colors } = useJambuTheme();
  return (
    <View style={[styles.search, { backgroundColor: colors.surface }]}>
      <Icon name="search" size={20} color={colors.muted} />
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        returnKeyType="search"
        style={{
          flex: 1,
          minHeight: 48,
          fontFamily: "Figtree",
          fontSize: 16,
          color: colors.ink,
        }}
      />
      {value ? (
        <IconButton
          name="close"
          label="Limpar busca"
          onPress={() => onChange("")}
        />
      ) : null}
    </View>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const { colors } = useJambuTheme();
  return (
    <View style={{ gap: 8 }}>
      <T size={14} weight="600">
        {label}
      </T>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[
          {
            color: colors.ink,
            backgroundColor: colors.surface,
            fontFamily: "Figtree",
            fontSize: 17,
            minHeight: 56,
            padding: 16,
            borderRadius: 12,
            textAlignVertical: "top",
          },
          props.style,
        ]}
      />
    </View>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={{ padding: 28, gap: 10 }}>
      <T size={19} weight="600">
        {title}
      </T>
      <T size={15} muted>
        {children}
      </T>
    </View>
  );
}
const styles = StyleSheet.create({
  fallback: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  rating: { flexDirection: "row", alignItems: "center", gap: 7 },
  stars: { flexDirection: "row", gap: 1 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, paddingHorizontal: 16 },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    paddingLeft: 14,
  },
});
