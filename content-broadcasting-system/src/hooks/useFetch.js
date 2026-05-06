import { useState, useEffect, useRef } from 'react';

/**
 * Hook for data fetching with auto-execute on mount.
 * asyncFn should be a stable reference (useCallback) from the caller.
 */
export function useFetch(asyncFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fnRef = useRef(asyncFn);
  fnRef.current = asyncFn;

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []); // mount only

  return { data, loading, error, refetch: fetch };
}
