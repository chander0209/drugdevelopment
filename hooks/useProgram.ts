import { useState, useEffect } from 'react';
import { fetchProgram, updateProgram, UpdateProgramPayload } from '@/lib/api';
import { Program } from '@/types';

/**
 * useProgram — fetches a single program by ID.
 *
 * Manages loading, error, and data state for a single program.
 */
export function useProgram(id: string) {
  const [data, setData] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const result = await fetchProgram(id);
        if (isMounted) {
          setData(result);
          setIsError(false);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to fetch program');
          setIsError(true);
          setError(error);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, isLoading, isError, error };
}

/**
 * useProgramMutation — updates a program.
 *
 * Manages loading and error state during a PATCH request.
 */
export function useProgramMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (
    id: string,
    payload: UpdateProgramPayload
  ): Promise<Program | null> => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await updateProgram(id, payload);
      setIsLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update program');
      setIsError(true);
      setError(error);
      setIsLoading(false);
      return null;
    }
  };

  return { mutate, isLoading, isError, error };
}
