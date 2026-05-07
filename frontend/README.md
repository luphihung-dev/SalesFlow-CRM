# SalesFlow CRM Frontend

React SaaS dashboard UI for the SalesFlow CRM backend.

## Stack

- React functional components
- React Router
- Axios API service layer
- TailwindCSS design system
- Vite

## Run

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8080` by default. To point at another API URL, create `.env` from `.env.example` and set:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Structure

- `src/api/crmApi.js`: Axios client and resource methods
- `src/components`: reusable dashboard UI components
- `src/layouts`: app shell layout
- `src/pages`: route-level pages
- `src/utils`: constants and formatters

## Connected Features

- Customers: fetch list, create customer, search/filter, open customer detail.
- Deals: fetch pipeline, create deal, update deal stage, show manager approval badges for enterprise deals.
- Tasks: fetch task list, create task, mark task as done, show overdue work queue badges.
- Activities: fetch customer activity timeline, create activity from customer detail.
- Teams: surface team ownership in search results, contacts, tasks, deals, and customer profile context.
- Errors: API and validation errors are displayed through reusable error banners.

## Salesforce-Inspired Automation UI

The UI surfaces backend automation results so the app can be presented as a CRM portfolio project:

- Customer creation creates a follow-up task automatically.
- High-value deals create activity notes.
- Enterprise deals are flagged for manager approval.
- Closing a deal creates an activity note.
- Completing a task creates an activity note.
- Overdue tasks are highlighted in the work queue.

## Authentication

The login page calls `POST /api/auth/login`, stores the returned JWT in `localStorage`, and Axios attaches it as `Authorization: Bearer <token>` for all CRM API requests. Routes are protected client-side and redirect to `/login` when no token exists.

Default development login:

```text
admin@crm.local
Admin12345
```

## Edit And Delete

The UI supports create, edit, and delete flows for customers, deals, and tasks. Delete actions require a backend role with permission, currently `ADMIN` or `MANAGER`.
