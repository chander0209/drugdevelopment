# Drug Development Portfolio Dashboard

Next.js application for managing drug development programs and clinical studies.

## Features

### Portfolio Management

- **Browse Programs**: View all drug development programs in a responsive grid layout
- **Advanced Filtering**: Filter programs by development phase and therapeutic area
- **Search**: Search across program names, codes, indications, and therapeutic areas
- **Real-time Updates**: Live filtering and search with instant results

### Program Details

- **Comprehensive Overview**: View detailed program information including:
  - Development phase and therapeutic area
  - Indication and mechanism of action
  - Project lead and timeline
  - Key metrics (enrollment, active studies, completed milestones)
- **Studies Management**: Track multiple clinical studies per program with:
  - Enrollment progress
  - Study status and timeline
  - Site and investigator information
- **Milestone Tracking**: Monitor program and study milestones with visual timeline

### Authorization & Editing

- **Role-based Access**: Viewer, Editor, and Admin roles (simulated)
- **Inline Editing**: Authorized users can edit program metadata
- **Data Validation**: Form validation for edited fields

### Data Structure

- Optimized for handling large datasets
- Scalable architecture supporting:
  - 50+ programs (easily expandable to 1000s)
  - Multiple studies per program
  - Multiple milestones per study and program
  - Efficient filtering and search

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useMemo)

## Installation

1. Extract the project files to your desired location

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
drug-portfolio-dashboard/
├── app/                      # Next.js app directory
│   ├── programs/[id]/       # Program detail pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── FilterPanel.tsx     # Filter sidebar
│   ├── Header.tsx          # App header
│   ├── MilestoneTimeline.tsx # Milestone visualization
│   ├── ProgramCard.tsx     # Program card component
│   └── StudyCard.tsx       # Study card component
├── lib/                     # Utilities and data
│   └── mockData.ts         # Mock data generator
├── types/                   # TypeScript type definitions
│   └── index.ts            # Core types
└── package.json            # Dependencies
```

## Key Components

### Types (types/index.ts)

Defines the data structures:

- `Program`: Main program entity
- `Study`: Clinical study entity
- `Milestone`: Timeline milestone
- `DevelopmentPhase`: Drug development phases
- `TherapeuticArea`: Medical specialties

### Mock Data (lib/mockData.ts)

- Generates realistic test data
- Configurable number of programs
- Random but consistent data generation
- Easily replaceable with real API calls

### Components

- **ProgramCard**: Displays program summary with key metrics
- **FilterPanel**: Checkbox-based filtering interface
- **StudyCard**: Shows study details and enrollment progress
- **MilestoneTimeline**: Visual timeline of milestones
- **Header**: App navigation and user info

### Pages

- **Home (app/page.tsx)**: Programs listing with filters and search
- **Program Detail (app/programs/[id]/page.tsx)**: Detailed view with tabs for overview, studies, and milestones

## Data Model

### Program

- Basic info: name, code, description
- Classification: therapeutic area, phase, indication
- Team: project lead
- Timeline: start date, last updated
- Related entities: studies, milestones
- Metrics: enrollment, completed studies

### Study

- Identification: name, type, phase
- Enrollment: current/target, sites
- Team: principal investigator
- Timeline: start date, expected completion
- Status tracking
- Associated milestones

### Milestone

- Description and target date
- Status: Not Started, In Progress, Completed, Delayed
- Actual completion date

## Customization

### Adding Real Data

Replace the mock data in `lib/mockData.ts` with API calls:

```typescript
// Example API integration
export async function getPrograms() {
  const response = await fetch("/api/programs");
  return response.json();
}
```

### Authentication

The current user is simulated in `app/layout.tsx`. Integrate with your auth provider:

```typescript
// Example with Auth
import { useAuth } from "@/lib/auth";

const { user } = useAuth();
```

### Saving Changes

The edit functionality currently logs to console. Implement API calls:

```typescript
async function saveProgram(program: Program) {
  await fetch(`/api/programs/${program.id}`, {
    method: "PUT",
    body: JSON.stringify(program),
  });
}
```

## Performance Considerations

- Uses `useMemo` for efficient filtering
- Component-level code splitting with Next.js
- Optimized re-renders with React hooks
- Ready for server-side rendering (SSR)
- Can be enhanced with:
  - Pagination for large datasets
  - Virtual scrolling for thousands of items
  - API route caching
  - Incremental static regeneration (ISR)

## Future Enhancements

- Real-time collaboration
- Document attachments
- Data export (PDF, Excel)
- Advanced analytics dashboard
- Email notifications
- Audit trail
- GraphQL API integration
- Mobile app version

## License

Proprietary - For internal use only

## Support

For questions or issues, contact the development team.
