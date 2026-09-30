// server.js
// Express server for the Phishing Awareness Simulation.
//
// SAFETY NOTE: This backend intentionally has NO login endpoint and NO way
// to receive password data. It only accepts anonymous, allowlisted event
// records (see database/database.js) for aggregate awareness statistics.

const path = require("path");
const express = require("express");
const { recordEvent, getStats, resetData, ALLOWED_EVENT_TYPES } = require("./database/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" })); // small limit - we only ever expect tiny event payloads
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

// Basic anonymous session ID format check: expects a UUID-like string.
const SESSION_ID_PATTERN = /^[a-zA-Z0-9-]{8,64}$/;

// Fields that must NEVER appear in an event payload. If we see them, reject
// the request outright - this is a defense-in-depth safeguard, since the
// frontend is already designed never to send these.
const FORBIDDEN_FIELDS = ["password", "credential", "token", "cookie", "secret"];

/**
 * POST /api/events
 * Body: { sessionId: string, eventType: string }
 * Records a single harmless, anonymous interaction event.
 */
app.post("/api/events", (req, res) => {
    const body = req.body || {};

    const suspiciousField = FORBIDDEN_FIELDS.find((field) =>
        Object.prototype.hasOwnProperty.call(body, field)
    );
    if (suspiciousField) {
        return res.status(400).json({
            error: `Field "${suspiciousField}" is not permitted in this request.`
        });
    }

    const { sessionId, eventType } = body;

    if (typeof sessionId !== "string" || !SESSION_ID_PATTERN.test(sessionId)) {
        return res.status(400).json({ error: "Invalid or missing sessionId." });
    }

    if (typeof eventType !== "string" || !ALLOWED_EVENT_TYPES.includes(eventType)) {
        return res.status(400).json({ error: "Invalid or unrecognized eventType." });
    }

    const recorded = recordEvent(sessionId, eventType);
    if (!recorded) {
        return res.status(400).json({ error: "Event could not be recorded." });
    }

    return res.status(201).json({ status: "recorded" });
});

/**
 * GET /api/stats
 * Returns aggregate, anonymous statistics for the results dashboard.
 */
app.get("/api/stats", (req, res) => {
    const stats = getStats();
    return res.json(stats);
});

/**
 * POST /api/reset
 * Development/demo-only endpoint that clears all simulation data.
 * Disabled automatically outside of local development.
 */
app.post("/api/reset", (req, res) => {
    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Reset is disabled in production." });
    }
    resetData();
    return res.json({ status: "reset_complete" });
});

// Fallback 404 for unknown API routes.
app.use("/api", (req, res) => {
    res.status(404).json({ error: "Not found." });
});

app.listen(PORT, () => {
    console.log(`Phishing Awareness Simulation running at http://localhost:${PORT}`);
});
