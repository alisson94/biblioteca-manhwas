# Biblioteca Manhwas - Frontend

Next.js frontend for the Biblioteca Manhwas application.

## Getting Started

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and update values if needed:

```bash
cp .env.local.example .env.local
```

### Development

```bash
npm run dev
```

The frontend will be available at `http://localhost:3001` (or the next available port).

### Build

```bash
npm run build
npm start
```

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (Phase 2)
- `src/lib/` - Utility functions and API client
- `src/types/` - TypeScript type definitions
- `public/` - Static assets

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/api/v1/`.

All API calls are handled through the `@/lib/api` module, which provides typed interfaces for:
- `manhwaApi` - Manhwa CRUD operations
- `linkApi` - Link management operations

## Development Phases

1. ✅ Phase 1: Next.js base setup (CURRENT)
2. Phase 2: Layout and visual identity
3. Phase 3: Data layer (API client)
4. Phase 4: Home page
5. Phase 5: Detail page
6. Phase 6: Forms and modals
7. Phase 7: Cleanup and transition
