import { useState, useEffect } from 'react';
import { fetchPrograms, ProgramsFilters, ProgramsResponse } from '@/lib/api';

/**
 * usePrograms — fetches a paginated list of programs with filters.
 *
 * Manages loading, error, and data state for the programs list.
 */
export function usePrograms(filters: ProgramsFilters) {
  const [data, setData] = useState<ProgramsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setIsFetching(true);
      setIsError(false);
      setError(null);

      try {
        const result = await fetchPrograms(filters);
        if (isMounted) {
          setData(result);
          setIsError(false);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to fetch programs');
          setIsError(true);
          setError(error);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [filters.page, filters.limit, filters.search, filters.phases.join(','), filters.areas.join(',')]);

  const refetch = async () => {
    setIsFetching(true);
    setIsError(false);
    setError(null);

    try {
      const result = await fetchPrograms(filters);
      setData(result);
      setIsError(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch programs');
      setIsError(true);
      setError(error);
    } finally {
      setIsFetching(false);
    }
  };

  return { data, isLoading, isError, error, isFetching, refetch };
}
