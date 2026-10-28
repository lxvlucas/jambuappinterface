import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { useJambuTheme } from "@/design/theme";
import { Icon } from "@/components/jambu/icon";
export function ChoiceToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { colors, reducedMotion } = useJambuTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      aria-checked={value}
      accessibilityLabel="Marcar este prato como minha escolha"
      onPress={() => onChange(!value)}
      style={{
        minWidth: 64,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 54,
          height: 32,
          borderRadius: 16,
          backgroundColor: value ? colors.action : colors.outline,
          padding: 4,
        }}
      >
        <Animated.View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: value ? colors.onAction : "#ffffff",
            alignItems: "center",
            justifyContent: "center",
            transform: [{ translateX: value ? 22 : 0 }],
            transitionProperty: "transform",
            transitionDuration: reducedMotion ? 0 : 150,
            transitionTimingFunction: "ease-out",
          }}
        >
          {value ? <Icon name="check" size={16} color={colors.action} /> : null}
        </Animated.View>
      </View>
    </Pressable>
  );
}
