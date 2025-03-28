import { useState, useEffect, useCallback } from "react";

type FetchResult<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

interface UseFetchOptions<T> {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  immediate?: boolean;
  body?: any;
  headers?: Record<string, string>;
  transformer?: (data: any) => T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T = any>(
  url: string | null,
  options: UseFetchOptions<T> = {}
): FetchResult<T> {
  const {
    method = "GET",
    immediate = true,
    body = null,
    headers = {},
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
      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      };

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
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
  }, [url, method, body, headers, transformer, onSuccess, onError]);

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
