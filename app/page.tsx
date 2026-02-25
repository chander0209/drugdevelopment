'use client';

import { useState, useEffect } from 'react';
import { DevelopmentPhase, TherapeuticArea } from '@/types';
import ProgramCard from '@/components/ProgramCard';
import FilterPanel from '@/components/FilterPanel';
import { Search, LayoutGrid, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';

const PAGE_LIMIT = 20;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedPhases, setSelectedPhases] = useState<DevelopmentPhase[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<TherapeuticArea[]>([]);
  const [page, setPage] = useState(1);

  // Debounce search input — avoids a query on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 whenever filters / search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedPhases, selectedAreas]);

  const { data, isLoading, isFetching, isError, error, refetch } = usePrograms({
    page,
    limit: PAGE_LIMIT,
    search: debouncedSearch,
    phases: selectedPhases,
    areas: selectedAreas,
  });

  const programs = data?.programs ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
    hasMore: false,
  };

  const handlePhaseToggle = (phase: DevelopmentPhase) =>
    setSelectedPhases((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase]
    );

  const handleAreaToggle = (area: TherapeuticArea) =>
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );

  const handleClearFilters = () => {
    setSelectedPhases([]);
    setSelectedAreas([]);
    setSearchQuery('');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Programs</h1>
        <p className="text-gray-600">
          Browse and manage {pagination.total > 0 ? pagination.total : '...'} drug development programs
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search programs by name, code, indication, or therapeutic area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel
            selectedPhases={selectedPhases}
            selectedAreas={selectedAreas}
            onPhaseToggle={handlePhaseToggle}
            onAreaToggle={handleAreaToggle}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Programs Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <LayoutGrid className="w-4 h-4 mr-2" />
              <span>
                Showing {programs.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}-
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} programs
              </span>
              {/* Subtle spinner shown during background refetches */}
              {isFetching && !isLoading && (
                <Loader2 className="w-4 h-4 ml-2 animate-spin text-primary-400" />
              )}
            </div>
          </div>

          {isError && (
            <div className="card bg-red-50 border border-red-200 p-4 mb-4">
              <p className="text-red-800">
                {error instanceof Error ? error.message : 'An error occurred'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-3 text-gray-600">Loading programs...</span>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12 card">
              <p className="text-gray-500">No programs found matching your filters.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || isFetching}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isFetching}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                            pagination.page === pageNum
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          } disabled:cursor-not-allowed`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || isFetching}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
