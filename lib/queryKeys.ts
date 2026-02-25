/**
 * Centralized query key factory.
 * Keeps cache keys consistent and makes invalidation predictable.
 */
export const queryKeys = {
  programs: {
    all: ['programs'] as const,
    lists: () => [...queryKeys.programs.all, 'list'] as const,
    list: (filters: {
      page: number;
      limit: number;
      search: string;
      phases: string[];
      areas: string[];
    }) => [...queryKeys.programs.lists(), filters] as const,
    details: () => [...queryKeys.programs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.programs.details(), id] as const,
  },
};
