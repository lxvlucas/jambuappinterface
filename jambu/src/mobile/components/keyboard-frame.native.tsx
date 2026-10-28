import type { PropsWithChildren } from "react";
import type { ViewProps } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
export function KeyboardFrame({
  children,
  pointerEvents,
}: PropsWithChildren<Pick<ViewProps, "pointerEvents">>) {
  return (
    <KeyboardAvoidingView
      pointerEvents={pointerEvents}
      style={{ flex: 1 }}
      behavior="padding"
      automaticOffset
    >
      {children}
    </KeyboardAvoidingView>
  );
}
