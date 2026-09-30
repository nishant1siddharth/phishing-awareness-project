# Project Report: Phishing Awareness Simulation Using Social Engineering Techniques

## 1. Introduction

Phishing remains one of the most common and effective attack vectors used
against individuals and organizations. This project builds a controlled,
educational simulation that demonstrates the mechanics of a phishing attack
and social-engineering techniques, while measuring anonymous participant
behavior to illustrate the value of security awareness training.

## 2. Problem Statement

Despite widespread awareness campaigns, phishing attacks continue to succeed
because they exploit predictable human responses — urgency, authority, and
trust — rather than technical vulnerabilities. Organizations need a safe,
repeatable way to demonstrate these techniques and measure how effectively
training reduces risky behavior, without exposing real users to actual risk.

## 3. Objectives

- Demonstrate how a phishing email and a fake login page are constructed
- Observe how participants interact with a simulated phishing lure
- Identify and teach the concrete warning signs of phishing
- Measure aggregate, anonymous behavioral metrics
- Present actionable preventive guidance

## 4. Background

Phishing is a form of social engineering in which an attacker impersonates a
trusted entity to manipulate a target into taking an action — typically
revealing credentials or installing malware. Common variants include email
phishing, spear phishing (targeted), and vishing (voice-based). This project
focuses on email-based phishing with a simulated credential-harvesting page,
the most prevalent form encountered in real-world attacks.

## 5. Phishing Techniques

The simulated email in this project incorporates techniques observed in
real-world phishing campaigns:

- Impersonation of an internal support function ("IT Support")
- A plausible but fabricated pretext ("routine security update")
- A call to action framed as mandatory ("Action Required")
- A single, prominent link driving the target toward the fake login page

## 6. Social Engineering

Beyond the technical delivery mechanism, the simulation demonstrates several
classic social-engineering levers:

- **Urgency** — implying a deadline or consequence for inaction
- **Authority** — impersonating an internal support/IT function
- **Generic framing** — impersonal wording that could apply to any recipient
- **Low-friction action** — a single click leading directly to a credential
  request, minimizing the target's opportunity to pause and verify

## 7. System Requirements

- Node.js 18+ and npm
- A modern web browser
- No external services, cloud infrastructure, or real email delivery are
  required or used

## 8. Technologies Used

- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Backend:** Node.js with Express.js
- **Database:** SQLite via `better-sqlite3`
- **Visualization:** Chart.js

## 9. System Architecture

The application follows a simple three-tier architecture: a static/vanilla-JS
frontend, an Express.js API layer that validates and records events, and a
SQLite database that persists only anonymous session identifiers and
allowlisted event types. Aggregate statistics are computed on demand from the
`events` table and rendered on a Chart.js-powered dashboard.

## 10. Methodology

Development proceeded in the following phases: workspace inspection,
project scaffolding (Node/Express/SQLite), database schema design, page-by-page
frontend construction (homepage → consent → email → login → awareness →
dashboard), API and database wiring, chart integration, a development-only
reset feature, a security review, and manual functional testing.

## 11. Implementation

Each page in the simulation records exactly one type of event via a shared
`recordEvent()` helper that posts to `POST /api/events`. The simulated login
page is the most safety-critical component: its form submission handler
calls `event.preventDefault()`, records only the generic
`SIMULATED_LOGIN_ATTEMPT` event (with no reference to the entered values),
immediately clears the password field, and redirects to the awareness page.
The backend has no route capable of receiving a password, and a
defense-in-depth check on `POST /api/events` also rejects any request body
containing a `password`, `credential`, `token`, `cookie`, or `secret` field.

## 12. Database Design

Two tables are used: `sessions` (one row per anonymous participant) and
`events` (one row per recorded interaction, referencing a session ID). An
index on `events.session_id` supports efficient aggregate queries. All
queries are parameterized through `better-sqlite3` prepared statements.

## 13. Event Tracking

Six event types are tracked, corresponding to each meaningful step in the
simulation: `EMAIL_VIEWED`, `EMAIL_CLICKED`, `EMAIL_REPORTED`,
`LOGIN_PAGE_VIEWED`, `SIMULATED_LOGIN_ATTEMPT`, and `AWARENESS_PAGE_VIEWED`.
The backend allowlist rejects any value outside this set.

## 14. User Flow

```
Homepage -> Consent -> Simulated Email
  -> Report -> Awareness -> Dashboard
  -> Click -> Simulated Login -> Simulated Login Attempt -> Awareness -> Dashboard
```

## 15. Results

Results will be populated after the authorized demonstration is run with
real participants. The dashboard computes click rate, simulated
login-attempt rate, and report rate as percentages of total emails viewed,
each rounded to one decimal place, and updates automatically as new events
are recorded.

## 16. Lessons Learned

Building this simulation reinforced how few and simple the social-engineering
cues in a real phishing email typically are, and how much of a security
system's integrity depends on disciplined input validation and allowlisting
even in a project with no real stakes — habits that translate directly into
production system design.

## 17. Preventive Measures

Participants are taught to verify sender addresses, inspect link
destinations before clicking, avoid authenticating through emailed links,
use bookmarks for sensitive services, enable multi-factor authentication,
report suspicious messages, and independently verify unexpected requests
through known-good channels rather than acting under induced urgency.

## 18. Ethical Considerations

This simulation is designed exclusively for authorized, consenting
participants in an educational context. It does not target real users,
does not impersonate any real company or institution, and does not collect,
transmit, or store any real credential or personally identifying
information. The simulated login page displays an explicit warning
instructing participants never to enter a real password.

## 19. Limitations

- Results reflect only the specific group of participants who take part in
  a given run and should not be generalized to a broader population.
- The project does not implement a scientifically validated awareness-scoring
  methodology; any future awareness score would be a project-specific
  educational metric only.
- Interactive browser-based testing (network tab / console inspection during
  a live click-through) was verified via server-side and database inspection
  rather than a GUI browser, due to the constraints of the development
  environment used to build this project.

## 20. Future Improvements

- CSV export of aggregate results
- Additional fictional phishing scenarios covering other pretexts
- An optional, clearly-labeled awareness quiz
- Automated end-to-end testing with a tool such as Playwright

## 21. Conclusion

This project delivers a safe, self-contained demonstration of phishing and
social-engineering techniques, paired with measurable, anonymous awareness
metrics and concrete preventive guidance — meeting the goals of a
college-level cybersecurity awareness project without introducing any real
security risk.
