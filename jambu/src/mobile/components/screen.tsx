import type { ReactNode } from "react";
import { ScrollView, View, type ScrollViewProps } from "react-native";
import { useJambuTheme } from "@/design/theme";
import { goBack } from "../navigation";
import { IconButton, T } from "./primitives";

export function Page({ children }: { children: ReactNode }) {
  const { colors } = useJambuTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </View>
  );
}
export function PageScroll({ children, ...props }: ScrollViewProps) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ paddingBottom: 32 }}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
export function PageBar({
  title,
  onBack = goBack,
  action,
}: {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
}) {
  return (
    <View
      style={{
        minHeight: 52,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      <IconButton name="back" label="Voltar" onPress={onBack} />
      <T size={18} weight="600" style={{ flex: 1 }} numberOfLines={1}>
        {title}
      </T>
      {action}
    </View>
  );
}
