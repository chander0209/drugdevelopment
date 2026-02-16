# Migration Guide: From Mock Data to Database

This guide will help you transition your Drug Portfolio Dashboard from using mock data to the optimized database-backed version.

## Overview of Changes

### What's Changing:
1. ✅ Mock data (`lib/mockData.ts`) → Database with Prisma
2. ✅ Client-side filtering → Server-side API routes
3. ✅ All data in memory → Paginated queries
4. ✅ Temporary edits → Persistent database updates

### What's Staying the Same:
- ✅ UI components (ProgramCard, StudyCard, etc.)
- ✅ Styling (Tailwind CSS)
- ✅ User experience and interface
- ✅ Data structure and types

## Step-by-Step Migration

### Step 1: Install New Dependencies (5 minutes)

```bash
npm install @prisma/client
npm install --save-dev prisma tsx
```

### Step 2: Set Up Database (5 minutes)

```bash
# Create .env file
cp .env.example .env

# Initialize Prisma
npm run db:generate
npm run db:push

# Seed with 100 test programs
npm run db:seed
```

### Step 3: Test API Routes (2 minutes)

Start your dev server:
```bash
npm run dev
```

Test the API manually:
```bash
# List programs
curl http://localhost:3000/api/programs?page=1&limit=20

# Get specific program
curl http://localhost:3000/api/programs/PRG001
```

### Step 4: Switch to Optimized Pages (2 minutes)

```bash
# Backup original files
mv app/page.tsx app/page-original.tsx
mv app/programs/[id]/page.tsx app/programs/[id]/page-original.tsx

# Activate optimized versions
mv app/page-optimized.tsx app/page.tsx
mv app/programs/[id]/page-optimized.tsx app/programs/[id]/page.tsx
```

### Step 5: Test the Application (5 minutes)

1. Open http://localhost:3000
2. Test pagination (should see 20 programs per page)
3. Test search functionality
4. Test filters (phases and therapeutic areas)
5. Click into a program
6. Test edit functionality (if you have edit permissions)
7. Verify changes persist after refresh

### Step 6: Clean Up (Optional)

Once everything works, you can remove old files:
```bash
rm app/page-original.tsx
rm app/programs/[id]/page-original.tsx
# Keep lib/mockData.ts for reference or remove it
```

## Comparison: Before vs After

### Before (Mock Data)
```typescript
// app/page.tsx
import { mockPrograms } from '@/lib/mockData';

export default function HomePage() {
  // Filter all programs in memory
  const filteredPrograms = mockPrograms.filter((program) => {
    // Client-side filtering logic
  });
  
  return (
    <div>
      {filteredPrograms.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}
```

**Issues:**
- Loads ALL programs on every page load
- Client-side filtering is slow with many programs
- No pagination
- Edits don't persist

### After (Database)
```typescript
// app/page.tsx
export default function HomePage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [pagination, setPagination] = useState({...});
  
  const fetchPrograms = async (page: number) => {
    const response = await fetch(`/api/programs?page=${page}`);
    const data = await response.json();
    setPrograms(data.programs); // Only 20 at a time
    setPagination(data.pagination);
  };
  
  // Fetch when filters change
  useEffect(() => {
    fetchPrograms(1);
  }, [filters]);
}
```

**Benefits:**
- Loads only 20 programs at a time
- Server-side filtering with database indexes
- Proper pagination
- Edits save to database

## Key Differences to Understand

### 1. Data Fetching Pattern

**Before:**
```typescript
// Synchronous, all data available immediately
const program = mockPrograms.find(p => p.id === programId);
```

**After:**
```typescript
// Asynchronous, fetch from API
const [program, setProgram] = useState<Program | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`/api/programs/${programId}`)
    .then(res => res.json())
    .then(data => setProgram(data))
    .finally(() => setLoading(false));
}, [programId]);
```

### 2. Editing Programs

**Before:**
```typescript
// Temporary, in component state only
const handleSave = () => {
  console.log('Saving program:', editedProgram);
  alert('Changes saved! (Not really)');
};
```

**After:**
```typescript
// Persisted to database
const handleSave = async () => {
  const response = await fetch(`/api/programs/${programId}`, {
    method: 'PATCH',
    body: JSON.stringify(editedProgram),
  });
  const updated = await response.json();
  setProgram(updated); // UI updates with saved data
};
```

### 3. Search and Filtering

**Before:**
```typescript
// Client-side: filters all data in browser
const filtered = programs.filter(p => 
  p.name.includes(searchQuery) &&
  (phases.length === 0 || phases.includes(p.phase))
);
```

**After:**
```typescript
// Server-side: database does the filtering
const params = new URLSearchParams({
  search: searchQuery,
  phases: selectedPhases.join(','),
  page: '1',
  limit: '20',
});
fetch(`/api/programs?${params}`);
```

## Common Migration Issues

### Issue 1: "Prisma Client not found"
```bash
Solution: npm run db:generate
```

### Issue 2: "Database table doesn't exist"
```bash
Solution: npm run db:push
```

### Issue 3: "No programs showing up"
```bash
Solution: npm run db:seed
```

### Issue 4: "API routes returning 404"
Make sure you're running `npm run dev` and check:
- Files are in `app/api/programs/route.ts`
- Files are in `app/api/programs/[id]/route.ts`

### Issue 5: "TypeScript errors on Program type"
The Program type should work the same, but if you see errors:
```typescript
// Make sure your types/index.ts includes:
export interface Program {
  // ... all fields
  keyMetrics: {
    totalEnrollment: number;
    completedStudies: number;
    activeStudies: number;
    completedMilestones: number;
    totalMilestones: number;
  };
}
```

## Testing Your Migration

### Checklist:

- [ ] Database initialized successfully
- [ ] Seed script ran without errors
- [ ] Can see programs on home page
- [ ] Pagination works (should show 20 at a time)
- [ ] Search works
- [ ] Phase filter works
- [ ] Therapeutic area filter works
- [ ] Can click into program details
- [ ] Can edit program (if have permissions)
- [ ] Edits persist after page refresh
- [ ] Studies and milestones load correctly
- [ ] Page loads are fast (<500ms for program list)

### Performance Check:

Run these to verify optimization:

```bash
# Generate 1000 programs for testing
# Edit prisma/seed.ts: change count to 1000
npm run db:seed

# Time a query (should be <100ms)
time curl "http://localhost:3000/api/programs?page=1&limit=20"

# Test search (should be <200ms)
time curl "http://localhost:3000/api/programs?search=cardio"
```

## Rollback Plan

If you need to rollback to the old version:

```bash
# Restore original files
mv app/page-original.tsx app/page.tsx
mv app/programs/[id]/page-original.tsx app/programs/[id]/page.tsx

# Restart dev server
npm run dev
```

The mock data system will work exactly as before.

## Next Steps After Migration

1. **Configure for Production**
   - Switch from SQLite to PostgreSQL
   - Set up proper DATABASE_URL in production
   - Add authentication

2. **Add More Features**
   - Create new programs from UI
   - Delete programs
   - Export to CSV/Excel
   - Advanced filtering

3. **Optimize Further**
   - Add Redis caching
   - Implement search indexing (ElasticSearch/Algolia)
   - Add real-time updates (WebSockets)

## Getting Help

If you encounter issues:
1. Check the OPTIMIZATION_README.md
2. Verify all dependencies are installed
3. Make sure database is seeded
4. Check browser console for errors
5. Check terminal for API errors

## Summary

This migration transforms your app from:
- ❌ In-memory mock data
- ❌ Client-side everything
- ❌ No persistence

To:
- ✅ Database-backed
- ✅ Server-side pagination & filtering  
- ✅ Persistent edits
- ✅ Production-ready scalability

The UI remains the same, but the backend is now enterprise-grade!
