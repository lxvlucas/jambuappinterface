import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Alert } from "react-native";
import type { JambuRepository } from "@/domain/jambu";
import { MemoryJambuRepository } from "./memory-repository";
import {
  collections,
  currentUser,
  fixtureMeals,
  restaurants,
} from "./fixtures";

const RepositoryContext = createContext<JambuRepository | null>(null);
export function JambuProvider({
  children,
  repository,
}: {
  children: ReactNode;
  repository?: JambuRepository;
}) {
  const [fallback] = useState(
    () =>
      new MemoryJambuRepository(
        fixtureMeals,
        currentUser,
        restaurants,
        collections,
      ),
  );
  const source = repository ?? fallback;
  const guarded = useMemo<JambuRepository>(() => {
    const protect =
      (action: (id: string) => Promise<void>) => async (id: string) => {
        try {
          await action(id);
        } catch (error) {
          Alert.alert(
            "Não foi possível atualizar",
            error instanceof Error ? error.message : "Tente novamente.",
          );
        }
      };
    return {
      getSnapshot: () => source.getSnapshot(),
      subscribe: (listener) => source.subscribe(listener),
      publish: (draft) => source.publish(draft),
      addComment: (id, text, parentId) => source.addComment(id, text, parentId),
      toggleLike: protect((id) => source.toggleLike(id)),
      toggleMeal: protect((id) => source.toggleMeal(id)),
      toggleFollow: protect((id) => source.toggleFollow(id)),
      toggleRestaurant: protect((id) => source.toggleRestaurant(id)),
      toggleCollection: protect((id) => source.toggleCollection(id)),
    };
  }, [source]);
  return (
    <RepositoryContext.Provider value={guarded}>
      {children}
    </RepositoryContext.Provider>
  );
}
export function useJambu() {
  const repository = useContext(RepositoryContext);
  if (!repository) throw new Error("JambuProvider ausente.");
  const state = useSyncExternalStore(
    repository.subscribe,
    repository.getSnapshot,
    repository.getSnapshot,
  );
  return { state, repository, user: state.currentUser };
}
