import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seeded random number generator for consistent data
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

const therapeuticAreas = [
  'Cardiology',
  'Immunology',
  'Infectious Diseases',
  'Rare Diseases',
  'Metabolic Disorders',
  'Respiratory',
];

const phases = [
  'Discovery',
  'Preclinical',
  'Phase I',
  'Phase II',
  'Approved',
];

const indications: Record<string, string[]> = {
  'Cardiology': ['Heart Failure', 'Atrial Fibrillation', 'Hypertension', 'Coronary Artery Disease'],
  'Immunology': ['Rheumatoid Arthritis', 'Lupus', 'Psoriasis', 'Crohn\'s Disease', 'Ulcerative Colitis'],
  'Infectious Diseases': ['HIV', 'Hepatitis C', 'Tuberculosis', 'Influenza', 'COVID-19'],
  'Rare Diseases': ['Duchenne Muscular Dystrophy', 'Cystic Fibrosis', 'Sickle Cell Disease', 'Hemophilia'],
  'Metabolic Disorders': ['Type 2 Diabetes', 'Obesity', 'NASH', 'Hyperlipidemia'],
  'Respiratory': ['Asthma', 'COPD', 'Pulmonary Fibrosis', 'Pulmonary Hypertension'],
  'Other': ['General Condition'],
};

function generateMilestone(index: number, random: SeededRandom, programId?: string, studyId?: string) {
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

  const statuses = ['Completed', 'In Progress', 'Not Started', 'Delayed'];
  const status = statuses[Math.floor(random.next() * statuses.length)];

  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() - 12 + index * 3);

  return {
    id: `milestone-${programId || studyId}-${index}`,
    name: milestoneTypes[index % milestoneTypes.length],
    description: `${milestoneTypes[index % milestoneTypes.length]}`,
    targetDate: baseDate.toISOString().split('T')[0],
    actualDate: status === 'Completed' ? baseDate.toISOString().split('T')[0] : null,
    status,
    programId: programId || null,
    studyId: studyId || null,
  };
}

function generateStudy(programId: string, index: number, phase: string, random: SeededRandom) {
  const studyTypes = ['Randomized Controlled Trial', 'Open-Label Extension', 'Safety Study', 'Biomarker Study'];
  const statuses = ['Planning', 'Recruiting', 'Active', 'Completed', 'Suspended'];

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
    programId,
  };
}

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.milestone.deleteMany();
  await prisma.study.deleteMany();
  await prisma.program.deleteMany();

  const random = new SeededRandom(12345);
  const count = 100; // Generate 100 programs

  for (let i = 0; i < count; i++) {
    const therapeuticArea = therapeuticAreas[Math.floor(random.next() * therapeuticAreas.length)];
    const phase = phases[Math.floor(random.next() * phases.length)];
    const indication = indications[therapeuticArea][Math.floor(random.next() * indications[therapeuticArea].length)];

    const numStudies = Math.floor(random.next() * 5) + 1;
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(random.next() * 60));

    const lastUpdated = new Date();
    lastUpdated.setDate(lastUpdated.getDate() - Math.floor(random.next() * 30));

    const programId = `PRG${String(i + 1).padStart(3, '0')}`;

    // Create program
    const program = await prisma.program.create({
      data: {
        id: programId,
        name: `${therapeuticArea.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
        code: programId,
        description: `Novel therapeutic candidate for ${indication} targeting ${['protein kinase inhibition', 'receptor antagonism', 'enzyme modulation', 'gene therapy', 'antibody-drug conjugate'][Math.floor(random.next() * 5)]}`,
        therapeuticArea,
        phase,
        indication,
        mechanism: ['Small Molecule', 'Monoclonal Antibody', 'Biologic', 'Gene Therapy', 'Cell Therapy'][Math.floor(random.next() * 5)],
        projectLead: `${['Dr. Sarah', 'Dr. Michael', 'Dr. Jennifer', 'Dr. David', 'Dr. Emily'][Math.floor(random.next() * 5)]} ${['Anderson', 'Taylor', 'Martinez', 'Garcia', 'Rodriguez'][Math.floor(random.next() * 5)]}`,
        startDate: startDate.toISOString().split('T')[0],
        lastUpdated: lastUpdated.toISOString().split('T')[0],
        totalEnrollment: 0,
        completedStudies: 0,
        activeStudies: 0,
        completedMilestones: 0,
        totalMilestones: 0,
      },
    });

    // Create studies for the program
    let totalEnrollment = 0;
    let completedStudies = 0;
    let activeStudies = 0;

    for (let j = 0; j < numStudies; j++) {
      const studyData = generateStudy(programId, j, phase, random);
      totalEnrollment += studyData.currentEnrollment;
      if (studyData.status === 'Completed') completedStudies++;
      if (studyData.status === 'Active' || studyData.status === 'Recruiting') activeStudies++;

      const study = await prisma.study.create({
        data: studyData,
      });

      // Create milestones for each study
      const numStudyMilestones = Math.floor(random.next() * 5) + 3;
      for (let k = 0; k < numStudyMilestones; k++) {
        await prisma.milestone.create({
          data: generateMilestone(k, random, undefined, study.id),
        });
      }
    }

    // Create overall program milestones
    const numOverallMilestones = Math.floor(random.next() * 4) + 4;
    let completedMilestones = 0;
    
    for (let k = 0; k < numOverallMilestones; k++) {
      const milestone = await prisma.milestone.create({
        data: generateMilestone(k, random, programId, undefined),
      });
      if (milestone.status === 'Completed') completedMilestones++;
    }

    // Update program with calculated metrics
    await prisma.program.update({
      where: { id: programId },
      data: {
        totalEnrollment,
        completedStudies,
        activeStudies,
        completedMilestones,
        totalMilestones: numOverallMilestones,
      },
    });

    if ((i + 1) % 10 === 0) {
      console.log(`Created ${i + 1} programs...`);
    }
  }

  console.log(`Seeding finished. Created ${count} programs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
