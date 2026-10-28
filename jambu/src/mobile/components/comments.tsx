import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import type { Comment, Meal } from "@/domain/jambu";
import { useJambuTheme } from "@/design/theme";
import { Icon } from "@/components/jambu/icon";
import { useJambu } from "../data/provider";
import { Avatar, IconButton, T } from "./primitives";
import type { GrowingInputHandle } from "./growing-input-types";
import { GrowingInput } from "./growing-input";
import { Identity } from "./identity";

export type CommentComposerHandle = { reply: (comment: Comment) => void };
export const CommentComposer = forwardRef<
  CommentComposerHandle,
  { meal: Meal; onSent?: () => void; floating?: boolean }
>(function CommentComposer({ meal, onSent, floating = false }, ref) {
  const { user, repository } = useJambu();
  const { colors } = useJambuTheme();
  const [text, setText] = useState("");
  const [reply, setReply] = useState<Comment | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<GrowingInputHandle>(null);
  useImperativeHandle(
    ref,
    () => ({
      reply: (comment) => {
        setReply(comment);
        input.current?.focus();
      },
    }),
    [],
  );
  const send = async () => {
    if (sending || !text.trim()) return;
    setSending(true);
    setError("");
    try {
      await repository.addComment(meal.id, text, reply?.id);
      setText("");
      setReply(null);
      onSent?.();
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível comentar. Tente de novo.",
      );
    } finally {
      setSending(false);
    }
  };
  return (
    <View
      style={{
        paddingHorizontal: floating ? 0 : 12,
        paddingVertical: floating ? 0 : 8,
        gap: 5,
        backgroundColor: floating ? "transparent" : colors.background,
        borderTopWidth: floating ? 0 : 1,
        borderTopColor: colors.line,
      }}
    >
      {reply ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 12,
          }}
        >
          <T size={12} muted style={{ flex: 1 }}>
            Respondendo a {reply.username}
          </T>
          <IconButton
            name="close"
            label="Cancelar resposta"
            onPress={() => setReply(null)}
          />
        </View>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 10,
          backgroundColor: floating ? "rgba(30,34,30,0.88)" : colors.surface,
          paddingLeft: 10,
          paddingRight: 4,
          paddingVertical: 2,
          borderRadius: 30,
          minHeight: 56,
          borderWidth: floating ? 1 : 0,
          borderColor: "rgba(255,255,255,0.2)",
        }}
      >
        <View style={{ height: 48, justifyContent: "center" }}>
          <Avatar person={user} size={30} />
        </View>
        <View style={{ flex: 1, paddingVertical: 6 }}>
          <GrowingInput
            ref={input}
            accessibilityLabel={
              reply ? `Responder a ${reply.name}` : "Escrever comentário"
            }
            placeholder={reply ? "Escreva sua resposta" : "O que você achou?"}
            value={text}
            onChangeText={setText}
            editable={!sending}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            sending ? "Enviando comentário" : "Enviar comentário"
          }
          disabled={!text.trim() || sending}
          onPress={() => {
            void send();
          }}
          style={({ pressed }) => ({
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            opacity: !text.trim() || sending ? 0.35 : pressed ? 0.65 : 1,
          })}
        >
          <Icon name="arrow" size={21} color={colors.action} />
        </Pressable>
      </View>
      {error ? (
        <T
          size={13}
          style={{ color: colors.error }}
          accessibilityLiveRegion="polite"
        >
          {error}
        </T>
      ) : null}
    </View>
  );
});
export function CommentList({
  meal,
  onReply,
}: {
  meal: Meal;
  onReply: (comment: Comment) => void;
}) {
  const ordered: { comment: Comment; depth: number }[] = [];
  const used = new Set<string>();
  const append = (comment: Comment, depth: number) => {
    if (used.has(comment.id)) return;
    used.add(comment.id);
    ordered.push({ comment, depth });
    meal.comments
      .filter((value) => value.parentId === comment.id)
      .forEach((child) => append(child, 1));
  };
  meal.comments
    .filter((comment) => !comment.parentId)
    .forEach((comment) => append(comment, 0));
  meal.comments
    .filter((comment) => !used.has(comment.id))
    .forEach((comment) => append(comment, 0));
  return (
    <View style={{ gap: 20, paddingVertical: 12 }}>
      {ordered.map(({ comment, depth }) => (
        <View
          key={comment.id}
          style={{ flexDirection: "row", gap: 10, marginLeft: depth ? 40 : 0 }}
        >
          <Avatar person={comment} size={depth ? 30 : 36} />
          <View style={{ flex: 1, gap: 4 }}>
            <Identity person={comment} />
            <T size={16} style={{ lineHeight: 24 }}>
              {comment.text}
            </T>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <T size={12} muted>
                {comment.timeAgo}
              </T>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Responder a ${comment.name}`}
                onPress={() => onReply(comment)}
                style={{ minHeight: 48, justifyContent: "center" }}
              >
                <T size={13} muted>
                  Responder
                </T>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
      {!meal.comments.length ? (
        <T size={14} muted>
          Comece a conversa sobre esse prato.
        </T>
      ) : null}
    </View>
  );
}
