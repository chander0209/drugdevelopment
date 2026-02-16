import { DevelopmentPhase, TherapeuticArea } from '@/types';
import { X } from 'lucide-react';

interface FilterPanelProps {
  selectedPhases: DevelopmentPhase[];
  selectedAreas: TherapeuticArea[];
  onPhaseToggle: (phase: DevelopmentPhase) => void;
  onAreaToggle: (area: TherapeuticArea) => void;
  onClearFilters: () => void;
}

const phases: DevelopmentPhase[] = [
  'Discovery',
  'Preclinical',
  'Phase I',
  'Phase II',
  'Approved',
];

const therapeuticAreas: TherapeuticArea[] = [
  'Cardiology',
  'Immunology',
  'Infectious Diseases',
  'Rare Diseases',
  'Metabolic Disorders',
  'Respiratory',
];

export default function FilterPanel({
  selectedPhases,
  selectedAreas,
  onPhaseToggle,
  onAreaToggle,
  onClearFilters,
}: FilterPanelProps) {
  const hasFilters = selectedPhases.length > 0 || selectedAreas.length > 0;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            aria-label="Clear all filters"
          >
            <X aria-hidden="true" className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Development Phase</h4>
          <div className="space-y-2">
            {phases.map((phase) => (
              <label key={phase} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPhases.includes(phase)}
                  onChange={() => onPhaseToggle(phase)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{phase}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Therapeutic Area</h4>
          <div className="space-y-2">
            {therapeuticAreas.map((area) => (
              <label key={area} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(area)}
                  onChange={() => onAreaToggle(area)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{area}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
