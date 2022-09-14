import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

/**
 * Similar to `useEffect` but the `effect` only run if component is mounted.
 * Note that it works only if react StrictMode is disabled
 */
export default function useComponentDidUpdate(effect: EffectCallback, deps: DependencyList): void {
  const mounted = useRef<boolean>();

  useEffect(() => {
    if (mounted.current) {
      const cleanup = effect();
      return cleanup;
    }
    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
