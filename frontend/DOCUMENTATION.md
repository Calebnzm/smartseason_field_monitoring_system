# SmartSeason Field Monitoring System - Frontend Documentation

## Overview

The frontend is a modern Next.js 16 application built with React, TypeScript, and Tailwind CSS. It provides an intuitive interface for managing agricultural field monitoring with role-based access control for admins and field agents.

## Architecture

### Technology Stack

- **Framework**: Next.js 16 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: SWR (Stale-While-Revalidate) for data fetching
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios-based API wrapper

### Project Structure

```
frontend/
├── app/                           # Next.js app directory
│   ├── layout.tsx                 # Root layout with auth context
│   ├── globals.css                # Global styles and design tokens
│   ├── login/page.tsx             # Login page
│   ├── accept-invite/page.tsx     # Invitation acceptance flow
│   ├── dashboard/page.tsx         # Main dashboard
│   └── fields/
│       ├── page.tsx               # Fields listing with filters
│       ├── create/page.tsx        # Create new field form
│       └── [id]/
│           ├── page.tsx           # Field detail view
│           └── edit/page.tsx      # Edit field form
├── components/                    # Reusable React components
│   ├── Button.tsx                 # Primary button component
│   ├── Alert.tsx                  # Alert/notification component
│   ├── Modal.tsx                  # Modal dialog component
│   ├── FormInput.tsx              # Form input wrapper
│   ├── FormSelect.tsx             # Form select wrapper
│   ├── FormTextarea.tsx           # Form textarea wrapper
│   ├── Header.tsx                 # Navigation header
│   └── FieldCard.tsx              # Field card component
├── lib/
│   ├── api.ts                     # API client configuration
│   ├── auth-context.tsx           # Authentication context provider
│   ├── schemas.ts                 # Zod validation schemas
│   └── hooks/                     # Custom React hooks
├── public/                        # Static assets
└── next.config.js                 # Next.js configuration
```

## Key Features

### 1. Authentication Flow

**Pages Involved:**
- `/login` - User login with username/password
- `/accept-invite` - New user account setup via invitation link

**Authentication Context** (`lib/auth-context.tsx`)
- Manages user session state
- Handles token storage and refresh
- Provides login, logout, and acceptInvite methods
- Redirects unauthenticated users to login

### 2. Field Management

#### Dashboard (`/dashboard`)
- Overview with field statistics
- Quick stats: Total Fields, Active, At Risk, Completed
- Table preview of recent fields (max 5)
- Admin-only "Create Field" button

#### Fields List (`/fields`)
- Complete field directory with search and filtering
- Search by field name or crop type
- Filter by health status (Active, At Risk, Completed)
- Card-based grid layout
- Admin-only creation access

#### Create Field (`/fields/create`)
- **Admin-only page**
- Form sections:
  - Basic Information: name, crop type, size, planting date
  - Location: latitude, longitude (GPS coordinates)
  - Assignment: select field agent
- Client-side validation with Zod
- Success notification with redirect to detail view

#### Field Detail (`/fields/[id]`)
- Comprehensive field information
- Health status and current stage badges
- Two-column layout:
  - Field Information (size, crop type, days since planting)
  - Location & Assignment (GPS, planting date, agent)
- Field Updates Timeline (if available)
- Admin-only Edit and Delete actions
- Delete confirmation flow

#### Edit Field (`/fields/[id]/edit`)
- **Admin-only page**
- Pre-populated form with current field data
- Same validation as creation
- Success notification with redirect to detail

### 3. Component System

#### Button Component (`components/Button.tsx`)
```typescript
<Button 
  variant="primary|outline|ghost|danger"
  size="sm|md|lg"
  isLoading={boolean}
  icon={ReactNode}
  onClick={handler}
>
  Label
</Button>
```

#### Alert Component (`components/Alert.tsx`)
```typescript
<Alert
  type="success|error|warning|info"
  title="Alert Title"
  message="Alert message"
  onClose={() => {}}
/>
```

#### Form Components
- `FormInput` - Text, email, password, number, date inputs
- `FormSelect` - Dropdown with options array
- `FormTextarea` - Multi-line text input
All support error display and helper text

### 4. Data Fetching with SWR

Pattern used throughout the app:
```typescript
const { data, error, isLoading } = useSWR(
  condition ? '/api/endpoint' : null,
  fetcher,
  { revalidateOnFocus: false }
);
```

Benefits:
- Automatic caching
- Background revalidation
- Built-in error handling
- Stale-while-revalidate pattern

### 5. Form Validation

Zod schemas defined in `lib/schemas.ts`:
- `loginSchema` - Email/password validation
- `acceptInviteSchema` - Username, password, confirmation
- `createFieldSchema` - All field creation fields
- `updateFieldSchema` - All field update fields

React Hook Form integration:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## Styling System

### Design Tokens (`app/globals.css`)

**Colors:**
- Primary: `#2d5016` (agricultural green)
- Secondary: `#7cb342` (light green)
- Accent: `#f57c00` (orange)
- Status Colors: success, warning, danger, info
- Neutrals: background, surface, text, borders

**Components:**
- `.card` - Elevated container with border
- `.badge` - Small status indicator
- `.stage-badge` - Development stage indicator
- `.alert` - Alert container with type variants
- `.btn-*` - Button variants
- `.form-*` - Form control classes

### Responsive Design

Tailwind breakpoints:
- `md:` - tablets and larger
- `lg:` - desktops and larger

Examples:
- Dashboard: 1-col mobile → 2-col tablet → 4-col desktop
- Fields: 1-col mobile → 2-col tablet → 3-col desktop

## API Integration

### API Client (`lib/api.ts`)

- Axios wrapper with automatic base URL
- Token injection in request headers
- Response data extraction
- Error handling

### Endpoints Used

```
GET    /fields/              # List all fields
POST   /fields/              # Create field
GET    /fields/{id}/         # Get field details
PATCH  /fields/{id}/         # Update field
DELETE /fields/{id}/         # Delete field
GET    /fields/{id}/updates/ # Get field updates
GET    /auth/login/          # Login endpoint
POST   /invitations/verify/  # Verify invite token
POST   /auth/accept-invite/  # Accept invitation
GET    /users/?role=agent    # List agents
```

## Environment Configuration

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The `NEXT_PUBLIC_` prefix makes it available in the browser.

## Authentication Flow Details

### Login Flow
1. User enters email/password on `/login`
2. Submit to backend `/auth/login/`
3. Receive `access` and `refresh` tokens
4. Store tokens in auth context
5. Redirect to `/dashboard`

### Invitation Flow
1. User receives invitation link: `/accept-invite?token=xxx`
2. Token verified with backend
3. User creates username and password
4. Account setup completed
5. Auto-login and redirect to dashboard

### Token Refresh
- Handled automatically by auth context
- Refresh token used when access token expires
- Failed refresh redirects to login

## Performance Optimizations

1. **Code Splitting**: Next.js automatically splits routes
2. **Image Optimization**: Use next/image for images
3. **Data Caching**: SWR cache + manual revalidation
4. **CSS-in-JS**: Tailwind with purge optimization
5. **Bundle Analysis**: Monitor with `next/bundle-analyzer`

## Development Guide

### Adding a New Page

1. Create file: `app/new-page/page.tsx`
2. Add 'use client' directive if using hooks
3. Import necessary components and utilities
4. Structure with semantic HTML

Example:
```typescript
'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function NewPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page content */}
    </div>
  );
}
```

### Adding a New Component

1. Create: `components/NewComponent.tsx`
2. Export as named or default export
3. Document props with TypeScript interface
4. Use Tailwind for styling

### Adding Form Validation

1. Add schema to `lib/schemas.ts`
2. Use in form with React Hook Form:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(newSchema),
});
```

## Error Handling

### API Errors
```typescript
try {
  const result = await api.post('/endpoint', data);
} catch (err: any) {
  const errorMsg = err.response?.data?.detail || 'Failed';
  setError(errorMsg);
}
```

### Form Validation Errors
Automatically displayed via FormInput:
```typescript
<FormInput error={errors.fieldName} />
```

### Authentication Errors
- Auto-redirect to login on 401
- Show error toast/alert to user
- Clear stored tokens

## Deployment

### Building
```bash
npm run build
```

### Serving
```bash
npm start
```

### Environment Variables
Set `NEXT_PUBLIC_API_URL` in Vercel project settings.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive components
- Keyboard navigation support
- Color contrast compliance
- Form input labels and error messages

## Testing

Currently using manual testing. Consider adding:
- Jest + React Testing Library for unit tests
- E2E tests with Playwright or Cypress
- Visual regression testing

## Future Enhancements

1. **Real-time Updates**: WebSocket for live field data
2. **Mobile App**: React Native version
3. **Advanced Filtering**: Multi-select, date ranges
4. **Export**: PDF/CSV export for fields
5. **Analytics Dashboard**: Charts and metrics
6. **Notifications**: Push notifications for alerts
7. **Offline Mode**: Service workers for offline access
8. **Internationalization**: Multi-language support
