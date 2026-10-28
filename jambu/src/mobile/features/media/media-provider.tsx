import { createContext, useContext, useState, type ReactNode } from "react";
import { Keyboard } from "react-native";
import { DarkSurface } from "@/design/theme";
import { MediaViewer } from "./media-viewer";
type Selection = { mealId: string; index: number };
const Context = createContext<{
  open: (mealId: string, index?: number) => void;
  close: () => void;
} | null>(null);
export function MediaProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const close = () => {
    Keyboard.dismiss();
    setSelection(null);
  };
  return (
    <Context.Provider
      value={{
        open: (mealId, index = 0) => setSelection({ mealId, index }),
        close,
      }}
    >
      {children}
      {selection ? (
        <DarkSurface>
          <MediaViewer selection={selection} onClose={close} />
        </DarkSurface>
      ) : null}
    </Context.Provider>
  );
}
export function useMedia() {
  const media = useContext(Context);
  if (!media) throw new Error("MediaProvider ausente");
  return media;
}
