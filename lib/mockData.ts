import { Program, Study, Milestone, DevelopmentPhase, TherapeuticArea } from '@/types';

// Seeded random number generator for consistent data across server and client
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const therapeuticAreas: TherapeuticArea[] = [
  'Cardiology',
  'Immunology',
  'Infectious Diseases',
  'Rare Diseases',
  'Metabolic Disorders',
  'Respiratory',
];

const phases: DevelopmentPhase[] = [
  'Discovery',
  'Preclinical',
  'Phase I',
  'Phase II',
  'Approved',
];

const indications: Record<TherapeuticArea, string[]> = {
  'Cardiology': ['Heart Failure', 'Atrial Fibrillation', 'Hypertension', 'Coronary Artery Disease'],
  'Immunology': ['Rheumatoid Arthritis', 'Lupus', 'Psoriasis', 'Crohn\'s Disease', 'Ulcerative Colitis'],
  'Infectious Diseases': ['HIV', 'Hepatitis C', 'Tuberculosis', 'Influenza', 'COVID-19'],
  'Rare Diseases': ['Duchenne Muscular Dystrophy', 'Cystic Fibrosis', 'Sickle Cell Disease', 'Hemophilia'],
  'Metabolic Disorders': ['Type 2 Diabetes', 'Obesity', 'NASH', 'Hyperlipidemia'],
  'Respiratory': ['Asthma', 'COPD', 'Pulmonary Fibrosis', 'Pulmonary Hypertension'],
  'Other': ['General Condition'],
};

function generateMilestone(index: number, random: SeededRandom, studyName?: string): Milestone {
  const milestoneTypes = [
    'Protocol Finalization',
    'First Patient Enrolled',
    'Half Enrollment Complete',
    'Full Enrollment',
    'Database Lock',
    'Interim Analysis',
    'Final Results',
    'Regulatory Submission',
  ];
  
  const statuses: Milestone['status'][] = ['Completed', 'In Progress', 'Not Started', 'Delayed'];
  const status = statuses[Math.floor(random.next() * statuses.length)];
  
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() - 12 + index * 3);
  
  return {
    id: `milestone-${index}`,
    name: milestoneTypes[index % milestoneTypes.length],
    description: `${milestoneTypes[index % milestoneTypes.length]}${studyName ? ` for ${studyName}` : ''}`,
    targetDate: baseDate.toISOString().split('T')[0],
    actualDate: status === 'Completed' ? baseDate.toISOString().split('T')[0] : undefined,
    status,
  };
}

function generateStudy(programId: string, index: number, phase: DevelopmentPhase, random: SeededRandom): Study {
  const studyTypes = ['Randomized Controlled Trial', 'Open-Label Extension', 'Safety Study', 'Biomarker Study'];
  const statuses: Study['status'][] = ['Planning', 'Recruiting', 'Active', 'Completed', 'Suspended'];
  
  const targetEnrollment = Math.floor(random.next() * 500) + 50;
  const currentEnrollment = Math.floor(random.next() * targetEnrollment);
  
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - Math.floor(random.next() * 24));
  
  const completionDate = new Date(startDate);
  completionDate.setMonth(completionDate.getMonth() + Math.floor(random.next() * 36) + 12);
  
  const studyName = `Study ${programId}-${String(index + 1).padStart(3, '0')}`;
  
  return {
    id: `study-${programId}-${index}`,
    name: studyName,
    studyType: studyTypes[Math.floor(random.next() * studyTypes.length)],
    phase,
    targetEnrollment,
    currentEnrollment,
    startDate: startDate.toISOString().split('T')[0],
    expectedCompletionDate: completionDate.toISOString().split('T')[0],
    status: statuses[Math.floor(random.next() * statuses.length)],
    sites: Math.floor(random.next() * 50) + 5,
    principalInvestigator: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(random.next() * 5)]}`,
    milestones: Array.from({ length: Math.floor(random.next() * 5) + 3 }, (_, i) => generateMilestone(i, random, studyName)),
  };
}

export function generateMockPrograms(count: number = 50): Program[] {
  const random = new SeededRandom(12345); // Fixed seed for consistency
  const programs: Program[] = [];
  
  for (let i = 0; i < count; i++) {
    const therapeuticArea = therapeuticAreas[Math.floor(random.next() * therapeuticAreas.length)];
    const phase = phases[Math.floor(random.next() * phases.length)];
    const indication = indications[therapeuticArea][Math.floor(random.next() * indications[therapeuticArea].length)];
    
    const numStudies = Math.floor(random.next() * 5) + 1;
    const studies = Array.from({ length: numStudies }, (_, j) => generateStudy(`PRG${String(i + 1).padStart(3, '0')}`, j, phase, random));
    
    const totalEnrollment = studies.reduce((sum, study) => sum + study.currentEnrollment, 0);
    const completedStudies = studies.filter(s => s.status === 'Completed').length;
    const activeStudies = studies.filter(s => s.status === 'Active' || s.status === 'Recruiting').length;
    
    const overallMilestones = Array.from({ length: Math.floor(random.next() * 4) + 4 }, (_, i) => generateMilestone(i, random));
    const completedMilestones = overallMilestones.filter(m => m.status === 'Completed').length;
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(random.next() * 60));
    
    const lastUpdated = new Date();
    lastUpdated.setDate(lastUpdated.getDate() - Math.floor(random.next() * 30));
    
    programs.push({
      id: `PRG${String(i + 1).padStart(3, '0')}`,
      name: `${therapeuticArea.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
      code: `PRG${String(i + 1).padStart(3, '0')}`,
      description: `Novel therapeutic candidate for ${indication} targeting ${['protein kinase inhibition', 'receptor antagonism', 'enzyme modulation', 'gene therapy', 'antibody-drug conjugate'][Math.floor(random.next() * 5)]}`,
      therapeuticArea,
      phase,
      indication,
      mechanism: ['Small Molecule', 'Monoclonal Antibody', 'Biologic', 'Gene Therapy', 'Cell Therapy'][Math.floor(random.next() * 5)],
      projectLead: `${['Dr. Sarah', 'Dr. Michael', 'Dr. Jennifer', 'Dr. David', 'Dr. Emily'][Math.floor(random.next() * 5)]} ${['Anderson', 'Taylor', 'Martinez', 'Garcia', 'Rodriguez'][Math.floor(random.next() * 5)]}`,
      startDate: startDate.toISOString().split('T')[0],
      lastUpdated: lastUpdated.toISOString().split('T')[0],
      studies,
      overallMilestones,
      keyMetrics: {
        totalEnrollment,
        completedStudies,
        activeStudies,
        completedMilestones,
        totalMilestones: overallMilestones.length,
      },
    });
  }
  
  return programs;
}

// Initialize with mock data
export const mockPrograms = generateMockPrograms(50);
