import { useEffect, useState } from 'react';

/**
 * Hook to read query parameters from the URL
 */
export function useQueryParam(paramName: string): string | null {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get(paramName);
    setValue(paramValue);
  }, [paramName]);

  return value;
}
