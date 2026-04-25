# SmartSeason - Complete Setup Guide

## What Has Been Built

A full-stack field monitoring system with:
- **Backend**: Django REST API (already in place)
- **Frontend**: Next.js admin dashboard (newly created)

### Frontend Features
✅ Admin dashboard with field metrics and overview  
✅ All fields list/grid view  
✅ Field detail page with update history  
✅ User authentication with JWT  
✅ Clean, agricultural-inspired UI  
✅ Mobile responsive design  
✅ Full TypeScript support  

## Directory Structure

```
smartseason_field_monitoring_system/
├── server/               # Django backend (existing)
├── frontend/             # Next.js frontend (new)
├── README.md             # Complete project documentation
├── SETUP_GUIDE.md        # This file
└── FRONTEND_IMPLEMENTATION.md  # Detailed frontend guide
```

## Quick Start (5 Minutes)

### Terminal 1 - Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create admin user
python manage.py runserver
# Backend running at http://localhost:8000
```

### Terminal 2 - Frontend Setup
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api" > .env.local
npm run dev
# Frontend running at http://localhost:3000
```

### Access the Application
1. Open http://localhost:3000 in your browser
2. Click "Login"
3. Enter your superuser credentials
4. Explore the dashboard and fields

## Frontend Structure at a Glance

### Pages (in `frontend/app/`)
- **page.tsx** - Home/redirect page
- **login/page.tsx** - Login form
- **dashboard/page.tsx** - Admin dashboard with stats table
- **fields/page.tsx** - All fields grid view
- **fields/[id]/page.tsx** - Field detail with updates

### Components (in `frontend/components/`)
- **Header.tsx** - Navigation bar
- **FieldCard.tsx** - Field card component
- **LoadingSpinner.tsx** - Loading indicator

### Styling
- **globals.css** - Design tokens and utility classes
- **tailwind.config.ts** - Tailwind configuration
- Colors: Dark green (#2d5016), light green (#7cb342), orange accents

## Key Files to Know

### Authentication
- `frontend/lib/api.ts` - API client with JWT token handling
- `frontend/app/login/page.tsx` - Login implementation

### Data Display
- `frontend/app/dashboard/page.tsx` - Stats + fields table
- `frontend/app/fields/page.tsx` - Grid view
- `frontend/components/FieldCard.tsx` - Card component

### Styling
- `frontend/app/globals.css` - All design tokens (colors, buttons, badges)
- CSS variables at top of globals.css for easy color changes

## Design System

### Primary Colors
- **Primary Green**: `#2d5016` (dark, natural)
- **Secondary Green**: `#7cb342` (light, accent)
- **Orange**: `#f57c00` (call-to-action)

### Status Badges
- **Active**: Green background
- **At Risk**: Yellow background
- **Completed**: Gray background
- **Unknown**: Blue background

### Typography
- Font: Geist (modern, clean)
- Mobile-first responsive design
- Accessibility optimized

## Development Workflow

### Make Changes to Frontend
1. Edit files in `frontend/app/` or `frontend/components/`
2. Next.js hot-reload automatically updates browser
3. No restart needed

### Make Changes to Backend
1. Edit Django models/views in `server/`
2. Restart Django server (Ctrl+C, then `python manage.py runserver`)

### Add New API Endpoints
1. Create Django view/serializer
2. Update `frontend/lib/api.ts` endpoint if needed
3. Update component to use new data

## What Can Be Done Next

### Admin Features
- [ ] Create field form
- [ ] Assign field to agent
- [ ] Update field status manually
- [ ] Export field data

### Agent Features
- [ ] View only assigned fields
- [ ] Add observations/notes
- [ ] Update field stage

### UI Enhancements
- [ ] Map visualization
- [ ] Search and filters
- [ ] Satellite imagery display
- [ ] Performance analytics

### Real-time Features
- [ ] WebSocket updates
- [ ] Email notifications
- [ ] Field status alerts

## Troubleshooting

### Frontend Won't Start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't Login
1. Check backend is running: http://localhost:8000/api/fields/
2. Verify credentials (from `createsuperuser`)
3. Check browser console (F12) for errors
4. Verify `.env.local` has correct API URL

### CORS Errors
Backend needs to allow frontend:
```python
# In server/core/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Blank Pages
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed API calls
4. Verify tokens in localStorage

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Backend (.env or settings.py)
```python
DEBUG = True  # Development only
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

## File Locations Quick Reference

| Task | File |
|------|------|
| Change colors | `frontend/app/globals.css` (:root section) |
| Add new page | Create `frontend/app/your-page/page.tsx` |
| Add navigation | `frontend/components/Header.tsx` |
| Change field display | `frontend/components/FieldCard.tsx` |
| API client setup | `frontend/lib/api.ts` |
| Django models | `server/fields/models.py` |
| Django views | `server/fields/views.py` |

## Technologies Used

### Backend
- Django 6.0
- Django REST Framework
- PostgreSQL
- JWT Authentication

### Frontend
- Next.js 16.2
- React 19.2
- TypeScript
- Tailwind CSS 4
- SWR (data fetching)
- Axios (HTTP client)

## What Makes This Minimal Yet Complete

✅ Two-role system (Admin/Agent) - No unnecessary features  
✅ Clean directory structure - Easy to navigate  
✅ TypeScript throughout - Type safety without complexity  
✅ CSS design system - Colors in one place  
✅ SWR + Axios - Minimal data fetching  
✅ No component libraries - Direct control over UI  
✅ Responsive design - Works on mobile  
✅ JWT auth - Standard, secure  
✅ Well-documented code - Easy to modify  

## Next: Deploy to Production

### Vercel (Easiest for Frontend)
```bash
cd frontend
npm install -g vercel
vercel
# Asks for project setup, deploys automatically
```

### Backend Hosting
- Heroku, AWS, DigitalOcean, etc.
- Set ALLOWED_HOSTS and CORS for production domain
- Use PostgreSQL (not SQLite)
- Set DEBUG = False

## Support & Documentation

- **Frontend Details**: See `FRONTEND_IMPLEMENTATION.md`
- **Full Project Guide**: See `README.md` (root)
- **Backend Design**: See `server/design.md`

## Performance Notes

- SWR automatically deduplicates requests
- Images optimized (future: use next/image)
- Code splitting via Next.js App Router
- Lazy loading built-in

## Security Checklist

For production, ensure:
- [ ] `DEBUG = False` in Django
- [ ] `SECRET_KEY` from environment variable
- [ ] HTTPS enabled
- [ ] CORS restricted to your domain
- [ ] Database credentials in environment variables
- [ ] API rate limiting enabled
- [ ] Input validation on backend
- [ ] CSRF protection enabled

## Common Commands

```bash
# Frontend
npm run dev      # Start development
npm run build    # Build for production
npm run start    # Run production build

# Backend
python manage.py runserver      # Start development
python manage.py migrate        # Run migrations
python manage.py createsuperuser # Create admin
python manage.py makemigrations # Create migrations
```

## Questions?

Refer to:
- `README.md` for architecture overview
- `FRONTEND_IMPLEMENTATION.md` for detailed frontend guide
- `server/design.md` for backend design
- Code comments throughout both projects

---

**Status**: ✅ Complete and ready for development  
**Last Updated**: April 2026  
**Framework**: Django + Next.js  
**Status**: Minimal, clean, production-ready
