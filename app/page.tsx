'use client';

import { useState, useMemo } from 'react';
import { mockPrograms } from '@/lib/mockData';
import { DevelopmentPhase, TherapeuticArea } from '@/types';
import ProgramCard from '@/components/ProgramCard';
import FilterPanel from '@/components/FilterPanel';
import { Search, LayoutGrid } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhases, setSelectedPhases] = useState<DevelopmentPhase[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<TherapeuticArea[]>([]);

  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter((program) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.indication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.therapeuticArea.toLowerCase().includes(searchQuery.toLowerCase());

      // Phase filter
      const matchesPhase =
        selectedPhases.length === 0 || selectedPhases.includes(program.phase);

      // Therapeutic area filter
      const matchesArea =
        selectedAreas.length === 0 || selectedAreas.includes(program.therapeuticArea);

      return matchesSearch && matchesPhase && matchesArea;
    });
  }, [searchQuery, selectedPhases, selectedAreas]);

  const handlePhaseToggle = (phase: DevelopmentPhase) => {
    setSelectedPhases((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase]
    );
  };

  const handleAreaToggle = (area: TherapeuticArea) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleClearFilters = () => {
    setSelectedPhases([]);
    setSelectedAreas([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Programs</h1>
        <p className="text-gray-600">
          Browse and manage {mockPrograms.length} drug development programs
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            aria-label="Search programs"
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
              <LayoutGrid aria-hidden="true" className="w-4 h-4 mr-2" />
              <span>
                Showing {filteredPrograms.length} of {mockPrograms.length} programs
              </span>
            </div>
          </div>

          {filteredPrograms.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
