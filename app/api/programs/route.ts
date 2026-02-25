import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Some runtimes provide `request.nextUrl`; fall back to parsing `request.url`.
    const url = (request as any).nextUrl ?? new URL(request.url);
    const searchParams = url.searchParams;

    // Log incoming request details to help compare browser vs curl requests
    try {
      const hdrs: Record<string, string> = {};
      // `request.headers` is an iterable of [key, value]
      for (const [k, v] of (request.headers as any).entries()) hdrs[k] = String(v);
      console.log('/api/programs incoming:', { query: searchParams.toString(), headers: hdrs });
    } catch (e) {
      console.log('/api/programs incoming (failed to read headers)', { query: searchParams.toString() });
    }
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filter parameters
    const search = searchParams.get('search') || '';
    const phases = searchParams.get('phases')?.split(',').filter(Boolean) || [];
    const areas = searchParams.get('areas')?.split(',').filter(Boolean) || [];

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      // Note: `mode: 'insensitive'` can cause errors on SQLite. Keep simple `contains` for compatibility.
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { indication: { contains: search } },
        { therapeuticArea: { contains: search } },
      ];
    }

    // Phase filter
    if (phases.length > 0) {
      where.phase = { in: phases };
    }

    // Therapeutic area filter
    if (areas.length > 0) {
      where.therapeuticArea = { in: areas };
    }

    // Fetch programs with pagination
    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastUpdated: 'desc' },
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          therapeuticArea: true,
          phase: true,
          indication: true,
          mechanism: true,
          projectLead: true,
          startDate: true,
          lastUpdated: true,
          totalEnrollment: true,
          completedStudies: true,
          activeStudies: true,
          completedMilestones: true,
          totalMilestones: true,
        },
      }),
      prisma.program.count({ where }),
    ]);

    return NextResponse.json({
      programs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + programs.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
