# AquaTrack Project Plan

## Objective

AquaTrack is a mobile-first hydration tracker that stores each drink as an individual, timestamped record. Authenticated users can review daily history and trends, maintain a personal goal, and configure in-browser reminders. The initial 1,500 mL goal is a demo default, not medical guidance.

## Main features

- Session-cookie authentication with Laravel Sanctum
- Per-user water-intake CRUD with editable UTC timestamps
- Timezone-aware dashboard totals and daily history
- Weekly and monthly statistics derived from intake records
- Personal goal, timezone, and reminder settings
- Active-tab browser notification reminders with duplicate prevention
- Responsive React dashboard, charts, history, settings, and auth screens

## Architecture

- `frontend/`: React + Vite single-page application. Axios communicates with the API using cookies and CSRF protection. React Router protects application routes; context owns the authenticated-user state.
- `backend/`: Laravel JSON API. Controllers remain thin, Form Requests validate input, API Resources serialize models, Eloquent scopes every record to the current user, and PostgreSQL is the production/local database target.
- `docs/`: architecture, schema, API contract, and operating notes.

Dates are submitted as ISO-8601 values and persisted in UTC. Calendar windows are calculated in each user's IANA timezone, converted to UTC for database queries, and returned with explicit offsets for display.

## Development phases

1. Inspect the environment; document the design; create the repository structure.
2. Scaffold Laravel; configure PostgreSQL; add migrations, models, factories, and relationships.
3. Implement Sanctum authentication, intake CRUD, dashboard/statistics, settings, validation, resources, and authorization tests.
4. Scaffold React/Vite; configure Tailwind CSS v4, routing, Axios, and authentication state.
5. Build the responsive dashboard, history, settings, login, and registration experiences.
6. Connect all screens to live API data; implement active-session browser reminders and feedback states.
7. Run backend tests and the frontend production build; fix failures; finish operational documentation.

## Key decisions

- No daily-total table: all totals are calculated from `water_intakes` to avoid synchronization bugs.
- No browser token storage: authentication uses Sanctum's stateful session-cookie flow.
- No fabricated chart data: missing days render as zero and all non-zero values come from the API.
- No background-push claim: reminders run only while the application is active.
- API date filters are bounded to prevent unbounded history downloads.

