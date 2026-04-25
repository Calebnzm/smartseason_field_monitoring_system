# SmartSeason Frontend - Quick Start Guide

## 🚀 Start Development (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- Backend running on `http://localhost:8000`

### Setup Steps

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file**
   ```bash
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api" > .env.local
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔐 Demo Credentials

**Email:** `admin@example.com`  
**Password:** `admin123`

## 📂 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home (redirect)
│   ├── login/page.tsx           # Login page (themed)
│   ├── accept-invite/page.tsx   # Accept invite page
│   ├── dashboard/page.tsx       # Admin dashboard with stats
│   ├── fields/
│   │   ├── page.tsx             # Fields list (searchable, filterable)
│   │   ├── create/page.tsx      # Create field form
│   │   └── [id]/
│   │       ├── page.tsx         # Field detail view
│   │       └── edit/page.tsx    # Edit field form
│   ├── layout.tsx               # Root layout with auth provider
│   └── globals.css              # Design tokens & component styles
│
├── components/                   # Reusable UI Components
│   ├── Header.tsx               # Navigation header (responsive)
│   ├── Button.tsx               # Multi-variant button
│   ├── FormInput.tsx            # Text input with validation
│   ├── FormSelect.tsx           # Select dropdown
│   ├── FormTextarea.tsx         # Textarea field
│   ├── Modal.tsx                # Modal dialog
│   ├── Alert.tsx                # Alert messages
│   ├── FieldCard.tsx            # Field card (legacy, can remove)
│   └── LoadingSpinner.tsx       # Loading spinner (legacy, can remove)
│
├── lib/                         # Utilities & Hooks
│   ├── api.ts                   # Axios client + types
│   ├── auth-context.tsx         # Authentication context
│   └── schemas.ts               # Zod validation schemas
│
├── public/                      # Static assets
├── package.json                 # Dependencies & scripts
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
└── .env.example                 # Environment variables template
```

## 🎨 Design System

### Colors
- **Primary:** `#2d5016` (Dark Green)
- **Secondary:** `#7cb342` (Light Green)
- **Accent:** `#f57c00` (Orange)
- **Background:** `#f8f7f4` (Off-white)
- **Surface:** `#ffffff` (White)

All colors defined as CSS variables in `app/globals.css` for easy customization.

### Components Available
- `.btn` - Base button
- `.btn-primary` - Primary action
- `.btn-secondary` - Secondary action
- `.btn-outline` - Outlined button
- `.btn-ghost` - Ghost button
- `.btn-danger` - Destructive action
- `.card` - Card container
- `.form-input` - Text input
- `.form-select` - Select dropdown
- `.form-textarea` - Textarea
- `.badge` - Status badge
- `.alert` - Alert message
- `.table` - Data table

## 🔄 API Integration

The frontend communicates with Django backend via REST API:

### Key Endpoints
- `POST /api/auth/login/` - Login with email/password
- `POST /api/auth/accept-invite/` - Accept invitation and create account
- `GET /api/fields/` - List all fields
- `POST /api/fields/` - Create field
- `GET /api/fields/{id}/` - Get field details
- `PUT /api/fields/{id}/` - Update field
- `DELETE /api/fields/{id}/` - Delete field
- `GET /api/fields/{id}/updates/` - Get field updates

All requests automatically include JWT token in `Authorization: Bearer <token>` header.

## 🔑 Authentication Flow

1. User logs in with email/password
2. Backend returns `access_token` and `refresh_token`
3. Tokens stored in `localStorage`
4. Auth context manages authentication state
5. Protected pages redirect to login if not authenticated
6. Token automatically included in all API requests

## 📋 Available Pages

### Public Pages
- `/login` - Login page
- `/accept-invite?token=...` - Accept invitation link

### Protected Pages (Require Authentication)
- `/dashboard` - Overview with statistics
- `/fields` - Browse all fields
- `/fields/create` - Create new field
- `/fields/[id]` - View field details
- `/fields/[id]/edit` - Edit field

## 🧪 Testing Locally

### With Mock Data
1. Start backend
2. Login with demo credentials
3. Navigate through all pages
4. Test CRUD operations on fields

### Full Integration Testing
1. Create multiple test fields
2. Test search and filtering
3. Test edit and delete operations
4. Test different user roles
5. Test error scenarios

## 📦 Building for Production

```bash
# Build optimized bundle
npm run build

# Start production server
npm run start
```

## 🐛 Troubleshooting

### "Cannot reach API"
- Ensure backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Verify CORS is enabled in Django settings

### "Blank page after login"
- Check browser console for errors
- Verify token is saved in `localStorage`
- Ensure API is returning valid responses

### "Styles not applying"
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind CSS is configured correctly

## 📚 Additional Resources

- **Frontend Documentation:** `frontend/DOCUMENTATION.md`
- **Design System Guide:** `frontend/DESIGN_SYSTEM.md` (if exists)
- **Backend API Docs:** See backend `design.md`
- **Form Validation:** See `lib/schemas.ts`

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```bash
docker build -t smartseason-frontend .
docker run -p 3000:3000 smartseason-frontend
```

### Manual Deployment
1. Build: `npm run build`
2. Export: `npm run export` (if static export needed)
3. Deploy `.next` and `public` folders

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000/api` |

## ✅ Features Implemented

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Form validation with Zod
- ✅ JWT authentication
- ✅ Admin dashboard with stats
- ✅ Field CRUD operations
- ✅ Search and filtering
- ✅ Accept invite workflow
- ✅ Error handling and alerts
- ✅ Loading states
- ✅ Role-based UI
- ✅ Production build
- ✅ TypeScript types

## 📊 Project Statistics

- **Pages:** 8
- **Components:** 10+
- **API Integrations:** 7 endpoints
- **Validation Schemas:** 3
- **Design Tokens:** 20+
- **Build Size:** ~150KB (gzipped)

## 🎯 Next Steps

1. Start the dev server: `npm run dev`
2. Login with demo credentials
3. Explore the dashboard
4. Create test fields
5. Test all CRUD operations
6. Deploy when ready

---

**Version:** 1.0  
**Last Updated:** April 25, 2026  
**Status:** Production Ready ✅
