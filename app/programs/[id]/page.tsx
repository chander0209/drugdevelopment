'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/app/UserContext';
import { Program } from '@/types';
import StudyCard from '@/components/StudyCard';
import MilestoneTimeline from '@/components/MilestoneTimeline';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Calendar,
  User,
  Beaker,
  Target,
  FileText,
  Activity,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useProgram, useProgramMutation } from '@/hooks/useProgram';

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useUser();
  const programId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [editedProgram, setEditedProgram] = useState<Program | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'studies' | 'milestones'>('overview');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ─── React Query ───────────────────────────────────────────────────────────
  const {
    data: program,
    isLoading,
    isError,
    error,
  } = useProgram(programId);

  const mutation = useProgramMutation(programId);
  // ──────────────────────────────────────────────────────────────────────────

  // Reset success banner after 3 s
  useEffect(() => {
    if (saveSuccess) {
      const t = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [saveSuccess]);

  const handleEdit = () => {
    if (program) {
      setEditedProgram({ ...program });
      setIsEditing(true);
      setSaveSuccess(false);
    }
  };

  const handleSave = async () => {
    if (!editedProgram) return;

    mutation.mutate(
      {
        description: editedProgram.description,
        indication: editedProgram.indication,
        mechanism: editedProgram.mechanism,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditedProgram(null);
          setSaveSuccess(true);
        },
      }
    );
  };

  const handleCancel = () => {
    setEditedProgram(null);
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof Program, value: unknown) => {
    if (editedProgram) {
      setEditedProgram({ ...editedProgram, [field]: value });
    }
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      Discovery: 'bg-gray-100 text-gray-800',
      Preclinical: 'bg-blue-100 text-blue-800',
      'Phase I': 'bg-green-100 text-green-800',
      'Phase II': 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-emerald-100 text-emerald-800',
    };
    return colors[phase] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-3 text-gray-600">Loading program details...</span>
        </div>
      </div>
    );
  }

  if (isError && !program) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center card bg-red-50 border border-red-200 p-8">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error instanceof Error ? error.message : 'An error occurred'}
          </h2>
          <button onClick={() => router.push('/')} className="mt-4 btn-primary">
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  if (!program) return null;

  const currentProgram = editedProgram || program;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">Changes saved successfully!</p>
          </div>
        </div>
      )}

      {/* Mutation Error Message */}
      {mutation.isError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">
              {mutation.error instanceof Error ? mutation.error.message : 'Failed to save changes'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Programs
        </button>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{currentProgram.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getPhaseColor(currentProgram.phase)}`}
              >
                {currentProgram.phase}
              </span>
            </div>
            <p className="text-gray-600">{currentProgram.code}</p>
          </div>

          {!isEditing ? (
            currentUser &&
            (currentUser.role === 'admin' || currentUser.role === 'edit') && (
              <button onClick={handleEdit} className="btn-primary flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit Program
              </button>
            )
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={mutation.isPending}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={mutation.isPending}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {(['overview', 'studies', 'milestones'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'studies' ? `Studies (${currentProgram.studies.length})` : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Enrollment</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {currentProgram.keyMetrics.totalEnrollment}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Studies</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {currentProgram.keyMetrics.activeStudies}
                  </p>
                </div>
                <Beaker className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed Studies</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {currentProgram.keyMetrics.completedStudies}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Milestones</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {currentProgram.keyMetrics.completedMilestones}/
                    {currentProgram.keyMetrics.totalMilestones}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                {isEditing ? (
                  <textarea
                    value={currentProgram.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className="input-field"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{currentProgram.description}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Indication</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProgram.indication}
                    onChange={(e) => handleFieldChange('indication', e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{currentProgram.indication}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Therapeutic Area
                </label>
                <p className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                  {currentProgram.therapeuticArea}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mechanism</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProgram.mechanism}
                    onChange={(e) => handleFieldChange('mechanism', e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{currentProgram.mechanism}</p>
                )}
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Project Lead</p>
                  <p className="text-gray-900">{currentProgram.projectLead}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-gray-900">{currentProgram.startDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Studies Tab */}
      {activeTab === 'studies' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Clinical Studies</h2>
          {currentProgram.studies.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">No studies assigned to this program yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentProgram.studies.map((study) => (
                <StudyCard key={study.id} study={study} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Program Milestones</h2>
          {currentProgram.overallMilestones.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">No milestones defined for this program yet.</p>
            </div>
          ) : (
            <div className="card">
              <MilestoneTimeline milestones={currentProgram.overallMilestones} />
            </div>
          )}

          {currentProgram.studies.map((study) => (
            <div key={study.id} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {study.name} Milestones
              </h3>
              <MilestoneTimeline milestones={study.milestones} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
