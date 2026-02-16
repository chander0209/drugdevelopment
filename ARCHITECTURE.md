# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE (Browser)                  │
│  ┌────────────────────┐          ┌──────────────────────────┐   │
│  │   Main Page        │          │   Program Detail Page    │   │
│  │   (page.tsx)       │          │   (programs/[id]/page)   │   │
│  │                    │          │                          │   │
│  │  - Search input    │          │  - Overview tab          │   │
│  │  - Filter panel    │          │  - Studies tab           │   │
│  │  - Program grid    │          │  - Milestones tab        │   │
│  │  - Pagination      │          │  - Edit mode             │   │
│  └────────────────────┘          └──────────────────────────┘   │
└───────────────────┬──────────────────────────┬──────────────────┘
                    │                          │
                    │ HTTP GET/PATCH           │ HTTP GET/PATCH
                    ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS API ROUTES                           │
│  ┌─────────────────────────┐    ┌──────────────────────────┐   │
│  │  /api/programs          │    │  /api/programs/[id]      │   │
│  │  (route.ts)             │    │  (route.ts)              │   │
│  │                         │    │                          │   │
│  │  GET - List programs    │    │  GET - Get single        │   │
│  │    • Pagination         │    │  PATCH - Update program  │   │
│  │    • Search             │    │                          │   │
│  │    • Filters            │    │                          │   │
│  └─────────────────────────┘    └──────────────────────────┘   │
└───────────────────┬──────────────────────────┬──────────────────┘
                    │                          │
                    │ Prisma Queries           │ Prisma Queries
                    ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PRISMA ORM LAYER                             │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Prisma Client (lib/prisma.ts)                         │     │
│  │                                                         │     │
│  │  • Connection pooling                                  │     │
│  │  • Query optimization                                  │     │
│  │  • Type-safe queries                                   │     │
│  │  • Automatic joins                                     │     │
│  └────────────────────────────────────────────────────────┘     │
└───────────────────┬───────────────────────────────────────────  ┘
                    │
                    │ SQL Queries (optimized with indexes)
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (SQLite/PostgreSQL)                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │   Program      │  │     Study      │  │   Milestone    │    │
│  │                │  │                │  │                │    │
│  │  • id (PK)     │  │  • id (PK)     │  │  • id (PK)     │    │
│  │  • name [IDX]  │  │  • programId   │  │  • programId   │    │
│  │  • code [IDX]  │  │  • status      │  │  • studyId     │    │
│  │  • phase [IDX] │  └────────────────┘  │  • status      │    │
│  │  • area [IDX]  │                      └────────────────┘    │
│  └────────────────┘                                             │
│                                                                  │
│  [IDX] = Indexed for fast lookups                               │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: List Programs with Filters

```
┌──────────────┐
│ 1. User      │ "Show Phase I Cardiology programs, page 2"
│    Action    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 2. Frontend  │ Constructs URL:
│    Request   │ /api/programs?page=2&limit=20&phases=Phase I&areas=Cardiology
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 3. API Route │ Parses query params
│    Handler   │ Builds Prisma where clause:
└──────┬───────┘ { phase: { in: ["Phase I"] }, therapeuticArea: { in: ["Cardiology"] } }
       │
       ▼
┌──────────────┐
│ 4. Prisma    │ Generates SQL:
│    Query     │ SELECT * FROM Program 
└──────┬───────┘ WHERE phase IN ('Phase I') AND therapeuticArea IN ('Cardiology')
       │         ORDER BY lastUpdated DESC LIMIT 20 OFFSET 20;
       │         [Uses indexes for fast lookup]
       ▼
┌──────────────┐
│ 5. Database  │ Executes query with indexes
│    Lookup    │ Returns 20 matching records
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 6. API       │ Formats response:
│    Response  │ { programs: [...], pagination: { page: 2, total: 45, ... } }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 7. Frontend  │ Updates state, renders programs
│    Render    │ Shows "Showing 21-40 of 45 programs"
└──────────────┘
```

## Data Flow: Edit Program

```
┌──────────────┐
│ 1. User      │ Clicks "Edit", modifies description, clicks "Save"
│    Action    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 2. Frontend  │ PATCH /api/programs/PRG001
│    Request   │ Body: { description: "New description", ... }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 3. API Route │ Validates input
│    Handler   │ Calls Prisma update
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 4. Prisma    │ Generates SQL:
│    Query     │ UPDATE Program SET description = ?, lastUpdated = ?
└──────┬───────┘ WHERE id = 'PRG001';
       │
       ▼
┌──────────────┐
│ 5. Database  │ Executes update
│    Write     │ Returns updated record
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 6. API       │ Fetches complete program with relations
│    Response  │ Returns updated program with studies & milestones
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 7. Frontend  │ Updates local state
│    Update    │ Shows success message, exits edit mode
└──────────────┘
```

## Database Schema Relationships

```
       Program (Parent)
       ┌──────────────────┐
       │ id: String (PK)  │
       │ name: String     │──┐
       │ code: String     │  │ 1:N
       │ phase: String    │  │
       │ therapeuticArea  │  │
       │ ...more fields   │  │
       └──────────────────┘  │
              │              │
              │ 1:N          │
              │              │
    ┌─────────┴───────┐      │
    │                 │      │
    ▼                 ▼      │
Study            Milestone   │
┌──────────────┐ ┌──────────────┐
│ id (PK)      │ │ id (PK)      │
│ programId FK │ │ programId FK │
│ name         │ │ name         │
│ status       │ │ status       │
│ ...          │ │ targetDate   │
└──────────────┘ │ ...          │
    │            └──────────────┘
    │ 1:N             ▲
    └─────────────────┘
         Milestone
         (for Study)
```

### Database
```
User Request → API with filters → Database query with indexes
                       ↓
              SELECT ... WHERE phase='Phase I'
              LIMIT 20 OFFSET 0
              [Uses index on 'phase' column]
                       ↓
              [PRG003, PRG015, PRG022, ...]  (only 20 programs)
                       ↓
              Return to frontend
                       ↓
              Render 20 programs

Memory: Only 20 programs in browser RAM
```

## Index Performance Example

### Without Index (Full Table Scan)
```
Query: SELECT * FROM Program WHERE phase = 'Phase I';

Database Process:
1. Read row 1: phase = 'Discovery' ❌ No match
2. Read row 2: phase = 'Phase I' ✓ Match!
3. Read row 3: phase = 'Preclinical' ❌ No match
...
50. Read row 50: phase = 'Phase II' ❌ No match

Rows scanned: 50 (all rows)
Time: 50ms
```

### With Index (Index Scan)
```
Query: SELECT * FROM Program WHERE phase = 'Phase I';

Database Process:
1. Look up 'Phase I' in phase_idx B-tree → Points to rows [2, 5, 12, 18, 25]
2. Read only those 5 rows directly

Rows scanned: 5 (only matching rows)
Time: 2ms

Speedup: 25x faster
```

## Caching Strategy (Future Enhancement)

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Redis Cache │ ← Check cache first
│              │   Cache common queries:
│  programs:   │   • programs:page:1
│    page:1    │   • programs:phase:Phase I
│  [cached]    │   TTL: 5 minutes
└──────┬───────┘
       │ Cache miss
       ▼
┌──────────────┐
│   Database   │ ← Only if not in cache
│              │   Query & cache result
└──────────────┘

Benefits:
• Reduces database load
• Faster response times
• Handles traffic spikes
```

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────┐
│                     VERCEL / HOSTING                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Next.js Application (Multiple Instances)  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │  │
│  │  │Instance 1│  │Instance 2│  │Instance 3│        │  │
│  │  └──────────┘  └──────────┘  └──────────┘        │  │
│  └───────────────────┬───────────────────────────────┘  │
└────────────────────  │ ──────────────────────────────────┘
                       │
                       ├─────────────┬────────────────┐
                       ▼             ▼                ▼
              ┌──────────────┐ ┌──────────┐  ┌──────────────┐
              │ PostgreSQL   │ │  Redis   │  │  Monitoring  │
              │  (Primary)   │ │  Cache   │  │   (Sentry)   │
              └──────┬───────┘ └──────────┘  └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ PostgreSQL   │
              │ (Read Replica)│
              └──────────────┘
```

---

**Legend:**
- PK = Primary Key
- FK = Foreign Key
- IDX = Indexed Column
- 1:N = One-to-Many Relationship
- ▼ = Data Flow Direction
- ✓ = Success
- ❌ = No Match
