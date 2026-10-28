import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
export function EdgeShade({ top = false }: { top?: boolean }) {
  const id = useId().replaceAll(":", "");
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient
            id={id}
            x1="0"
            y1={top ? "0" : "1"}
            x2="0"
            y2={top ? "1" : "0"}
          >
            <Stop offset="0" stopColor="#000" stopOpacity={0.94} />
            <Stop offset={0.6} stopColor="#000" stopOpacity={0.72} />
            <Stop offset="1" stopColor="#000" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
