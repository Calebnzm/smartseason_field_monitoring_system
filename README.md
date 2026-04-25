# SmartSeason Field Monitoring System

This repository contains a miniature MVP for the SmartSeason Field Monitoring system. The system allows agents and coordinators to register and keep track of the status, stage, and health of agricultural fields during a growing season.

The purpose of this README is to outline the system architecture, setup instructions, design decisions, and assumptions made during development.

## Tech Stack

- **Backend:** Python / Django REST Framework
- **Database:** PostgreSQL
- **Frontend:** Next.js (React), TailwindCSS
- **Package Management:** `uv` (Backend), `npm` (Frontend)

## Entities

There are 4 main entities defined in the application:
1. **User:** Can be a superuser, an admin (coordinator), or a field agent.
2. **Field:** Represented by a name, location (GPS), crop type, planting date, current stage, etc.
3. **Field Update:** Associated with a field and contains notes describing observations made by the author.
4. **Satellite Data (Status Logic):** Key crop health indicators (NDVI and NDWI) are collected for each field location to compute the overall risk and status of the field.

## Authentication and Authorization

The system uses a 3-tier hierarchy of users, each with different roles and permissions, secured via role-based access control.

1. **Superuser:** Has absolute control over all entities. They can manage admins, agents, fields, and updates.
2. **Admins (Coordinators):** Can view all fields, monitor updates across agents, invite agents, and create/assign fields.
3. **Field Agents:** Have the least privileges. They can only view and update fields assigned to them.

### Invitation Flow
All admins are invited onto the platform by the superuser, and agents are invited by admins. The inviter creates a profile, and the invitee receives an email link to set their credentials.

## Field Stage and Status Logic

The system tracks a simple lifecycle for fields:
- **Stages:** Planted, Growing, Ready, Harvested.
- **Computed Statuses:** Active, At Risk, Completed.

**Business Logic:**
While agents manually update the *stage* of a field, the field *status* is computed using 2 health indicators: Normalized Difference Vegetation Index (NDVI) and Normalized Difference Water Index (NDWI). These indicators determine if crops are water-stressed or *At Risk*. A field transitions to *Completed* when it reaches the Harvested stage, otherwise it remains *Active*.

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL
- `uv` (Python package manager)

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Set up the environment and install dependencies using `uv`:
   ```bash
   uv sync
   ```
   *(Alternatively, if not using uv, you can use standard pip installation)*
3. Configure your environment variables. Create a `.env` file in the `server` directory and add your database credentials:
   ```env
   DB_NAME=smartseason
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   ```
4. Run database migrations:
   ```bash
   uv run python manage.py migrate
   ```
5. Start the backend development server:
   ```bash
   uv run python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:3000`.

## Design Decisions

- **Separation of Concerns:** The project is split into a standalone Next.js frontend and a Django REST API backend. This allows independent scaling and clear API contracts.
- **Computed Status over Manual Entry:** Instead of relying entirely on subjective human input for field status, it incorporates computed metrics (NDVI/NDWI) to determine if a field is "At Risk" or "Active". This provides a more data-driven approach to monitoring.
- **Role-Based Access Control (RBAC):** I implemented strict API-level permissions to ensure field agents cannot tamper with or view fields outside their jurisdiction, keeping data isolated and secure.
- **Invitation System:** Instead of open registration, an invite-only flow was chosen to ensure only authorized personnel have access to the system.

## Assumptions Made

- **Satellite Data Availability:** The logic assumes we can pull real-time NDVI and NDWI metrics for a field's GPS location. Due to project scope, these indicators are currently implemented as randomized dummy stubs.
- **Geographic Constraints:** The MVP assumes basic GPS point locations for fields rather than complex polygon boundaries.
- **Single Organization:** We assumed the system is used by a single agricultural organization rather than being a multi-tenant SaaS application.

## Demo Credentials

*(Please fill these in before your final submission)*
- **Admin (Coordinator):** `admin@example.com` / `password`
- **Field Agent:** `agent@example.com` / `password`


## Live Links

You can access the backend API at: 
You can access and use the live application at: 
