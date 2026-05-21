# Skipr Onboarding Portal

A modern, clean SaaS onboarding platform for configuring mobility programs. Built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Client Portal**: 3 visible tabs (Client Information, Mobility Programs, GO LIVE Planning)
- **Internal Backoffice**: Access to all tabs including internal-only sections
- **Per-field Autosave**: Changes are saved automatically as you type
- **Progress Tracking**: Visual indicators showing completion status
- **Session Persistence**: Resume where you left off anytime
- **Clean Design**: Linear/Notion-inspired minimalist interface

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS
- **Database**: SQLite + Prisma ORM
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
npx prisma db push
```

This creates the SQLite database and tables.

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Session

1. Go to the homepage
2. Enter your name and email
3. Choose portal type:
   - **Client Portal**: See only the 3 client-facing tabs
   - **Backoffice**: Access all tabs including internal sections
4. Click "Start Onboarding"

### Client Portal

The client sees 3 tabs:
- 🤝 **Client Information**: Company details, contacts, objectives
- 🚀 **Mobility Program(s)**: Program configuration, services, budget
- 📢 **GO LIVE Planning**: Communication plan, timeline, stakeholders

All fields auto-save after 500ms of inactivity.

### Internal Backoffice

The internal team sees all tabs:
- All 3 client tabs (above)
- ✅ **KYC Documents**: Document checklist
- 📚 **CSM Overview**: Customer success tracking
- ✍️ **CSM Notes**: Internal notes

**Features**:
- Toggle between "Client View" and "Full View"
- See overall client progress
- View what's completed vs. pending
- Add internal notes not visible to clients

## Project Structure

```
skipr-onboarding/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── dev.db              # SQLite database (generated)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── autosave/   # Field auto-save endpoint
│   │   │   └── session/    # Session management
│   │   ├── client/         # Client portal
│   │   ├── backoffice/     # Internal backoffice
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Homepage
│   │   └── globals.css
│   ├── components/
│   │   ├── FormField.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── TabNavigation.tsx
│   └── lib/
│       ├── db.ts           # Prisma client
│       └── types.ts        # Sheet definitions
└── package.json
```

## Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `name`: User name
- `role`: CLIENT | INTERNAL | ADMIN

### OnboardingSession
- `id`: Session identifier
- `userId`: Reference to User
- `companyName`: Client company name
- `status`: IN_PROGRESS | COMPLETED | ARCHIVED

### FormField
- `id`: Field identifier
- `sessionId`: Reference to Session
- `sheetName`: Tab name
- `fieldKey`: Field identifier
- `fieldValue`: Field content
- `fieldType`: TEXT | TEXTAREA | SELECT | etc.
- `completed`: Boolean flag

## Customization

### Adding New Fields

Edit `src/lib/types.ts` and update the `SHEET_DEFINITIONS` array:

```typescript
{
  key: 'new_field',
  label: 'New Field Label',
  type: 'text', // or 'textarea', 'select', 'date', etc.
  placeholder: 'Enter value...',
  required: true,
  section: 'Section Name'
}
```

### Adding New Tabs

Add a new sheet definition to `SHEET_DEFINITIONS`:

```typescript
{
  name: 'new-tab',
  title: 'New Tab',
  emoji: '🎯',
  visibleToClient: false, // true for client-facing
  sections: [
    {
      title: 'Section Title',
      fields: [...]
    }
  ]
}
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npm run db:studio

# Push schema changes to database
npm run db:push
```

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Vercel will auto-detect Next.js
4. Deploy!

**Note**: For production, replace SQLite with PostgreSQL:
1. Update `prisma/schema.prisma` datasource
2. Add `DATABASE_URL` environment variable
3. Run `npx prisma db push`

### Environment Variables

For production, set:
```
DATABASE_URL=postgresql://user:pass@host:5432/db
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
