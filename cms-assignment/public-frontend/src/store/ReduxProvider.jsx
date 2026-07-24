'use client';

import { Provider } from 'react-redux';
import { useRef } from 'react';
import { makeStore } from './store';

// One store instance per browser tab, created lazily on the client so
// Server Components never touch Redux — it only wraps the client-interactive
// parts of the tree (see uiSlice.js for why there's so little state here).
export default function ReduxProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) storeRef.current = makeStore();
  return <Provider store={storeRef.current}>{children}</Provider>;
}
