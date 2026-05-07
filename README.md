# SalesFlow CRM

A Salesforce-inspired CRM workspace for managing customers, sales pipeline, follow-up tasks, and automation signals. The project is built as a portfolio-ready full-stack application with Spring Boot, PostgreSQL, JWT authentication, React, and role-based data visibility.

## Why This Project Exists

SalesFlow CRM was designed to show more than basic CRUD. It models practical CRM workflows that a sales team would actually need:

- Account and contact context for customer-facing teams.
- Pipeline ownership with manager visibility.
- Follow-up tasks and activity history.
- Automation rules inspired by Salesforce Flow, Apex Trigger, Approval Process, and Escalation Rule concepts.
- Role-based access control for Admin, Manager, and Sales users.
- Team-based data scoping so managers supervise their own sales team instead of seeing unrelated work.

## Tech Stack

- Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate
- Database: PostgreSQL, Neon-ready
- Authentication: JWT bearer tokens
- Frontend: React, Vite, Tailwind CSS, Axios, Recharts, Lucide icons
- Deploy target: Railway backend, Vercel frontend, Neon PostgreSQL

## Core Features

- Secure login with JWT.
- Dashboard with revenue, conversion, pipeline, task, and activity insights.
- Customer directory with country-aware phone validation.
- Customer profile with active deals, tasks, and activity timeline.
- Deal pipeline board with stage movement and high-value approval signals.
- Task work queue with overdue detection and completion logging.
- Notification center for overdue tasks and approval-worthy deals.
- Global search across customers, deals, tasks, owners, stages, and teams.
- Admin automation settings overview.
- Team-aware role permissions.

## Roles And Visibility

```text
ADMIN
- Full workspace access.
- Can manage users and delete CRM records.
- Can view every team, customer, deal, task, and activity.

MANAGER
- Supervises one sales team.
- Can view CRM records for users/customers in that team.
- Can manage customer/deal/task work within the team.

SALES
- Works with assigned pipeline and follow-up tasks.
- Can view own deals, own tasks, and related customers/activities.
- Cannot manage users or delete CRM records.
```

Demo teams:

- `Growth Sales`: fast-cycle SMB and pilot opportunities.
- `Enterprise Sales`: larger accounts and approval-oriented opportunities.

## Automation Rules

The backend uses Spring domain events to model Salesforce-style automation:

- Customer created: create a follow-up task due in 2 days.
- Deal created over `$10,000`: log a high-value activity note.
- Deal created over `$50,000`: mark manager approval required and log an approval note.
- Deal moved to `CLOSED`: log a closed-deal activity.
- Task moved to `DONE`: log task completion into the activity timeline.
- Overdue task: returned as an API signal so the frontend can surface alerts.

Automation code lives in:

```text
src/main/java/com/example/minicrm/automation
src/main/java/com/example/minicrm/event
```

## Demo Accounts

```text
ADMIN:   admin@crm.local   / Admin12345
MANAGER: manager@crm.local / Manager12345
SALES:   sales@crm.local   / Sales12345
```

For production/public demo deployments, change these passwords with environment variables instead of editing source code.

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
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

You can copy `.env.example` as a reference. Do not commit real secrets.

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

Open the Vite URL, usually:

```text
http://localhost:5173
```

## API Overview

Authentication:

- `POST /api/auth/login`

CRM resources:

- `GET /api/users`
- `GET /api/teams`
- `GET /api/customers`
- `GET /api/customers/{id}`
- `GET /api/deals`
- `GET /api/tasks`
- `GET /api/activities`

Create/update/delete endpoints are protected by role and team rules in the service layer.

## Deploy Guide

Recommended portfolio deployment:

- Database: Neon PostgreSQL
- Backend: Railway
- Frontend: Vercel

### 1. Neon

Create a Neon project and copy the connection details. For Spring Boot, use JDBC format:

```text
jdbc:postgresql://<neon-host>/<database>?sslmode=require
```

Set username and password separately through environment variables.

### 2. Railway Backend

Deploy the root project to Railway. This repo includes:

- `railway.toml`
- `system.properties`

Set Railway variables:

```bash
DATABASE_URL=jdbc:postgresql://<neon-host>/<database>?sslmode=require
DATABASE_USERNAME=<neon-user>
DATABASE_PASSWORD=<neon-password>
JWT_SECRET=<64+ character random secret>
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
BOOTSTRAP_ADMIN_NAME=Admin User
BOOTSTRAP_ADMIN_EMAIL=admin@crm.local
BOOTSTRAP_ADMIN_PASSWORD=<strong-demo-password>
```

After the backend starts, Railway will expose a public URL like:

```text
https://<your-service>.up.railway.app
```

### 3. Vercel Frontend

Deploy the `frontend/` directory to Vercel. This repo includes `frontend/vercel.json`.

Set Vercel variable:

```bash
VITE_API_BASE_URL=https://<your-railway-service>.up.railway.app/api
```

Then redeploy the frontend.

### 4. Final CORS Check

After Vercel gives you a production URL, add it to Railway:

```bash
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
```

If you use both production and preview URLs, separate origins with commas.

## Data Notes

Demo data is inserted only when the customer table is empty, so personal test data is not overwritten. To reload the clean demo dataset, start from an empty database.

The application uses `spring.jpa.hibernate.ddl-auto=update` for portfolio deployment convenience. For a real production system, replace this with Flyway or Liquibase migrations.

## Security Notes

- Real database passwords and JWT secrets must stay in environment variables.
- Demo credentials are safe for local evaluation, but should be changed before sharing a public link.
- The repository intentionally ignores `.env`, `target/`, `node_modules/`, and build output directories.

## Verification

Backend:

```bash
mvn test
```

Frontend:

```bash
cd frontend
npm run build
```
