# SmartSeason Frontend - Implementation Guide

## Overview

This document explains the minimal, clean Next.js frontend implementation for the SmartSeason field monitoring system. The design prioritizes simplicity, clarity, and agricultural usability.

## File Structure

```
frontend/
├── app/
│   ├── page.tsx                 # Home page (redirects to dashboard or login)
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Global styles, design tokens, utility classes
│   ├── login/
│   │   └── page.tsx             # Login form page
│   ├── dashboard/
│   │   └── page.tsx             # Admin dashboard with metrics and fields table
│   └── fields/
│       ├── page.tsx             # Fields grid/list view
│       └── [id]/
│           └── page.tsx         # Field detail page with updates
│
├── components/
│   ├── Header.tsx               # Navigation header with logout
│   ├── FieldCard.tsx            # Field card for grid display
│   └── LoadingSpinner.tsx       # Reusable loading state
│
├── lib/
│   └── api.ts                   # Axios API client with interceptors
│
├── public/                       # Static assets
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies
├── package-lock.json            # Lock file
└── README.md                     # Frontend setup instructions
```

## Design System Implementation

### Color Tokens (in globals.css)
```css
:root {
  --color-primary: #2d5016;      /* Dark green - main brand */
  --color-secondary: #7cb342;    /* Light green - accents */
  --color-accent: #f57c00;       /* Orange - CTAs */
  --color-background: #fafaf9;   /* Off-white - page bg */
  --color-surface: #ffffff;      /* White - cards */
  --color-text: #1a1a1a;         /* Near-black - body text */
  --color-text-secondary: #666;  /* Gray - secondary text */
  --color-border: #e0e0e0;       /* Light gray - borders */
}
```

### Utility Classes (in globals.css)
- `.card` - Card styling with shadow and border
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.btn-outline` - Outlined button styling
- `.status-active`, `.status-at-risk`, `.status-completed`, `.status-unknown` - Status badges
- `.stage-badge` - Field stage indicator

### Responsive Breakpoints
Uses Tailwind's default breakpoints:
- `md:` - 768px and up
- `lg:` - 1024px and up

## Page Descriptions

### Home Page (`app/page.tsx`)
**Purpose**: Redirect authenticated users to dashboard, unauthenticated to login  
**Flow**: Check localStorage for token → Navigate accordingly

### Login Page (`app/login/page.tsx`)
**Purpose**: User authentication  
**Features**:
- Username/password input
- Error message display
- Loading state during submission
- JWT token storage in localStorage
- Redirect to dashboard on success

### Dashboard Page (`app/dashboard/page.tsx`)
**Purpose**: Admin overview of all fields  
**Features**:
- Stats cards: Total, Active, At Risk, Completed counts
- Sortable fields table with columns for name, crop, stage, status, agent, planted date
- Real-time field data via SWR
- Mobile-responsive table

### Fields Page (`app/fields/page.tsx`)
**Purpose**: Browse all fields in grid or list format  
**Features**:
- Grid layout (3 columns on desktop, 1 on mobile)
- FieldCard component for each field
- Shows name, crop type, status, stage, planting date
- Clickable cards link to detail page

### Field Detail Page (`app/fields/[id]/page.tsx`)
**Purpose**: View detailed field information and update history  
**Features**:
- Field metadata (name, crop, location, days since planting)
- Current stage and status
- Assigned agent information
- Location coordinates
- Field updates timeline with author, date, and notes
- Back navigation to fields list

## Component Descriptions

### Header Component (`components/Header.tsx`)
```tsx
// Props: None
// Features:
// - Logo/brand name
// - Navigation links (Dashboard, Fields)
// - Logout button
// - Responsive on mobile
```

### FieldCard Component (`components/FieldCard.tsx`)
```tsx
interface Props {
  field: Field
}
// Renders a clickable card with:
// - Field name and crop type
// - Status badge (color-coded)
// - Stage indicator
// - Planting date
// - Assigned agent (if any)
// - Links to detail page on click
```

### LoadingSpinner Component (`components/LoadingSpinner.tsx`)
```tsx
// Simple animated spinner for loading states
// Centered on screen with rotate animation
```

## API Integration

### API Client (`lib/api.ts`)
- Axios instance with base URL from environment
- Auto-includes JWT token in Authorization header
- Handles 401 responses (token expired)
- Clears storage and redirects to login on auth failure

### Key Endpoints Used
```
GET  /fields/              - List all fields
GET  /fields/{id}/         - Get field details
GET  /fields/{id}/updates/ - Get field updates
POST /auth/login/          - Authenticate user
```

## Data Fetching Strategy

### SWR (Stale-While-Revalidate)
Used for all data fetching because it provides:
- Automatic caching
- Background revalidation
- Error handling
- Loading states
- Deduplication of requests

Example:
```tsx
const { data: fields, isLoading, error } = useSWR<Field[]>(
  isAuthed ? '/fields/' : null,
  fetcher
);
```

## Authentication Flow

1. User accesses app
2. Home page checks localStorage for `access_token`
3. If token exists → redirect to /dashboard
4. If no token → redirect to /login
5. User submits credentials
6. Backend validates → returns `access` and `refresh` tokens
7. Frontend stores in localStorage
8. Subsequent requests include token in Authorization header
9. On 401 → clear storage and redirect to /login

## Styling Approach

### CSS Variables (Design Tokens)
All colors defined in `:root` and referenced throughout  
Makes theme changes simple (single point of edit)

### Tailwind CSS
- Utility-first approach for responsive layouts
- Custom colors via CSS variables
- Semantic classes from globals.css for common patterns
- Mobile-first responsive design

### No Component Library
Intentionally minimal - uses basic HTML elements and Tailwind  
Makes code easy to understand and customize

## Type Safety

### TypeScript Interfaces
All data structures typed:
```tsx
interface Field {
  id: number;
  name: string;
  crop_type: string;
  stage: string;
  status: string;
  planting_date: string;
  latitude: number;
  longitude: number;
  assigned_agent?: { id: number; username: string } | null;
  created_at: string;
  updated_at: string;
}
```

## Environment Variables

### Required
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (e.g., `http://localhost:8000/api`)

Note: `NEXT_PUBLIC_` prefix makes variable available in browser  
Use this for API URLs, never for secrets

## Security Considerations

✅ JWT tokens for authentication  
✅ Tokens in localStorage (acceptable for SPA)  
✅ Auto-include tokens in API requests  
✅ Remove tokens on logout  
✅ Redirect to login on auth failure  
✅ Type safety prevents injection attacks  

⚠️ Note: For production with sensitive data, consider:
- HttpOnly cookies instead of localStorage
- CSRF protection
- Content Security Policy headers
- API rate limiting

## Performance Optimizations

- SWR deduplication prevents duplicate API calls
- Images optimized via next/image (not currently used)
- Code splitting via Next.js App Router
- Lazy loading of routes
- CSS variables avoid style recalculation

## Accessibility Features

- Semantic HTML (`<header>`, `<main>`, `<nav>`)
- ARIA labels on inputs
- Keyboard navigation support
- Color contrast meets WCAG standards
- Form labels properly associated
- Loading states communicated to users

## Testing the Frontend

1. **Locally with backend running**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Create test account in Django admin**:
   ```bash
   cd server
   python manage.py createsuperuser
   # Username: admin, Password: admin123
   ```

3. **Login to frontend**:
   - Go to http://localhost:3000
   - Enter admin credentials
   - Should see dashboard with fields (if any exist)

4. **Test CORS issues**:
   - Check browser console (F12)
   - Verify API URL in .env.local
   - Check backend CORS settings

## Customization Guide

### Change Colors
Edit `/frontend/app/globals.css`:
```css
:root {
  --color-primary: #your-color;
  /* ... */
}
```

### Add New Page
1. Create `/app/your-page/page.tsx`
2. Export default React component
3. Add navigation link in Header component

### Modify API Calls
Edit `/frontend/lib/api.ts` axios configuration  
Update endpoints in component `useSWR` calls

### Update Form Fields
Edit input elements in login or field forms  
Update interfaces in component files to match

## Common Patterns

### Protected Route
```tsx
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (!token) router.push('/login');
}, [router]);
```

### Data Fetching
```tsx
const { data, isLoading, error } = useSWR(
  isAuthed ? '/endpoint/' : null,
  fetcher
);
```

### Status Display
```tsx
<span className={`status-${field.status.toLowerCase()}`}>
  {field.status.replace('_', ' ')}
</span>
```

## Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] `.env.local` configured for production API
- [ ] Tested login flow
- [ ] Tested field viewing
- [ ] Mobile layout verified
- [ ] CORS configured on backend for frontend domain
- [ ] Backend running and accessible
- [ ] API endpoints responding correctly

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check console (F12), verify API URL |
| Login fails | Check credentials, verify backend running |
| Fields not loading | Check API endpoint, verify token in localStorage |
| CORS error | Backend needs to allow frontend domain |
| Styling looks broken | Clear .next folder, rebuild: `npm run build` |

## Next Steps for Enhancement

1. Add agent dashboard (filtered fields)
2. Add field creation form
3. Add field assignment UI
4. Add field update form
5. Map visualization for field locations
6. Real-time updates via WebSocket
7. Export/report functionality
8. User profile page
9. Search and filter fields
10. Satellite imagery display
