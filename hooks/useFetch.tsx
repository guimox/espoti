import { useState, useEffect, useCallback } from "react";

// Generic type for the data fetched
type FetchResult<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

// Options type for additional configuration
interface UseFetchOptions<T> {
  immediate?: boolean;
  transformer?: (data: any) => T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T = any>(
  url: string | null,
  options: UseFetchOptions<T> = {}
): FetchResult<T> {
  const {
    immediate = true,
    transformer = (data) => data as T,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const transformedData = transformer(rawData);

      setData(transformedData);
      onSuccess?.(transformedData);
    } catch (err) {
      const fetchError =
        err instanceof Error ? err : new Error("An unknown error occurred");

      setError(fetchError);
      onError?.(fetchError);
    } finally {
      setIsLoading(false);
    }
  }, [url, transformer, onSuccess, onError]);

  // Fetch immediately if specified (default true)
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refetch: fetchData,
  };
}
