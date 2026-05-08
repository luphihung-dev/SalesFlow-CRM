# SalesFlow CRM

SalesFlow CRM is a Salesforce-inspired CRM workspace for customers, opportunities, follow-up tasks, team visibility, and backend automation.

I built this project as a portfolio application for an Intern Software Engineer role where CRM concepts, Java backend fundamentals, frontend implementation, and business workflow understanding are relevant.

## Quick Links

- Live app: https://cedar-salesflow-crm.netlify.app
- Backend API: https://salesflow-crm-production.up.railway.app
- Repository: https://github.com/luphihung-dev/SalesFlow-CRM

## Demo Login

```text
Admin   | admin@crm.local   | Admin12345
Manager | manager@crm.local | Manager12345
Sales   | sales@crm.local   | Sales12345
```

Suggested demo path:

1. Login as Sales and create a contact.
2. Confirm the automatic follow-up task.
3. Create or update a deal in the pipeline.
4. Login as Manager and review team deals/tasks.
5. Login as Admin to verify full workspace access.

## Project Highlights

- Full-stack CRM app with React, Spring Boot, PostgreSQL, and JWT auth.
- Admin, Manager, and Sales permissions with team/owner-based visibility.
- Customer directory, deal pipeline, task queue, activity timeline, and analytics dashboard.
- Backend automation inspired by Salesforce Flow, Apex Trigger, and Approval Process concepts.
- Responsive UI for desktop and mobile, including mobile drawer navigation and notification panel.
- Live deployment on Netlify, Railway, and Neon PostgreSQL.

## Screenshots

Screenshots should be placed in `docs/screenshots/`.

```text
dashboard-desktop.png   Dashboard analytics
mobile-dashboard.png    Mobile dashboard/navigation
deals-pipeline.png      Deal pipeline board
customer-profile.png    Customer profile timeline
```

Recommended markdown once images are added:

```md
![Dashboard analytics](docs/screenshots/dashboard-desktop.png)
![Mobile dashboard](docs/screenshots/mobile-dashboard.png)
![Deal pipeline](docs/screenshots/deals-pipeline.png)
![Customer profile](docs/screenshots/customer-profile.png)
```

## Salesforce CRM Relevance

This project is not built directly on the Salesforce Platform. I chose a traditional full-stack implementation first to show that I can design and build the underlying web application concepts myself: data model, REST API, authentication, authorization, business logic, frontend screens, and deployment.

The domain is intentionally close to Salesforce CRM:

```text
Customer            -> Account / Contact
Deal                -> Opportunity
Task                -> Salesforce Task
Activity timeline   -> Activity History
Automation events   -> Flow / Apex Trigger-style automation
Approval flag       -> Approval Process concept
RBAC roles          -> Profile / Role / Permission Set / Sharing concepts
Analytics dashboard -> Reports / Dashboards
```

This makes the project a practical bridge into Salesforce, Apex, Trigger, and LWC training.

## Tech Stack

Backend:

- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL
- JWT authentication
- Maven

Frontend:

- React
- Vite
- Tailwind CSS
- Axios
- Recharts
- Lucide React icons

Deployment:

- Netlify for frontend
- Railway for backend
- Neon PostgreSQL for database

## Architecture

```text
React SPA
  -> Axios API client
  -> Spring Boot REST API
  -> Service-layer RBAC and business rules
  -> Spring Data JPA repositories
  -> PostgreSQL
```

Key backend packages:

```text
controller/    REST endpoints
service/       Business logic and RBAC checks
repository/    Spring Data JPA access
entity/        JPA entities and enums
security/      JWT filter, token service, user details
automation/    CRM automation event listener
event/         Domain events
dto/           Request/response boundaries
```

## Core Features

CRM workflow:

- Customer directory with status, country, phone validation, and profile pages.
- Deal pipeline board with stage changes and high-value approval signals.
- Task queue with overdue detection and completion flow.
- Activity timeline for notes, calls, emails, and automation logs.
- Dashboard analytics for revenue, conversion, pipeline, tasks, and activity.

Product experience:

- Global search across customers, deals, tasks, owners, stages, and teams.
- Notification center for overdue tasks and approval/high-value deal signals.
- Responsive desktop and mobile layouts.
- Demo data designed for HR/interviewer walkthroughs.

## Security And RBAC

Authentication:

- `POST /api/auth/login` verifies email/password through Spring Security.
- Successful login returns a JWT bearer token and user profile.
- Protected API requests require `Authorization: Bearer <token>`.

Authorization is enforced in backend services, not only in the UI.

```text
Admin
- Customers: view, create, edit, delete all
- Deals:     view, create, edit, delete all
- Tasks:     view, create, edit, delete all
- Settings:  access allowed

Manager
- Customers: view, create, edit team contacts
- Deals:     view, create, edit, delete team deals
- Tasks:     view, create, edit, delete team tasks
- Settings:  no access

Sales
- Customers: view, add, edit related contacts; no delete
- Deals:     view, create, edit own deals; no delete
- Tasks:     view, create, edit own tasks, mark done; no delete
- Settings:  no access
```

Design notes:

- Admin can see the entire workspace.
- Manager is scoped to one team.
- Sales is scoped to owned deals, assigned tasks, and related customers.
- Customer deletion is Admin-only; other roles use `INACTIVE` to preserve account history.
- Backend services re-check permissions before read/write/delete operations.

## Automation Rules

The backend uses Spring domain events to model Salesforce-style automation.

```text
Customer created
  -> Create a follow-up task due in 2 days
  -> Assign the task to the Sales user who created the customer

Deal created above $10,000
  -> Log a high-value activity note

Deal created above $50,000
  -> Require manager approval
  -> Log an approval note

Deal moved to CLOSED
  -> Log a closed-deal activity

Task moved to DONE
  -> Log task completion into the customer timeline

Task overdue
  -> Surface an alert in the notification center
```

Automation code:

```text
src/main/java/com/example/minicrm/automation
src/main/java/com/example/minicrm/event
```

## API Overview

Auth:

- `POST /api/auth/login`

Main resources:

- `GET /api/users`
- `GET /api/teams`
- `GET /api/customers`
- `GET /api/customers/{id}`
- `GET /api/deals`
- `GET /api/tasks`
- `GET /api/activities`

Create, update, and delete endpoints are protected by role and team rules in the service layer.

## Local Setup

Requirements:

- Java 17+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+ or Neon PostgreSQL

Backend environment variables:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/mini_crm
DATABASE_USERNAME=crm_user
DATABASE_PASSWORD=crm_password
JWT_SECRET=replace-with-a-64-character-random-secret-before-deploy
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
BOOTSTRAP_ADMIN_NAME=Admin User
BOOTSTRAP_ADMIN_EMAIL=admin@crm.local
BOOTSTRAP_ADMIN_PASSWORD=Admin12345
```

Run backend:

```bash
mvn spring-boot:run
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Local frontend:

```text
http://localhost:5173
```

For frontend-only local testing against the deployed backend:

```bash
# frontend/.env.local
VITE_API_BASE_URL=https://salesflow-crm-production.up.railway.app/api
```

## Deployment

Frontend on Netlify:

```text
Build command: cd frontend && npm install && npm run build
Publish directory: frontend/dist
Environment: VITE_API_BASE_URL=<backend-url>/api
```

Backend on Railway:

```text
Java runtime: system.properties
Build/deploy: railway.toml
Database: Neon PostgreSQL
```

Required backend variables:

```bash
DATABASE_URL=jdbc:postgresql://<neon-host>/<database>?sslmode=require
DATABASE_USERNAME=<neon-user>
DATABASE_PASSWORD=<neon-password>
JWT_SECRET=<64+ character random secret>
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=https://cedar-salesflow-crm.netlify.app,http://localhost:5173
BOOTSTRAP_ADMIN_NAME=Admin User
BOOTSTRAP_ADMIN_EMAIL=admin@crm.local
BOOTSTRAP_ADMIN_PASSWORD=<strong-demo-password>
```

## Demo Data

The seed data is designed for a clean interview walkthrough:

- Growth Sales and Enterprise Sales teams.
- Retail, clinic, logistics, SaaS, hotel, education, and Japan expansion accounts.
- Opportunities across `NEW`, `CONTACTED`, `QUALIFIED`, and `CLOSED`.
- Overdue and upcoming follow-up tasks.
- Activity timeline entries with business context.

Seed data is idempotent for known demo records, so redeploys update the demo story without duplicating the same records.

## Production Improvements

If this were a production CRM, I would add:

- Refresh token rotation or HttpOnly secure-cookie authentication.
- Login rate limiting and account lockout.
- Audit fields such as `createdBy`, `updatedBy`, `createdAt`, and `updatedAt`.
- Soft delete/archive for important CRM records.
- Server-side pagination, sorting, filtering, and search.
- Flyway or Liquibase migrations instead of `ddl-auto=update`.
- Integration tests for auth, RBAC, and CRUD permissions.
- GitHub Actions CI for backend and frontend checks.
- Structured logging, monitoring, and database backup/restore procedures.

## Verification

Backend:

```bash
mvn test
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Manual live demo checklist:

- Login as Admin, Manager, and Sales.
- Verify Manager only sees team records.
- Verify Sales only sees own pipeline/tasks and related contacts.
- Create a Sales contact and confirm follow-up task automation.
- Create a high-value deal and confirm approval/notification behavior.
- Move a task to `DONE` and confirm activity timeline logging.
- Test dashboard, contacts, deals, tasks, search, and notifications on mobile.

## Notes

- Demo credentials are intended for evaluation only.
- Do not commit real database credentials or JWT secrets.
- Generated folders such as `target/`, `frontend/node_modules/`, and `frontend/dist/` are ignored.
