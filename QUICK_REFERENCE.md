# Quick Reference Card

## 🚀 Setup Commands (First Time)

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# 3. Activate optimized pages
mv app/page.tsx app/page-original.tsx
mv app/page-optimized.tsx app/page.tsx
mv app/programs/[id]/page.tsx app/programs/[id]/page-original.tsx
mv app/programs/[id]/page-optimized.tsx app/programs/[id]/page.tsx

# 4. Start development server
npm run dev
```

## 📝 Daily Development Commands

```bash
# Start dev server
npm run dev

# View database GUI
npm run db:studio

# Reset database with fresh seed data
npm run db:seed
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema changes to database
npm run db:push

# Create a migration (for production)
npm run db:migrate

# Seed database with test data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🔧 Troubleshooting Commands

```bash
# Reset everything
rm prisma/dev.db
npm run db:push
npm run db:seed

# Fix Prisma Client issues
npm run db:generate

# Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install
```

## 📂 File Structure

```
drug-portfolio-dashboard/
├── app/
│   ├── api/
│   │   └── programs/
│   │       ├── route.ts              # GET /api/programs (list with pagination)
│   │       └── [id]/
│   │           └── route.ts          # GET/PATCH /api/programs/:id
│   ├── programs/
│   │   └── [id]/
│   │       ├── page.tsx              # Optimized program detail page
│   │       └── page-original.tsx     # Original (backup)
│   ├── page.tsx                      # Optimized main page
│   └── page-original.tsx             # Original (backup)
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Seed script (generates test data)
│   └── dev.db                        # SQLite database (git-ignored)
├── lib/
│   ├── prisma.ts                     # Prisma client singleton
│   └── mockData.ts                   # Old mock data (for reference)
├── .env                              # Environment variables (git-ignored)
```

## 🌐 API Endpoints

### List Programs (Paginated)

```bash
# Basic
curl "http://localhost:3000/api/programs"

# With pagination
curl "http://localhost:3000/api/programs?page=2&limit=20"

# With search
curl "http://localhost:3000/api/programs?search=cardio"

# With filters
curl "http://localhost:3000/api/programs?phases=Phase%20I,Phase%20II&areas=Cardiology"

# Combined
curl "http://localhost:3000/api/programs?page=1&limit=20&search=heart&phases=Phase%20II&areas=Cardiology"
```

### Get Single Program

```bash
curl "http://localhost:3000/api/programs/PRG001"
```

### Update Program

```bash
curl -X PATCH "http://localhost:3000/api/programs/PRG001" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "indication": "New indication",
    "mechanism": "Updated mechanism"
  }'
```

## ⚙️ Configuration

### Change Database Provider

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

Then update `.env`:

```
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

### Adjust Pagination Size

Edit `app/page.tsx`:

```typescript
const [pagination, setPagination] = useState({
  page: 1,
  limit: 50, // Change from 20
  // ...
});
```

### Generate More Test Data

Edit `prisma/seed.ts`:

```typescript
const count = 1000; // Change from 100
```

Then run: `npm run db:seed`

## 🎯 Key Features

- ✅ Loads only 20 programs per page (adjustable)
- ✅ Debounced search (300ms delay)
- ✅ Multi-select filters (phases & therapeutic areas)
- ✅ Edits save to database and persist
- ✅ Fast queries with database indexes
- ✅ Loading states and error handling
- ✅ Pagination with page navigation

## 📊 Performance Metrics

| Metric        | Mock Data     | Optimized        |
| ------------- | ------------- | ---------------- |
| Initial load  | All programs  | 20 programs      |
| Search time   | O(n)          | O(log n)         |
| Filter time   | O(n)          | O(log n)         |
| Memory usage  | All data      | Paginated        |
| Edits persist | ❌ No         | ✅ Yes           |
| Scalability   | <100 programs | 10,000+ programs |

## 🔍 Database Schema Quick Reference

```prisma
model Program {
  id              String
  name            String
  code            String
  therapeuticArea String  @index
  phase           String  @index
  // ... more fields
  studies         Study[]
  milestones      Milestone[]
}

model Study {
  id        String
  name      String
  status    String  @index
  programId String  @index
  // ... more fields
}

model Milestone {
  id        String
  name      String
  status    String  @index
  programId String? @index
  studyId   String? @index
  // ... more fields
}
```

## 🐛 Common Issues

| Problem                   | Solution                             |
| ------------------------- | ------------------------------------ |
| "Prisma Client not found" | `npm run db:generate`                |
| "Table doesn't exist"     | `npm run db:push`                    |
| "No programs showing"     | `npm run db:seed`                    |
| TypeScript errors         | `npm run db:generate`                |
| API 404 errors            | Check file structure, restart server |
| Database locked           | Close Prisma Studio, restart         |

## 💡 Pro Tips

1. **Use Prisma Studio** for visual database management

   ```bash
   npm run db:studio
   ```

2. **Test with 1000+ programs** to verify performance

   ```typescript
   // In prisma/seed.ts
   const count = 1000;
   ```

3. **Monitor API response times** in Network tab
   - Program list: <100ms
   - Program detail: <200ms
   - Search: <200ms

4. **Use proper pagination params** for best performance
   - Limit: 20-50 (sweet spot)
   - Don't fetch more than needed

5. **Database indexes are crucial**
   - Already added for: therapeuticArea, phase, name, code
   - Add more if you filter by other fields often

## 📚 Resources

- [OPTIMIZATION_README.md](./OPTIMIZATION_README.md) - Full documentation
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration from mock data
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Need Help?** Check the full documentation or migration guide!
