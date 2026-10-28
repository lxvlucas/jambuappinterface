import { View } from "react-native";
import { T } from "./primitives";

export function Identity({
  person,
  time,
  stacked = false,
}: {
  person: { name: string; username: string };
  time?: string;
  stacked?: boolean;
}) {
  return (
    <View style={{ flexShrink: 1, minWidth: 0, gap: 0 }}>
      <View
        style={{
          flexDirection: stacked ? "column" : "row",
          alignItems: stacked ? "flex-start" : "baseline",
          gap: stacked ? 0 : 4,
          minWidth: 0,
        }}
      >
        <T
          size={16}
          weight="600"
          numberOfLines={1}
          style={{ flexShrink: 1, maxWidth: stacked ? "100%" : "57%" }}
        >
          {person.name}
        </T>
        <T size={14} muted numberOfLines={1} style={{ flexShrink: 1 }}>
          {person.username}
        </T>
      </View>
      {time ? (
        <T size={12} muted>
          {time}
        </T>
      ) : null}
    </View>
  );
}
