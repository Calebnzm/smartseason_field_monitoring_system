# SmartSeason Field Monitoring System - Frontend

A minimal, clean Next.js frontend for managing agricultural fields and monitoring crop progress.

## Features

- **Admin Dashboard**: View overview of all fields with key metrics
- **Fields Management**: Browse and view detailed information about fields
- **Field Details**: See field updates, satellite data indicators, and location
- **Authentication**: JWT-based login with token management
- **Responsive Design**: Mobile-friendly interface inspired by agricultural applications

## Architecture

```
frontend/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Home/redirect page
│   ├── login/        # Authentication page
│   ├── dashboard/    # Admin dashboard
│   ├── fields/       # Fields list and detail pages
│   └── globals.css   # Global styles and design tokens
├── components/       # Reusable components
│   ├── Header.tsx    # Navigation header
│   ├── FieldCard.tsx # Field card component
│   └── LoadingSpinner.tsx
├── lib/
│   └── api.ts        # API client with axios
└── public/           # Static assets
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

Use these credentials to test the admin dashboard:

- **Username**: `admin`
- **Password**: `admin123`

(These are configured in the Django backend)

## Design System

### Colors
- **Primary**: `#2d5016` (Dark Green) - Main brand color
- **Secondary**: `#7cb342` (Light Green) - Accent color
- **Accent**: `#f57c00` (Orange) - Call-to-action
- **Background**: `#fafaf9` (Off-white)
- **Surface**: `#ffffff` (White)

### Status Colors
- **Active**: Green (`#388e3c`)
- **At Risk**: Yellow (`#f57f17`)
- **Completed**: Gray
- **Unknown**: Blue

### Typography
- Font family: Geist (provided by Next.js)
- Spacing: Tailwind CSS scale (4px base unit)

## API Integration

The frontend communicates with the Django backend via:

- **Auth**: `POST /api/auth/login/` - Get JWT tokens
- **Fields**: `GET /api/fields/` - List all fields
- **Field Detail**: `GET /api/fields/{id}/` - Get field details
- **Updates**: `GET /api/fields/{id}/updates/` - Get field updates

Tokens are stored in `localStorage` and automatically included in requests via axios interceptors.

## Key Components

### Header
Navigation bar with logout functionality. Changes based on authentication state.

### FieldCard
Displays field information in a card grid format with status badge and stage indicator.

### Dashboard
Admin overview with:
- Key metrics (total fields, active, at risk, completed)
- Sortable fields table
- Quick status overview

### Field Details
Shows:
- Field metadata (name, crop, location)
- Current stage and status
- Days since planting
- Assigned agent
- Field update history

## Development Notes

- Uses **SWR** for data fetching and caching
- **Axios** for API requests with automatic token handling
- **Tailwind CSS** for styling with custom design tokens in `:root`
- **TypeScript** for type safety
- Client-side authentication check on protected routes

## Building for Production

```bash
npm run build
npm run start
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**API Connection Issues**:
- Ensure backend is running on the configured URL
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Check browser console for CORS errors

**Login Issues**:
- Verify credentials with backend
- Check localStorage for token storage
- Clear localStorage and try again if stuck on login

**Blank Pages**:
- Check browser console for errors
- Ensure API is returning valid JSON
- Verify authentication token is present in `localStorage`
