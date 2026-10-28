import type { PropsWithChildren } from "react";
import { View, type ViewProps } from "react-native";
export function KeyboardFrame({
  children,
  pointerEvents,
}: PropsWithChildren<Pick<ViewProps, "pointerEvents">>) {
  return (
    <View pointerEvents={pointerEvents} style={{ flex: 1 }}>
      {children}
    </View>
  );
}
