import Svg, { Path, Circle, Rect, SvgXml } from "react-native-svg";
import { kitIcons } from "./kit-icons";
import { useJambuTheme } from "@/design/theme";

export type IconName =
  | "bold"
  | "italic"
  | "expand"
  | "edit"
  | "link"
  | "quote"
  | "home"
  | "search"
  | "plus"
  | "book"
  | "bookmark"
  | "heart"
  | "comment"
  | "share"
  | "back"
  | "next"
  | "close"
  | "check"
  | "moon"
  | "sun"
  | "settings"
  | "pin"
  | "arrow"
  | "camera"
  | "more"
  | "logout"
  | "grid"
  | "list"
  | "minus"
  | "chevron"
  | "image";
const paths: Partial<Record<IconName, string[]>> = {
  link: [
    "m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0",
  ],
  quote: ["M4 5h6v7H6c0 3-1 5-3 6m11-13h6v7h-4c0 3-1 5-3 6"],
  home: ["m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"],
  plus: ["M12 5v14M5 12h14"],
  minus: ["M5 12h14"],
  book: [
    "M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15",
  ],
  bookmark: ["M6 3h12v18l-6-4-6 4Z"],
  heart: [
    "M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z",
  ],
  comment: [
    "M21 11.5a9 9 0 0 1-9.5 9 9.8 9.8 0 0 1-4-.9L3 21l1.4-4.5a9 9 0 1 1 16.6-5Z",
  ],
  share: ["M12 15V3m-4 4 4-4 4 4M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"],
  back: ["m14 5-7 7 7 7"],
  next: ["m9 5 7 7-7 7"],
  close: ["m6 6 12 12M6 18 18 6"],
  check: ["m5 12 4 4L19 6"],
  moon: ["M20.8 13a9 9 0 0 1-9.8-9.8A9 9 0 1 0 20.8 13Z"],
  sun: [
    "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
  ],
  pin: ["M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"],
  arrow: ["M5 12h14m-5-5 5 5-5 5"],
  camera: ["M3 7h4l2-3h6l2 3h4v14H3Z"],
  logout: ["M9 4H4v16h5m5-13 5 5-5 5m-6-5h11"],
  grid: ["M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z"],
  list: ["M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01"],
  chevron: ["m8 4 8 8-8 8"],
  image: ["m3 16 6-6 4 4 3-3 5 5"],
  settings: [
    "m9 3-.7 2.2-2 .9-2.1-.5-1.5 2.6 1.5 1.7-.2 2.2L2.5 14l1.5 2.6 2.2-.4 1.8 1.3.5 2.2h3l.8-2.1 2-.9 2.1.5 1.5-2.6-1.4-1.7.2-2.2 1.4-1.7-1.5-2.6-2.2.4-1.8-1.3L12 3Z",
  ],
};
export function Icon({
  name,
  size = 22,
  color,
  filled = false,
}: {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  const { colors } = useJambuTheme();
  const ink = color ?? colors.ink;
  const aliases: Partial<Record<IconName, keyof typeof kitIcons>> = {
    comment: "message-circle",
    back: "chevron-left",
    next: "chevron-right",
    close: "x",
    book: "book-open",
    pin: "map-pin",
    arrow: "arrow-right",
    more: "more-horizontal",
    logout: "log-out",
    chevron: "chevron-right",
    link: "link-2",
    quote: "book-open",
    expand: "maximize-2",
    edit: "edit-2",
  };
  const key = aliases[name] ?? name;
  if (key in kitIcons) {
    let xml = kitIcons[key as keyof typeof kitIcons].replaceAll("#171717", ink);
    if (filled && (name === "heart" || name === "bookmark"))
      xml = xml.replace('fill="none"', `fill="${ink}"`);
    return <SvgXml xml={xml} width={size} height={size} aria-hidden />;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      {name === "search" ? (
        <>
          <Circle cx="10.5" cy="10.5" r="6.5" stroke={ink} strokeWidth={1.7} />
          <Path
            d="m16 16 4.5 4.5"
            stroke={ink}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </>
      ) : null}
      {name === "more"
        ? [5, 12, 19].map((cx) => (
            <Circle key={cx} cx={cx} cy="12" r="1.4" fill={ink} />
          ))
        : null}
      {name === "image" ? (
        <Rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          stroke={ink}
          strokeWidth={1.7}
        />
      ) : null}
      {name === "sun" ||
      name === "pin" ||
      name === "camera" ||
      name === "settings" ? (
        <Circle
          cx="12"
          cy={name === "pin" ? 10 : name === "camera" ? 14 : 12}
          r={name === "sun" ? 4 : 3}
          stroke={ink}
          strokeWidth={1.7}
        />
      ) : null}
      {paths[name]?.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={ink}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={
            filled && (name === "heart" || name === "bookmark") ? ink : "none"
          }
        />
      ))}
    </Svg>
  );
}
