# AquaTrack JSON API

Base URL in local development: `http://localhost:8000`.

Successful object responses use `{ "data": ... }`; mutations also include a human-readable `message`. Validation failures use HTTP 422 and Laravel's `{ "message", "errors" }` shape. Unauthenticated requests return 401, missing or non-owned resources return 404, and throttled auth attempts return 429.

## Sanctum SPA authentication

The React app must use cookies, not bearer tokens or local storage:

1. Send `GET /sanctum/csrf-cookie` with credentials.
2. Send registration/login with credentials. Axios reads the `XSRF-TOKEN` cookie and supplies `X-XSRF-TOKEN`.
3. Use the session cookie on protected API calls.
4. Send `POST /api/logout` to invalidate the session.

Example:

```http
GET /sanctum/csrf-cookie
Origin: http://localhost:5173
```

```http
POST /api/login
Content-Type: application/json

{"email":"dara@example.com","password":"water1234"}
```

```json
{
  "message": "Signed in successfully.",
  "data": {
    "id": 1,
    "name": "Dara",
    "email": "dara@example.com",
    "settings": { "daily_goal_ml": 1500, "timezone": "Asia/Phnom_Penh" }
  }
}
```

Registration and login are limited to 10 attempts per minute per email/IP pair.

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/register` | No | Create user and default settings |
| POST | `/api/login` | No | Start session |
| POST | `/api/logout` | Yes | End session |
| GET | `/api/me` | Yes | Current user and settings |
| GET | `/api/water-intakes` | Yes | Paginated records; optional `date`, `per_page` |
| POST | `/api/water-intakes` | Yes | Create one drink |
| GET | `/api/water-intakes/{id}` | Yes | Get owned drink |
| PATCH | `/api/water-intakes/{id}` | Yes | Update amount and/or time |
| DELETE | `/api/water-intakes/{id}` | Yes | Delete owned drink |
| GET | `/api/dashboard` | Yes | Today's summary, recent drinks, 7-day series |
| GET | `/api/statistics/daily` | Yes | Daily total; optional `date=YYYY-MM-DD` |
| GET | `/api/statistics/weekly` | Yes | Seven-day series; optional `end_date` |
| GET | `/api/statistics/monthly` | Yes | Calendar-month series; optional `month=YYYY-MM` |
| GET | `/api/settings` | Yes | Display name and preferences |
| PATCH | `/api/settings` | Yes | Update profile/preferences |

## Water examples

Create an entry. The ISO-8601 offset is required by the client convention and the backend normalizes the instant to UTC.

```json
POST /api/water-intakes
{
  "amount_ml": 250,
  "consumed_at": "2026-10-27T07:00:00+07:00"
}
```

```json
{
  "message": "Water intake added.",
  "data": {
    "id": 42,
    "amount_ml": 250,
    "consumed_at": "2026-10-27T07:00:00+07:00"
  }
}
```

List one local day (maximum page size 50):

```http
GET /api/water-intakes?date=2026-10-27&per_page=20&page=1
```

The response includes `meta.current_page`, `last_page`, `per_page`, and `total`.

## Settings example

```json
PATCH /api/settings
{
  "name": "Dara Sok",
  "daily_goal_ml": 2200,
  "timezone": "Asia/Phnom_Penh",
  "reminder_enabled": true,
  "reminder_start_time": "07:00",
  "reminder_end_time": "21:00",
  "reminder_interval_minutes": 60
}
```

Goals accept 250–10,000 mL. Reminder intervals accept 15–720 minutes. End time must be after start time. Timezones must be valid IANA identifiers.
