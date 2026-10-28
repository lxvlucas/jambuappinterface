import { useSyncExternalStore } from 'react';
import { Dimensions } from 'react-native';

const serverViewport = Object.freeze({ width: 390, height: 844, scale: 1, fontScale: 1 });
const snapshot = () => Dimensions.get('window');
const serverSnapshot = () => serverViewport;
const subscribe = (notify: () => void) => {
  const subscription = Dimensions.addEventListener('change', notify);
  return () => subscription.remove();
};
/** The first web render matches the server; native and subsequent renders use the real window. */
export function useViewport() { return useSyncExternalStore(subscribe, snapshot, serverSnapshot); }
