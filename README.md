# SmartSeason Field Monitoring System

A full-stack agricultural field monitoring application with Django backend and Next.js frontend. Admins can view all farms, monitor field updates, and track crop progress across operations.

## Project Structure

```
smartseason_field_monitoring_system/
├── server/                 # Django REST API backend
│   ├── core/              # Django project settings
│   ├── users/             # User management
│   ├── fields/            # Field management and satellite data
│   ├── design.md          # Backend design documentation
│   └── manage.py
├── frontend/              # Next.js admin dashboard
│   ├── app/              # Pages and layouts
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities and API client
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser (admin account):
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

   Backend runs on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:3000`

## Demo Credentials

After creating a superuser during backend setup:

- **Username**: Your superuser username
- **Password**: Your superuser password

The system supports two roles:
- **Admin**: View all fields, assign fields to agents, monitor updates
- **Agent**: View assigned fields, add updates and observations

## Architecture & Design Decisions

### Backend (Django)
- **REST API**: Django REST Framework for clean, versioned API endpoints
- **Authentication**: JWT (JSON Web Tokens) for stateless authentication
- **Permissions**: Role-based access control (Admin, Agent)
- **Database**: PostgreSQL with Django ORM
- **Satellite Data**: Service layer for fetching and deriving field status from biophysical indicators (NDVI, NDWI, LAI, Biomass)

### Frontend (Next.js)
- **Framework**: Next.js 16 with App Router for modern React patterns
- **State Management**: SWR for data fetching, caching, and client-side state
- **Styling**: Tailwind CSS with custom design tokens
- **Design Inspiration**: Clean, agricultural-focused UI inspired by Shamba Connect
- **Architecture**: Simple pages + components structure without unnecessary complexity

### Data Flow
1. User logs in → Backend validates credentials → Returns JWT tokens
2. Tokens stored in localStorage → Included in all subsequent API requests
3. Frontend fetches field data from `/api/fields/` endpoint
4. Admin can view all fields; Agents see only assigned fields
5. Real-time updates visible through field update history

## Field Status Logic

Each field's status is derived from satellite data and biophysical indicators:

- **Active**: Plants detected on field (NDVI > threshold)
- **At Risk**: High water stress (NDWI < threshold) or anomalies detected
- **Completed**: Harvest confirmed or no crops on field
- **Unknown**: Insufficient or pending satellite data

See `server/design.md` for detailed business logic.

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login with username/password, returns access and refresh tokens

### Fields
- `GET /api/fields/` - List fields (admin sees all, agents see assigned)
- `POST /api/fields/` - Create a new field
- `GET /api/fields/{id}/` - Get field details
- `PUT /api/fields/{id}/` - Update field
- `POST /api/fields/{id}/assign/` - Assign field to agent (admin only)

### Field Updates
- `GET /api/fields/{id}/updates/` - Get field update history
- `POST /api/fields/{id}/updates/` - Add update to field

## Frontend Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Authentication page | Public |
| `/dashboard` | Admin overview with metrics | Admin |
| `/fields` | Browse all fields | All Authenticated |
| `/fields/{id}` | Field details and updates | All Authenticated |

## Styling & Design System

### Color Palette
- **Primary**: `#2d5016` (Dark Green) - Agricultural, natural feel
- **Secondary**: `#7cb342` (Light Green) - Accent and highlights
- **Accent**: `#f57c00` (Orange) - Call-to-action elements
- **Background**: `#fafaf9` (Off-white) - Easy on the eyes
- **Text**: `#1a1a1a` (Near-black) - Good readability

### Fonts
- **Display**: Geist (sans-serif) for clean, modern aesthetic
- **Body**: Same family for consistency

### Components
- Cards with subtle shadows and borders
- Status badges with semantic colors
- Responsive grid layouts (mobile-first)
- Minimal animations for performance

## Development Workflow

1. **Backend Changes**: Modify Django models/views in `server/`, restart development server
2. **Frontend Changes**: Edit React components in `frontend/`, hot-reload via Next.js
3. **API Changes**: Update both backend endpoints and frontend API client (`frontend/lib/api.ts`)

## Testing

### Backend
```bash
cd server
python manage.py test
```

### Frontend
```bash
cd frontend
npm run test  # Currently no tests configured
```

## Building for Production

### Backend
```bash
cd server
pip install gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### Frontend
```bash
cd frontend
npm run build
npm run start
```

Or deploy to Vercel for automatic builds and deployment.

## Deployment

### Django (Backend)
- Environment variables in `.env`
- Database migrations before deployment
- Static files collected
- Consider using production server (gunicorn, uWSGI)
- Enable CORS for frontend domain

### Next.js (Frontend)
- Environment variables in `.env.local`
- Built with `npm run build`
- Can be deployed to Vercel, Netlify, or any Node.js host

## Troubleshooting

### Backend Issues
- **Database errors**: Run `python manage.py migrate`
- **Import errors**: Check virtual environment is activated
- **CORS errors**: Verify frontend URL in Django CORS settings

### Frontend Issues
- **API not found**: Check `NEXT_PUBLIC_API_BASE_URL` matches backend URL
- **Blank pages**: Check browser console for errors
- **Login failing**: Verify backend is running and credentials are correct

## Key Features Implemented

✅ User authentication with JWT  
✅ Role-based access control (Admin/Agent)  
✅ Field creation and management  
✅ Field assignment to agents  
✅ Satellite data integration  
✅ Field status derivation from biophysical data  
✅ Admin dashboard with metrics  
✅ Field update history and observations  
✅ Responsive, clean UI  
✅ Minimal, maintainable codebase  

## Future Enhancements

- Real-time field updates via WebSockets
- Map visualization for field locations
- Advanced analytics and reporting
- Field performance comparisons
- Mobile app for field agents
- Email notifications for field status changes
- Historical satellite imagery view

## File Locations Reference

- Backend models: `server/fields/models.py`
- Backend API views: `server/fields/views.py`
- Backend serializers: `server/fields/serializers.py`
- Frontend pages: `frontend/app/`
- Frontend components: `frontend/components/`
- Design tokens: `frontend/app/globals.css` (CSS variables)

## Notes

- This is a minimal viable product (MVP) focused on clarity and functionality
- All components follow semantic HTML and accessibility best practices
- No unnecessary external dependencies or over-engineering
- Code is organized for easy navigation and modification
- Design is inspired by agricultural platforms like Shamba Connect
