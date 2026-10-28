import { useEffect, useRef, type ComponentRef } from "react";
import { Text, TextInput } from "react-native";
import { useJambuTheme } from "@/design/theme";
import { reviewSegments } from "@/domain/review-document";
import type { ReviewEditing } from "./review-editing";
export function RichInput({ editor }: { editor: ReviewEditing }) {
  const { colors } = useJambuTheme();
  const ref = useRef<ComponentRef<typeof TextInput>>(null);
  const { registerFocus, select }=editor;
  useEffect(()=>{
    registerFocus((selection)=>{
      ref.current?.focus();
      if (selection) requestAnimationFrame(()=>{
        ref.current?.setNativeProps({selection});
        select(selection);
      });
    });
    return()=>registerFocus(null);
  },[registerFocus,select]);
  return (
    <TextInput
      ref={ref}
      accessibilityLabel="Escrever review"
      placeholder="O sabor, a textura, o que ficou na memória…"
      placeholderTextColor={colors.muted}
      multiline
      maxLength={5000}
      selection={editor.selection}
      onSelectionChange={(event) => editor.select(event.nativeEvent.selection)}
      onChangeText={editor.changeText}
      cursorColor={colors.action}
      selectionColor={colors.action}
      underlineColorAndroid="transparent"
      style={{
        flex: 1,
        minHeight: 240,
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 0,
        borderRadius: 0,
        color: colors.ink,
        backgroundColor: "transparent",
        fontFamily: "Figtree",
        fontSize: 17,
        lineHeight: 26,
        textAlignVertical: "top",
      }}
    >
      {editor.document.text ? (
        <Text>
          {reviewSegments(editor.document).map((segment) => (
            <Text
              key={segment.start}
              style={{
                fontWeight: segment.marks.some((mark) => mark.type === "bold")
                  ? "600"
                  : "400",
                fontStyle: segment.marks.some((mark) => mark.type === "italic")
                  ? "italic"
                  : "normal",
                color: segment.marks.some(
                  (mark) => mark.type === "dish" || mark.type === "link",
                )
                  ? colors.action
                  : colors.ink,
                textDecorationLine: segment.marks.some(
                  (mark) => mark.type === "dish" || mark.type === "link",
                )
                  ? "underline"
                  : "none",
              }}
            >
              {segment.text}
            </Text>
          ))}
        </Text>
      ) : null}
    </TextInput>
  );
}
