import Link from 'next/link';
import { Program } from '@/types';
import { Calendar, Users, Target, TrendingUp } from 'lucide-react';

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const enrollmentPercentage = program.studies.length > 0
    ? Math.round((program.keyMetrics.totalEnrollment / program.studies.reduce((sum, s) => sum + s.targetEnrollment, 0)) * 100)
    : 0;

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      'Discovery': 'bg-gray-100 text-gray-800',
      'Preclinical': 'bg-blue-100 text-blue-800',
      'Phase I': 'bg-green-100 text-green-800',
      'Phase II': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-emerald-100 text-emerald-800',
    };
    return colors[phase] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link href={`/programs/${program.id}`} aria-label={`Open program ${program.name}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{program.name}</h3>
            <p className="text-sm text-gray-600">{program.code}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(program.phase)}`}>
            {program.phase}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">{program.indication}</p>
          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
            {program.therapeuticArea}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm">
            <Users aria-hidden="true" className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Enrollment</p>
              <p className="font-medium">{program.keyMetrics.totalEnrollment}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Target aria-hidden="true" className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Active Studies</p>
              <p className="font-medium">{program.keyMetrics.activeStudies}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar aria-hidden="true" className="w-4 h-4 mr-1" />
              <span className="text-xs">Updated {program.lastUpdated}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp aria-hidden="true" className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-xs font-medium text-green-600">{enrollmentPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
