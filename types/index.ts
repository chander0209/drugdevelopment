export type DevelopmentPhase = 
  | 'Discovery'
  | 'Preclinical'
  | 'Phase I'
  | 'Phase II'
  | 'Approved'
  | 'Post-Marketing';

export type TherapeuticArea = 
  | 'Cardiology'
  | 'Immunology'
  | 'Infectious Diseases'
  | 'Rare Diseases'
  | 'Metabolic Disorders'
  | 'Respiratory'
  | 'Other';

export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  status: MilestoneStatus;
}

export interface Study {
  id: string;
  name: string;
  studyType: string;
  phase: DevelopmentPhase;
  targetEnrollment: number;
  currentEnrollment: number;
  startDate: string;
  expectedCompletionDate: string;
  status: 'Planning' | 'Recruiting' | 'Active' | 'Completed' | 'Suspended';
  sites: number;
  principalInvestigator: string;
  milestones: Milestone[];
}

export interface Program {
  id: string;
  name: string;
  code: string;
  description: string;
  therapeuticArea: TherapeuticArea;
  phase: DevelopmentPhase;
  indication: string;
  mechanism: string;
  projectLead: string;
  startDate: string;
  lastUpdated: string;
  studies: Study[];
  overallMilestones: Milestone[];
  keyMetrics: {
    totalEnrollment: number;
    completedStudies: number;
    activeStudies: number;
    completedMilestones: number;
    totalMilestones: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'view' | 'edit' | 'admin';
}
