# AquaTrack

AquaTrack is a full-stack hydration tracker built around exact, user-owned drink records. It offers a responsive daily dashboard, quick-add and custom entries, editable history, real weekly/monthly statistics, personal goals, timezone-correct day boundaries, and active-session browser reminders.

The default 1,500 mL goal is a configurable demo value, not medical advice.

## Stack

- React 19, Vite, JavaScript/JSX, React Router, Axios
- Tailwind CSS v4 through the official Vite plugin
- Lucide React and Recharts
- Laravel 13, PHP 8.4, Sanctum, Eloquent, Form Requests, API Resources
- PostgreSQL 16+

## Prerequisites

- PHP 8.3+ (8.4 recommended) with `pdo_pgsql`, `mbstring`, `openssl`, `xml`, `curl`, and `zip`
- Composer 2.7+
- Node.js 22+ and npm 11+
- PostgreSQL 16+

## Install

Clone the repository, then install both applications:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

cd ../frontend
npm install
cp .env.example .env
```

Do not commit either `.env` file. They are ignored.

## PostgreSQL setup

Create an empty database and a dedicated local role using credentials you choose. For example, from a PostgreSQL administrator account:

```sql
CREATE ROLE aquatrack_user WITH LOGIN PASSWORD 'choose-a-local-password';
CREATE DATABASE aquatrack OWNER aquatrack_user;
```

Set the matching values in `backend/.env`:

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=aquatrack
DB_USERNAME=aquatrack_user
DB_PASSWORD=choose-a-local-password
```

No password is supplied or guessed by the project.

Run the schema:

```bash
cd backend
php artisan migrate
```

## Local configuration

The checked-in examples are configured for:

- Laravel: `http://localhost:8000`
- Vite: `http://localhost:5173`
- Sanctum stateful domain: `localhost:5173`

Use the same hostname consistently. Switching one side to `127.0.0.1` while leaving the other on `localhost` can prevent cookies from being treated as same-site. If you change ports or hosts, update `APP_URL`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`, and `VITE_API_URL` together.

For local HTTP, keep `SESSION_SECURE_COOKIE=false`. Set it to `true` in HTTPS production.

## Run

Use two terminals:

```bash
cd backend
php artisan serve --host=localhost --port=8000
```

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`, register, and begin recording drinks. The frontend first requests Sanctum's CSRF cookie and sends all API requests with credentials. Authentication tokens are never stored in browser storage.

## Test and build

Backend feature tests use a database connection and cover registration, login/logout, protected routes, water CRUD and validation, cross-user access, totals, timezone boundaries, and settings.

```bash
cd backend
php artisan test
./vendor/bin/pint --test

cd ../frontend
npm test
npm run build
```

The default `phpunit.xml` uses in-memory SQLite for test isolation. Install PHP's SQLite extension to use that default, or provide a separate PostgreSQL testing database and change the PHPUnit test variables. Never point destructive test refreshes at a database containing important data.

## Architecture notes

- The Laravel API is the source of truth. Browser storage is not used for water records.
- `water_intakes` contains one row per drink. Dashboard and statistics totals are derived at query time.
- The authenticated user's timezone determines local calendar windows; those boundaries are converted to UTC for database queries.
- Every intake lookup starts from the authenticated user's relationship, so another user's numeric ID returns 404.
- The React authentication context owns session state. Page components use a small API service layer and refresh from the backend after mutations.
- Reminder preferences persist in PostgreSQL. The browser scheduler runs only while AquaTrack is active and deduplicates intervals per tab session. There is no background push infrastructure.

See [project plan](docs/PROJECT_PLAN.md), [database design](docs/DATABASE.md), and [API contract](docs/API.md).

## Troubleshooting

- **419 / CSRF mismatch:** visit through the configured frontend hostname, confirm cookies are enabled, and verify the Sanctum/CORS host and port values.
- **401 after login:** ensure Axios uses credentials and the frontend origin appears in `SANCTUM_STATEFUL_DOMAINS`.
- **Database connection refused:** start PostgreSQL and verify host, port, database, role, and `pdo_pgsql`.
- **Notifications unavailable:** browser permission, a secure context (or localhost), and an active AquaTrack tab are required. A denied permission must usually be reset in browser site settings.
- **Chart/build module errors:** run `npm install` in `frontend/`; do not run the frontend from the Laravel root package.
