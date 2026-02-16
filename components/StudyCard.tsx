import { Study } from '@/types';
import { Users, MapPin, User, Calendar, TrendingUp } from 'lucide-react';

interface StudyCardProps {
  study: Study;
}

export default function StudyCard({ study }: StudyCardProps) {
  const enrollmentPercentage = Math.round((study.currentEnrollment / study.targetEnrollment) * 100);

  const getStatusColor = (status: Study['status']) => {
    const colors: Record<Study['status'], string> = {
      'Planning': 'bg-gray-100 text-gray-800',
      'Recruiting': 'bg-blue-100 text-blue-800',
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-emerald-100 text-emerald-800',
      'Suspended': 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{study.name}</h3>
          <p className="text-sm text-gray-600">{study.studyType}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(study.status)}`}>
          {study.status}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Enrollment Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {study.currentEnrollment} / {study.targetEnrollment}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-end mt-1">
            <TrendingUp className="w-3 h-3 text-primary-600 mr-1" />
            <span className="text-xs text-primary-600 font-medium">{enrollmentPercentage}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
          <div className="flex items-center text-sm">
            <MapPin aria-hidden="true" className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Sites</p>
              <p className="font-medium text-gray-900">{study.sites}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <User aria-hidden="true" className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">PI</p>
              <p className="font-medium text-gray-900 truncate">{study.principalInvestigator}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
          <div className="flex items-start text-sm">
            <Calendar aria-hidden="true" className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="font-medium text-gray-900">{study.startDate}</p>
            </div>
          </div>
          <div className="flex items-start text-sm">
            <Calendar aria-hidden="true" className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Expected Completion</p>
              <p className="font-medium text-gray-900">{study.expectedCompletionDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
