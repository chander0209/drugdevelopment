import { Milestone } from '@/types';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

export default function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle aria-hidden="true" className="w-5 h-5 text-green-600" />;
      case 'In Progress':
        return <Clock aria-hidden="true" className="w-5 h-5 text-blue-600" />;
      case 'Delayed':
        return <AlertCircle aria-hidden="true" className="w-5 h-5 text-red-600" />;
      default:
        return <Circle aria-hidden="true" className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedMilestones.map((milestone, index) => (
        <div key={milestone.id} className="relative">
          {index < sortedMilestones.length - 1 && (
            <div className="absolute left-[10px] top-8 w-0.5 h-full bg-gray-200" />
          )}
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">{getStatusIcon(milestone.status)}</div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{milestone.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(milestone.status)}`}>
                  {milestone.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>Target: {milestone.targetDate}</span>
                {milestone.actualDate && (
                  <span className="ml-4">Actual: {milestone.actualDate}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
