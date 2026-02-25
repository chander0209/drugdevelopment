import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const program = await prisma.program.findUnique({
      where: { id: params.id },
      include: {
        studies: {
          include: {
            milestones: {
              orderBy: { targetDate: 'asc' },
            },
          },
          orderBy: { startDate: 'desc' },
        },
        milestones: {
          where: { programId: params.id },
          orderBy: { targetDate: 'asc' },
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Transform to match frontend interface
    const response = {
      ...program,
      overallMilestones: program.milestones,
      keyMetrics: {
        totalEnrollment: program.totalEnrollment,
        completedStudies: program.completedStudies,
        activeStudies: program.activeStudies,
        completedMilestones: program.completedMilestones,
        totalMilestones: program.totalMilestones,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Extract fields that can be updated
    const { description, indication, mechanism } = body;

    const updatedProgram = await prisma.program.update({
      where: { id: params.id },
      data: {
        description,
        indication,
        mechanism,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      include: {
        studies: {
          include: {
            milestones: {
              orderBy: { targetDate: 'asc' },
            },
          },
        },
        milestones: {
          where: { programId: params.id },
          orderBy: { targetDate: 'asc' },
        },
      },
    });

    const response = {
      ...updatedProgram,
      overallMilestones: updatedProgram.milestones,
      keyMetrics: {
        totalEnrollment: updatedProgram.totalEnrollment,
        completedStudies: updatedProgram.completedStudies,
        activeStudies: updatedProgram.activeStudies,
        completedMilestones: updatedProgram.completedMilestones,
        totalMilestones: updatedProgram.totalMilestones,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}
