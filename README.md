# Phishing Awareness Simulation Using Social Engineering Techniques

An authorized, controlled, **educational** simulation that demonstrates how phishing
and social-engineering attacks work, measures anonymous participant interaction,
and teaches practical defenses — without ever collecting, transmitting, or storing
real credentials.

> **This is not a real phishing system.** No real emails are sent, no real
> organizations are impersonated, and no real accounts are targeted.

---

## Description

This project simulates the full lifecycle of a phishing attempt against a
fictional company ("Northstar Technologies"): a lure email, a fake login
page, and a debrief. Every interaction is measured anonymously so that
aggregate awareness metrics (click rate, report rate, simulated login-attempt
rate) can be shown on a results dashboard.

## Objectives

- Demonstrate how phishing and social-engineering attacks are constructed
- Show how users interact with a simulated phishing message in practice
- Teach the concrete warning signs of a phishing attempt
- Measure whether awareness training changes participant behavior
- Present clear, anonymous, aggregate results
- Provide preventive guidance participants can apply immediately

## Features

- Realistic (fictional) phishing email with common social-engineering cues
- Simulated login page that **never transmits, logs, or stores** password data
- Anonymous, per-browser session identifiers (`crypto.randomUUID()`)
- Backend event allowlist — only harmless, predefined event types are accepted
- Aggregate statistics API with click / login-attempt / report rates
- Results dashboard with Chart.js visualizations (funnel + action breakdown)
- Local development-only data reset feature
- Responsive, professional cybersecurity-themed UI (360px–1440px+)

## Architecture

```
Browser
   |
   v
HTML / CSS / Vanilla JavaScript
   |
   v
Express.js API  (POST /api/events, GET /api/stats, POST /api/reset)
   |
   v
SQLite  (sessions, events)
   |
   v
Statistics Dashboard (Chart.js)
```

**User flow:**

```
Homepage
   -> Simulation Info / Consent
   -> Simulated Phishing Email
        -> Report Email -> Awareness Page
        -> Click Link -> Simulated Login Page -> Simulated Login Attempt
                          -> Awareness Page -> Results Dashboard
```

## Technology Stack

| Layer      | Technology              |
|------------|--------------------------|
| Frontend   | HTML5, CSS3, Vanilla JS  |
| Backend    | Node.js, Express.js      |
| Database   | SQLite (`better-sqlite3`)|
| Charts     | Chart.js (CDN)           |

## Requirements

- Node.js 18+ (uses `crypto.randomUUID()` in the browser and native modules on the backend)
- npm

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

Then open:

```
http://localhost:3000
```

## Project Structure

```
phishing-awareness-project/
├── package.json
├── package-lock.json
├── server.js
├── README.md
├── .gitignore
│
├── database/
│   ├── database.js        # SQLite access layer, allowlisted event logic
│   └── schema.sql          # sessions & events table definitions
│
├── data/
│   └── simulation.db       # created automatically on first run (gitignored)
│
├── public/
│   ├── index.html           # Homepage
│   ├── simulation.html      # Consent / "Before You Begin" page
│   ├── phishing-email.html  # Simulated phishing email
│   ├── login.html           # Simulated login page (no real submission)
│   ├── awareness.html       # Awareness / debrief guide
│   └── dashboard.html       # Results dashboard
│
├── css/
│   └── style.css
│
├── js/
│   ├── common.js            # Session ID + event recording helper
│   └── dashboard.js         # Stats fetch + Chart.js rendering
│
├── report/
│   └── project-report.md
│
└── screenshots/
    └── README.md            # Screenshot checklist for the final report
```

## Database Design

**`sessions`**

| Column      | Type     | Notes                          |
|-------------|----------|---------------------------------|
| id          | INTEGER  | Primary key, autoincrement      |
| session_id  | TEXT     | Unique anonymous UUID           |
| created_at  | DATETIME | Defaults to current timestamp   |

**`events`**

| Column      | Type     | Notes                                          |
|-------------|----------|-------------------------------------------------|
| id          | INTEGER  | Primary key, autoincrement                       |
| session_id  | TEXT     | References an anonymous session                  |
| event_type  | TEXT     | One of the allowlisted event types (see below)   |
| created_at  | DATETIME | Defaults to current timestamp                    |

Indexed on `events.session_id`. All queries use parameterized statements
(`better-sqlite3` prepared statements) — no string concatenation is used to
build SQL.

## API Endpoints

### `POST /api/events`

Records a single anonymous interaction event.

```json
{ "sessionId": "uuid-string", "eventType": "EMAIL_VIEWED" }
```

Allowed `eventType` values:

```
EMAIL_VIEWED
EMAIL_CLICKED
EMAIL_REPORTED
LOGIN_PAGE_VIEWED
SIMULATED_LOGIN_ATTEMPT
AWARENESS_PAGE_VIEWED
```

Any other value is rejected with `400`. Requests containing a `password`,
`credential`, `token`, `cookie`, or `secret` field are rejected outright as a
defense-in-depth safeguard (the frontend never sends these fields in the
first place).

### `GET /api/stats`

Returns aggregate, anonymous statistics:

```json
{
  "participants": 20,
  "emailsViewed": 20,
  "linksClicked": 7,
  "loginAttempts": 3,
  "reported": 13,
  "clickRate": 35.0,
  "loginAttemptRate": 15.0,
  "reportRate": 65.0
}
```

### `POST /api/reset`

Development/demo-only endpoint that clears all events and sessions.
Disabled automatically when `NODE_ENV=production`.

**There is intentionally no login endpoint.** The backend has no code path
capable of receiving or storing a password.

## Testing

The following was manually verified during development:

- [x] Homepage loads
- [x] Simulation info page loads and links to the email page
- [x] Email view event (`EMAIL_VIEWED`) is recorded on page load
- [x] Phishing link click event (`EMAIL_CLICKED`) is recorded, then redirects to login
- [x] Report event (`EMAIL_REPORTED`) is recorded and shows the "good catch" message
- [x] Login page loads and records `LOGIN_PAGE_VIEWED`
- [x] Simulated login event (`SIMULATED_LOGIN_ATTEMPT`) is recorded
- [x] Password is never transmitted — verified via server-side logging and direct SQLite inspection after submitting a test password
- [x] Password is never stored — confirmed no `password` string appears anywhere in the database file
- [x] Awareness page loads and records `AWARENESS_PAGE_VIEWED`
- [x] Dashboard loads and fetches live stats from `/api/stats`
- [x] Statistics (click rate, login-attempt rate, report rate) compute correctly against manually recorded events
- [x] Charts render (funnel bar chart + action doughnut chart)
- [x] Reset endpoint clears data and dashboard reflects zeroed stats
- [x] Invalid event types are rejected with `400`
- [x] Requests containing `password`/`credential`/`token`/`cookie`/`secret` fields are rejected with `400`
- [x] Malformed / SQL-injection-style `sessionId` values are rejected by input validation before reaching the database
- [x] No login endpoint exists on the backend (`POST /api/login` returns `404`)
- [ ] Mobile layout — CSS breakpoints were written for 360/768/1024/1440px and reviewed in code, but were not verified in an actual mobile browser/device in this environment (no GUI browser was available for interactive testing here)
- [ ] Live browser console/network-tab inspection during a real click-through was not performed in this environment (no headless/GUI browser tool was available); instead, password non-transmission was verified by directly inspecting the server logs and the SQLite database after simulating requests, and by static code review of `login.html` confirming `preventDefault()` and the absence of any network call referencing the password field.

## Security Safeguards

- **No credential collection**: the password field's value is read only long
  enough to be cleared; it is never included in any `fetch`/XHR body, query
  string, `localStorage`/`sessionStorage` call, or `console` statement.
- **No login endpoint**: the backend has no route that could receive a
  password even if the frontend were modified.
- **Allowlisted events only**: `POST /api/events` validates `eventType`
  against a strict allowlist and rejects everything else.
- **Forbidden-field guard**: requests containing `password`, `credential`,
  `token`, `cookie`, or `secret` fields are rejected before any processing.
- **Input validation**: `sessionId` must match a restricted pattern
  (`^[a-zA-Z0-9-]{8,64}$`), blocking malformed or injection-style input.
- **Parameterized SQL**: all database access uses `better-sqlite3` prepared
  statements — no string concatenation is used to build queries.
- **Safe DOM updates**: dynamic dashboard content is built from numeric,
  server-computed values only (not raw user input), avoiding XSS.
- **No `eval()`** anywhere in the codebase.
- **Reset endpoint disabled in production** (`NODE_ENV=production`).
- **Fictional branding only**: "Northstar Technologies" is fictional and no
  real company, government, or educational institution is impersonated.

## Ethical Considerations

This project is intended strictly for authorized, consenting participants in
a controlled educational context (e.g., a classroom demonstration or an
organization-approved awareness exercise). It must not be deployed against
real, non-consenting users, must not impersonate real organizations, and
must not be used to collect real credentials or personal data under any
circumstance. All simulated content is clearly labeled as a simulation.

## Future Improvements

- Optional awareness quiz with a project-specific (not scientifically
  validated) awareness score
- CSV export of aggregate results
- Additional fictional phishing scenarios (e.g., a fake shipping notification)
- Light/dark theme switcher
- Printable summary report
- Automated end-to-end browser testing (e.g., Playwright) to verify network
  requests during the simulated login flow
