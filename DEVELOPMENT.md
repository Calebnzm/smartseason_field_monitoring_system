# SmartSeason Frontend - Development Guide

## Architecture Overview

This is a production-grade Next.js 16 frontend application with:
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form + Zod validation
- **Data Fetching:** SWR + Axios
- **State Management:** React Context (Auth) + SWR (Data)

## Core Concepts

### Authentication Flow
1. **Login Page** → User submits email/password
2. **Auth API Call** → Backend validates and returns JWT tokens
3. **Token Storage** → Tokens saved to `localStorage`
4. **Auth Context** → Manages user state globally
5. **Protected Routes** → Pages check auth context, redirect if needed
6. **API Integration** → All requests auto-include bearer token

### Data Fetching Pattern
```typescript
// Using SWR for automatic caching and revalidation
const { data, error, isLoading } = useSWR(
  '/fields/',
  fetcher,
  { revalidateOnFocus: false }
);
```

### Form Handling
```typescript
// Using React Hook Form + Zod for validation
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

## File Organization

### `/app` - Next.js Pages
- Page components are Server Components by default (fast)
- Pages that need interactivity use `'use client'` directive
- Layouts wrap pages with common structure
- Dynamic routes use `[param]` convention

### `/components` - Reusable UI Components
- All components are client components (`'use client'`)
- Use TypeScript interfaces for props
- Follow consistent naming convention
- Example: `FormInput.tsx`, `Button.tsx`

### `/lib` - Utilities & Services
- `api.ts` - Axios client with interceptors
- `auth-context.tsx` - Authentication state management
- `schemas.ts` - Zod validation schemas

## Adding New Features

### Adding a New Form Field

1. Create component in `components/FormXxx.tsx`:
```typescript
import { forwardRef } from 'react';

interface FormXxxProps {
  label?: string;
  error?: FieldError;
  [key: string]: any;
}

export const FormXxx = forwardRef<HTMLInputElement, FormXxxProps>(
  ({ label, error, ...props }, ref) => (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input ref={ref} className="form-input" {...props} />
      {error && <span className="form-error">{error.message}</span>}
    </div>
  )
);
FormXxx.displayName = 'FormXxx';
```

2. Export from component imports and use in forms.

### Adding a New Page

1. Create file: `app/[section]/page.tsx`
2. Add to navigation if needed in `Header.tsx`
3. Use appropriate layout if needed
4. Follow auth pattern for protected pages

Example:
```typescript
'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (!user) return null;

  return <div>Page content here</div>;
}
```

### Adding a New API Endpoint

1. Add type to `lib/api.ts`:
```typescript
export interface MyData {
  id: number;
  name: string;
  // ... other fields
}
```

2. Use in component:
```typescript
const { data, isLoading } = useSWR<MyData[]>(
  '/my-endpoint/',
  fetcher
);
```

3. For mutations (POST/PUT/DELETE):
```typescript
const handleCreate = async (data: MyData) => {
  try {
    const response = await api.post('/my-endpoint/', data);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Styling Approach

### Design Tokens
All colors and spacing are CSS variables in `app/globals.css`:
```css
:root {
  --color-primary: #2d5016;
  --color-text: #1a1a1a;
  --spacing-lg: 1.5rem;
  /* etc */
}
```

### Using in Components
```tsx
// CSS classes
<div className="text-[var(--color-text)] p-[var(--spacing-lg)]">

// Or with Tailwind
<div className="text-[var(--color-text)] p-lg">
```

### Adding Custom Styles
1. Add to `@layer components` in `app/globals.css`
2. Use design tokens for consistency
3. Follow BEM naming for complex components

## Component Patterns

### Button Component
```typescript
<Button 
  variant="primary"    // primary, secondary, outline, ghost, danger
  size="md"           // sm, md, lg
  isLoading={false}   // shows spinner
  icon={<Icon />}     // optional icon
  className="w-full"  // additional classes
>
  Click me
</Button>
```

### Form Input
```typescript
<FormInput
  label="Email"
  type="email"
  placeholder="user@example.com"
  required
  error={errors.email}
  {...register('email')}
/>
```

### Alert Component
```typescript
<Alert
  type="error"        // success, error, warning, info
  title="Error"
  message="Something went wrong"
  onClose={() => setError(null)}
/>
```

### Modal Component
```typescript
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  {/* content */}
</Modal>
```

## State Management

### Auth Context
```typescript
const { user, isLoading, login, logout, acceptInvite } = useAuth();
```

### Data Fetching with SWR
```typescript
const { data, error, isLoading, mutate } = useSWR(url, fetcher);

// Revalidate on demand
await mutate();
```

### Form State
```typescript
const { register, handleSubmit, formState: { errors } } = useForm();
```

## Error Handling

### API Error Handling
```typescript
try {
  await api.post('/endpoint', data);
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired, user will be logged out
  } else if (error.response?.status === 400) {
    // Validation error
    setError(error.response.data.detail);
  }
}
```

### Form Validation Errors
```typescript
{errors.fieldName && (
  <span className="form-error">
    {errors.fieldName.message}
  </span>
)}
```

## Performance Optimization

### Image Optimization
Use Next.js Image component for images:
```typescript
import Image from 'next/image';

<Image 
  src="/image.png" 
  alt="description" 
  width={400} 
  height={300}
/>
```

### Code Splitting
- Pages are automatically code-split
- Use dynamic imports for heavy components:
```typescript
const HeavyComponent = dynamic(() => import('@/components/Heavy'));
```

### Caching Strategy
- SWR handles data caching automatically
- Set `revalidateOnFocus: false` for less frequent updates
- Use `mutate()` to revalidate on demand

## Testing

### Manual Testing Checklist
- [ ] All forms submit correctly
- [ ] Validation shows error messages
- [ ] API errors display alerts
- [ ] Loading states show spinner
- [ ] Mobile responsive layout works
- [ ] Navigation between pages works
- [ ] Auth redirects work correctly
- [ ] Logout clears data
- [ ] Search and filters work
- [ ] CRUD operations work

### Browser DevTools
1. **Network Tab** - Check API calls
2. **Console** - Check for errors
3. **Application/Storage** - Check localStorage tokens
4. **Elements** - Inspect component structure

## Debugging

### Enable Debug Logging
Add to any component:
```typescript
console.log("[v0] Debug message:", variable);
```

### Check Auth State
```typescript
const { user } = useAuth();
console.log("[v0] Current user:", user);
```

### Verify API Calls
Open Network tab in DevTools and check:
- Request headers (has Authorization token?)
- Response status (200, 400, 401, etc)
- Response body (contains expected data?)

## Common Issues & Solutions

### Issue: Blank page after login
**Solution:** Check browser console for errors, verify API returns valid response

### Issue: "Cannot reach API"
**Solution:** Check `NEXT_PUBLIC_API_BASE_URL`, verify backend is running

### Issue: Styles not applying
**Solution:** Clear `.next` folder, rebuild project

### Issue: Token not persisting
**Solution:** Check localStorage is not disabled, check auth context

## Build & Deployment

### Development
```bash
npm run dev          # Start dev server on :3000
```

### Production Build
```bash
npm run build        # Build optimized bundle
npm run start        # Start production server
```

### Environment Setup
Copy `.env.example` to `.env.local` and configure:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Code Quality

### TypeScript
- All files use strict TypeScript
- Components have proper type definitions
- API responses have interfaces

### Code Style
- Use consistent naming conventions
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use meaningful variable names

### Comments
- Add comments for complex logic
- Document component purpose
- Explain "why" not "what"

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [SWR Data Fetching](https://swr.vercel.app)

---

**Last Updated:** April 25, 2026
