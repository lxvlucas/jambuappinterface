import type { GrowingInputHandle } from "./growing-input-types";
import {
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
  type ComponentRef,
} from "react";
import { TextInput, type TextInputProps } from "react-native";
import { useJambuTheme } from "@/design/theme";
export const GrowingInput = forwardRef<GrowingInputHandle, TextInputProps>(
  function GrowingInput(props, ref) {
    const input = useRef<ComponentRef<typeof TextInput>>(null);
    useImperativeHandle(
      ref,
      () => ({ focus: () => input.current?.focus() }),
      [],
    );
    const { colors } = useJambuTheme();
    const [height, setHeight] = useState(25);
    return (
      <TextInput
        {...props}
        ref={input}
        multiline
        maxLength={1000}
        placeholderTextColor={colors.muted}
        underlineColorAndroid="transparent"
        cursorColor={colors.action}
        onContentSizeChange={(event) =>
          setHeight(
            Math.max(28, Math.min(124, Math.ceil(event.nativeEvent.contentSize.height) + 8)),
          )
        }
        style={{
          width: "100%",
          height: props.value ? height : 28,
          maxHeight: 124,
          fontFamily: "Figtree",
          fontSize: 16,
          lineHeight: 24,
          padding: 0,
          paddingVertical: 4,
          includeFontPadding: false,
          color: colors.ink,
          textAlignVertical: "top",
        }}
      />
    );
  },
);
