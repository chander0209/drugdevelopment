import { Program } from '@/types';

export interface ProgramsFilters {
  page: number;
  limit: number;
  search: string;
  phases: string[];
  areas: string[];
}

export interface ProgramsResponse {
  programs: Program[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface UpdateProgramPayload {
  description: string;
  indication: string;
  mechanism: string;
}

/**
 * Fetch a paginated, filtered list of programs.
 */
export async function fetchPrograms(filters: ProgramsFilters): Promise<ProgramsResponse> {
  const params = new URLSearchParams({
    page: filters.page.toString(),
    limit: filters.limit.toString(),
  });

  if (filters.search) params.append('search', filters.search);
  if (filters.phases.length > 0) params.append('phases', filters.phases.join(','));
  if (filters.areas.length > 0) params.append('areas', filters.areas.join(','));

  const response = await fetch(`/api/programs?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch programs');
  }

  return response.json();
}

/**
 * Fetch a single program by ID.
 */
export async function fetchProgram(id: string): Promise<Program> {
  const response = await fetch(`/api/programs/${id}`);

  if (!response.ok) {
    if (response.status === 404) throw new Error('Program not found');
    throw new Error('Failed to fetch program');
  }

  return response.json();
}

/**
 * Partially update a program.
 */
export async function updateProgram(
  id: string,
  payload: UpdateProgramPayload
): Promise<Program> {
  const response = await fetch(`/api/programs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Failed to save changes');

  return response.json();
}
