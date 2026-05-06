import { useState, useCallback } from 'react';

/**
 * Generic hook for async operations with loading/error/data state.
 */
export function useAsync(asyncFn, immediate = false) {
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await asyncFn(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (err) {
        setState({ data: null, loading: false, error: err.message });
        throw err;
      }
    },
    [asyncFn]
  );

  return { ...state, execute };
}
