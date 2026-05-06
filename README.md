# SalesFlow-CRM

Production-style REST backend for a Salesforce-inspired Mini CRM built with Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, JWT security, and DTO-based controllers.

## Requirements

- Java 17+
- Maven 3.9+
- PostgreSQL 15+

## Configure PostgreSQL

The backend reads database and security settings from environment variables, with local defaults in `src/main/resources/application.properties`.

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/mini_crm
DATABASE_USERNAME=crm_user
DATABASE_PASSWORD=crm_password
JWT_SECRET=change-this-secret-before-deploying
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Run

```bash
mvn spring-boot:run
```

## API Resources

Each resource supports standard CRUD routes:

- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `GET /api/customers`
- `GET /api/deals`
- `GET /api/tasks`
- `GET /api/activities`

Create and update endpoints accept JSON DTOs and return validation errors as `400 Bad Request`, missing resources as `404 Not Found`, duplicate emails as `409 Conflict`, and successful deletes as `204 No Content`.

## Enums

- `UserRole`: `ADMIN`, `SALES`, `MANAGER`
- `CustomerStatus`: `ACTIVE`, `INACTIVE`, `PROSPECT`
- `DealStage`: `NEW`, `CONTACTED`, `QUALIFIED`, `CLOSED`
- `TaskStatus`: `TODO`, `DONE`
- `ActivityType`: `CALL`, `EMAIL`, `NOTE`

## Salesforce-Inspired CRM Automations

The backend includes Salesforce Apex-trigger/Flow-style automations implemented with Spring domain events:

- When a customer is created, the system creates an unassigned follow-up task due in 2 days with title `Follow up with new customer`.
- When a newly created deal has `amount > 10000`, the system logs a `NOTE` activity with description `High value deal created`.
- When a newly created deal has `amount > 50000`, the system marks the deal as requiring manager approval and logs a `NOTE` activity with description `Manager approval required for enterprise deal`.
- When a deal moves to `CLOSED`, the system logs a `NOTE` activity with description `Deal closed`.
- When a task transitions to `DONE`, the system logs a `NOTE` activity with description `Task completed`.
- Task API responses include an `overdue` signal when a `TODO` task is past its due date, allowing the frontend to surface escalation-style work queue alerts.

Automation code lives in `src/main/java/com/example/minicrm/automation`, and event records live in `src/main/java/com/example/minicrm/event`.

These rules are intentionally similar to common Salesforce internship topics:

- Apex Trigger: react to record create/update events.
- Flow: create follow-up tasks and activity timeline notes automatically.
- Approval Process: flag high-value deals for manager review.
- Escalation Rule: highlight overdue work items for sales users.

## Frontend

A React/Tailwind SaaS dashboard frontend is available in `frontend/`.

```bash
cd frontend
npm install
npm run dev
```

The frontend includes login, dashboard, contacts, customer detail, deals pipeline, manager approval badges, overdue task badges, reusable components, and an Axios API service layer. Vite proxies `/api` to `http://localhost:8080` during development.

## Frontend/Backend Connection

The React app uses Axios through `frontend/src/api/crmApi.js` and connects to the Spring Boot `/api` resources for customers, deals, tasks, and activities. During local development, Vite proxies `/api` to `http://localhost:8080`; the backend also allows the Vite origin via CORS for direct calls.

## Authentication

The backend uses stateless JWT authentication.

- Login endpoint: `POST /api/auth/login`
- Request body: `{ "email": "admin@crm.local", "password": "Admin12345" }`
- Response includes a bearer token used by the React app for secured API calls.
- All CRM APIs under `/api/**` are secured except `/api/auth/**`.

A bootstrap admin user is created on startup if it does not already exist. Override the default credentials in `application.properties` before production use.

## Demo Data And Roles

On first startup, the app creates demo users and CRM records if the database is empty.

Default accounts:

```text
ADMIN:   admin@crm.local / Admin12345
MANAGER: manager@crm.local / Manager12345
SALES:   sales@crm.local / Sales12345
```

Role rules:

- `ADMIN`: can access user APIs and delete CRM records.
- `MANAGER`: can delete CRM records, but cannot manage users.
- `SALES`: can use the CRM but cannot delete records or manage users.

Demo scenarios included:

- Vietnam, Japan, and US customer records with country-aware phone data.
- A qualified retail CRM opportunity for dashboard and pipeline review.
- An enterprise deal over `$50,000` that is flagged for manager approval.
- A closed logistics renewal deal with activity timeline notes.
- An overdue task so the notification center and task alert badge have live demo data.
- Clean customer activity history showing calls, emails, notes, and automation context.

The demo records are inserted only when the customer table is empty, so local test data is not overwritten. To reload the clean demo dataset, start from an empty `mini_crm` database.

## Run Backend And Frontend Locally

Run the Spring Boot backend:

```bash
mvn spring-boot:run
```

In a second terminal, run the React frontend:

```bash
cd frontend
npm install
npm run dev
```

Then open the Vite dev URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Production Deploy: Vercel + Railway + Neon

Recommended portfolio deployment:

- Frontend: Vercel static React app.
- Backend: Railway Spring Boot web service.
- Database: Neon PostgreSQL.

Backend environment variables on Railway:

```bash
DATABASE_URL=jdbc:postgresql://<neon-host>/<database>?sslmode=require
DATABASE_USERNAME=<neon-user>
DATABASE_PASSWORD=<neon-password>
JWT_SECRET=<64+ character random secret>
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
BOOTSTRAP_ADMIN_NAME=Admin User
BOOTSTRAP_ADMIN_EMAIL=admin@crm.local
BOOTSTRAP_ADMIN_PASSWORD=Admin12345
```

Frontend environment variable on Vercel:

```bash
VITE_API_BASE_URL=https://<your-railway-backend>.up.railway.app/api
```

After deploy:

1. Create the Neon database and copy its connection details.
2. Deploy the Spring Boot backend on Railway and set the backend environment variables.
3. Deploy the React frontend on Vercel and set `VITE_API_BASE_URL`.
4. Add the Vercel URL to `CORS_ALLOWED_ORIGINS` on Railway.
5. Open the Vercel app and sign in with the demo account.
