import { useCallback, useState } from 'react';
import { parseError, ErrorInfo } from './error-handler';

export interface UseErrorReturn {
  error: ErrorInfo | null;
  setError: (error: ErrorInfo | null) => void;
  handleError: (err: any) => void;
  clearError: () => void;
  isError: boolean;
}

/**
 * Hook for managing error state throughout the application
 */
export function useError(): UseErrorReturn {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const handleError = useCallback((err: any) => {
    const parsedError = parseError(err);
    setError(parsedError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError,
    isError: error !== null,
  };
}
