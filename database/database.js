// database/database.js
// Handles all SQLite access for the phishing awareness simulation.
// Only anonymous session IDs and allowlisted event types are ever persisted.

const path = require("path");
const fs = require("fs");
const Database = require("node:sqlite").DatabaseSync;

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "simulation.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

// Ensure the data directory exists (SQLite needs the folder to already be there).
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");

// Initialize schema on startup (idempotent - safe to run every time).
const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
db.exec(schema);

// The only event types the system will ever accept or report on.
const ALLOWED_EVENT_TYPES = [
    "EMAIL_VIEWED",
    "EMAIL_CLICKED",
    "EMAIL_REPORTED",
    "LOGIN_PAGE_VIEWED",
    "SIMULATED_LOGIN_ATTEMPT",
    "AWARENESS_PAGE_VIEWED"
];

// --- Prepared statements ---------------------------------------------------

const insertSessionStmt = db.prepare(
    `INSERT OR IGNORE INTO sessions (session_id) VALUES (?)`
);

const insertEventStmt = db.prepare(
    `INSERT INTO events (session_id, event_type) VALUES (?, ?)`
);

const countDistinctSessionsStmt = db.prepare(
    `SELECT COUNT(DISTINCT session_id) AS count FROM sessions`
);

const countEventStmt = db.prepare(
    `SELECT COUNT(DISTINCT session_id) AS count FROM events WHERE event_type = ?`
);

const deleteAllEventsStmt = db.prepare(`DELETE FROM events`);
const deleteAllSessionsStmt = db.prepare(`DELETE FROM sessions`);

// --- Public API --------------------------------------------------------

/**
 * Ensures an anonymous session row exists for the given session ID.
 */
function ensureSession(sessionId) {
    insertSessionStmt.run(sessionId);
}

/**
 * Records an allowlisted event for a given anonymous session.
 * Returns true if recorded, false if the event type was rejected.
 */
function recordEvent(sessionId, eventType) {
    if (!ALLOWED_EVENT_TYPES.includes(eventType)) {
        return false;
    }
    ensureSession(sessionId);
    insertEventStmt.run(sessionId, eventType);
    return true;
}

/**
 * Computes aggregate, anonymous statistics across all sessions.
 * Each metric is a count of DISTINCT sessions that produced that event,
 * so a single participant clicking a link multiple times only counts once.
 */
function getStats() {
    const participants = countDistinctSessionsStmt.get().count;
    const emailsViewed = countEventStmt.get("EMAIL_VIEWED").count;
    const linksClicked = countEventStmt.get("EMAIL_CLICKED").count;
    const loginAttempts = countEventStmt.get("SIMULATED_LOGIN_ATTEMPT").count;
    const reported = countEventStmt.get("EMAIL_REPORTED").count;

    const rate = (numerator, denominator) => {
        if (!denominator) return 0;
        return Math.round((numerator / denominator) * 1000) / 10; // one decimal place
    };

    return {
        participants,
        emailsViewed,
        linksClicked,
        loginAttempts,
        reported,
        clickRate: rate(linksClicked, emailsViewed),
        loginAttemptRate: rate(loginAttempts, emailsViewed),
        reportRate: rate(reported, emailsViewed)
    };
}

/**
 * Deletes all demonstration data. Intended for local development/demo use only.
 */
function resetData() {
    deleteAllEventsStmt.run();
    deleteAllSessionsStmt.run();
}

module.exports = {
    db,
    ALLOWED_EVENT_TYPES,
    ensureSession,
    recordEvent,
    getStats,
    resetData
};
