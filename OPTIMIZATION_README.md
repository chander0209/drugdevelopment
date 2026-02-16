# Drug Portfolio Dashboard - Optimized for Large-Scale Data

## 🚀 Optimizations Implemented

This version includes significant optimizations for handling large numbers of programs efficiently:

### 1. **Database Integration with Prisma**
- SQLite for development (easily switchable to PostgreSQL/MySQL for production)
- Proper schema with relationships and indexes
- Database connection pooling

### 2. **Backend Pagination & Filtering**
- Server-side pagination to handle thousands of programs
- Efficient database queries with `skip` and `take`
- Indexed fields for faster lookups (phase, therapeuticArea, name, code)

### 3. **API Routes**
- `GET /api/programs` - Paginated program listing with filters
- `GET /api/programs/[id]` - Single program with full details
- `PATCH /api/programs/[id]` - Update program details

### 4. **Frontend Optimizations**
- Debounced search (300ms) to reduce API calls
- Loading states and error handling
- Pagination controls with page navigation
- Efficient re-rendering with proper state management

### 5. **Database Seeding**
- Script to generate 100+ test programs with studies and milestones
- Consistent seeded data for testing

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `@prisma/client` - Prisma Client for database queries
- `prisma` - Prisma CLI for migrations
- `tsx` - TypeScript executor for seed script

### Step 2: Set Up Database

1. Copy the environment file:
```bash
cp .env.example .env
```

2. For development, the default SQLite configuration works out of the box:
```
DATABASE_URL="file:./dev.db"
```

3. For production with PostgreSQL:
```
DATABASE_URL="postgresql://user:password@host:5432/drug_portfolio?schema=public"
```

### Step 3: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed database with 100 sample programs
npm run db:seed
```

### Step 4: Replace Old Files with Optimized Versions

The optimized versions have been created with `-optimized` suffix. To use them:

```bash
# Backup originals
mv app/page.tsx app/page-original.tsx
mv app/programs/[id]/page.tsx app/programs/[id]/page-original.tsx

# Use optimized versions
mv app/page-optimized.tsx app/page.tsx
mv app/programs/[id]/page-optimized.tsx app/programs/[id]/page.tsx
```

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Commands

```bash
# View database in Prisma Studio (GUI)
npm run db:studio

# Create a migration (for production)
npm run db:migrate

# Regenerate Prisma Client (after schema changes)
npm run db:generate

# Re-seed database with fresh data
npm run db:seed
```

## 📊 Performance Characteristics

### Before Optimization:
- ❌ All programs loaded in memory on every page load
- ❌ Client-side filtering of all programs
- ❌ No pagination
- ❌ Edits not persisted
- ❌ Poor performance with 100+ programs

### After Optimization:
- ✅ Only requested page of programs loaded (20 per page)
- ✅ Server-side filtering and search with database indexes
- ✅ Pagination with efficient SQL queries
- ✅ Edits saved to database and persist across sessions
- ✅ Scales to 10,000+ programs efficiently

### Database Indexes:
```sql
-- Indexes for fast lookups
CREATE INDEX "Program_therapeuticArea_idx" ON "Program"("therapeuticArea");
CREATE INDEX "Program_phase_idx" ON "Program"("phase");
CREATE INDEX "Program_name_idx" ON "Program"("name");
CREATE INDEX "Program_code_idx" ON "Program"("code");
```

## 🎯 API Endpoints

### List Programs (with pagination & filters)
```
GET /api/programs?page=1&limit=20&search=cardio&phases=Phase I,Phase II&areas=Cardiology
```

Parameters:
- `page` (default: 1) - Page number
- `limit` (default: 20) - Items per page
- `search` - Search in name, code, indication, or therapeutic area
- `phases` - Comma-separated phase filters
- `areas` - Comma-separated therapeutic area filters

Response:
```json
{
  "programs": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasMore": true
  }
}
```

### Get Single Program
```
GET /api/programs/PRG001
```

Returns full program with studies and milestones.

### Update Program
```
PATCH /api/programs/PRG001
Content-Type: application/json

{
  "description": "Updated description",
  "indication": "New indication",
  "mechanism": "Updated mechanism"
}
```

## 🔧 Customization

### Change Database Provider

Edit `prisma/schema.prisma`:

**For PostgreSQL:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**For MySQL:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

Then update your `.env` file with the appropriate connection string.

### Adjust Pagination Size

In `app/page-optimized.tsx`:
```typescript
const [pagination, setPagination] = useState({
  page: 1,
  limit: 50, // Change from 20 to 50
  // ...
});
```

### Add More Editable Fields

1. Update the API route `app/api/programs/[id]/route.ts`:
```typescript
const { description, indication, mechanism, projectLead } = body;

const updatedProgram = await prisma.program.update({
  where: { id: params.id },
  data: {
    description,
    indication,
    mechanism,
    projectLead, // Add new field
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  // ...
});
```

2. Update the frontend `app/programs/[id]/page-optimized.tsx` to make the field editable.

## 🎨 Key Features

### 1. **Efficient Pagination**
- Only loads 20 programs at a time
- Fast page switching
- Shows current position (e.g., "Showing 21-40 of 100 programs")

### 2. **Smart Search**
- 300ms debounce to avoid excessive API calls
- Searches across name, code, indication, and therapeutic area
- Uses database indexes for fast lookups

### 3. **Multi-Select Filters**
- Filter by multiple phases simultaneously
- Filter by multiple therapeutic areas
- Combines with search seamlessly

### 4. **Edit Functionality**
- Save edits to database
- Success/error messages
- Loading states while saving
- Optimistic UI updates

### 5. **Error Handling**
- Graceful error messages
- Retry functionality
- Loading states for all async operations

## 🧪 Testing with Large Datasets

To test with more programs:

Edit `prisma/seed.ts`:
```typescript
const count = 1000; // Change from 100 to 1000
```

Then run:
```bash
npm run db:seed
```

The system handles thousands of programs efficiently thanks to:
- Database indexing
- Server-side pagination
- Efficient SQL queries with LIMIT and OFFSET

## 📈 Scaling to Production

### Recommended Setup for Production:

1. **Use PostgreSQL** instead of SQLite
   - Better concurrent access
   - More robust
   - Better performance at scale

2. **Add Database Connection Pooling**
   - Configure in `lib/prisma.ts`
   - Prevents connection exhaustion

3. **Add Caching Layer**
   - Use Redis for frequently accessed data
   - Cache program lists for common filters

4. **Implement Rate Limiting**
   - Protect API endpoints
   - Use `next-rate-limit` or similar

5. **Add Database Replication**
   - Read replicas for GET requests
   - Primary for writes

6. **Optimize Queries Further**
   - Add compound indexes
   - Use database query optimization

## 🔐 Security Considerations

1. **Add Authentication**
   - Use NextAuth.js or similar
   - Protect API routes

2. **Validate Inputs**
   - Add Zod or similar validation
   - Sanitize user inputs

3. **Rate Limiting**
   - Prevent API abuse
   - Protect database

4. **Environment Variables**
   - Never commit `.env` file
   - Use secret management in production

## 🐛 Troubleshooting

### Database Connection Issues:
```bash
# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Prisma Client Not Found:
```bash
npm run db:generate
```

### TypeScript Errors:
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🤝 Contributing

When adding new features:
1. Update the Prisma schema if needed
2. Create/update API routes
3. Update frontend components
4. Test with large datasets
5. Update this README

---

Built with ❤️ using Next.js 14, Prisma, and TypeScript
