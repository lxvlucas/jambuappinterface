import type { GrowingInputHandle } from "./growing-input-types";
import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
} from "react";
import type { TextInputProps } from "react-native";
import { useJambuTheme } from "@/design/theme";
export const GrowingInput = forwardRef<GrowingInputHandle, TextInputProps>(
  function GrowingInput(props, forwarded) {
    const ref = useRef<HTMLTextAreaElement | null>(null);
    useImperativeHandle(
      forwarded,
      () => ({ focus: () => ref.current?.focus() }),
      [],
    );
    const { colors } = useJambuTheme();
    useLayoutEffect(() => {
      if (ref.current) {
        ref.current.style.height = "25px";
        ref.current.style.height =
          Math.min(124, ref.current.scrollHeight) + "px";
      }
    }, [props.value]);
    return (
      <textarea
        ref={ref}
        aria-label={props.accessibilityLabel}
        className="jambu-comment-input"
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.editable === false}
        maxLength={1000}
        rows={1}
        onChange={(event) => props.onChangeText?.(event.target.value)}
        style={{
          flex: "none",
          width: "100%",
          minWidth: 0,
          minHeight: 25,
          maxHeight: 124,
          border: 0,
          resize: "none",
          padding: 0,
          margin: 0,
          background: "transparent",
          fontFamily: "Figtree",
          fontSize: 16,
          lineHeight: "24px",
          color: colors.ink,
          caretColor: colors.action,
          colorScheme: colors.background === "#101110" ? "dark" : "light",
        }}
      />
    );
  },
);
