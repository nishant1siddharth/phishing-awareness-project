// js/common.js
// Shared helpers used across every page: anonymous session management,
// event recording, and small UI utilities. No credentials are ever handled
// here or anywhere else in the client-side code.

const SESSION_STORAGE_KEY = "phishingSimSessionId";

/**
 * Returns the current anonymous session ID, creating one if needed.
 * This is a random UUID with no link to real identity - never a username,
 * email address, or credential of any kind.
 */
function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
}

/**
 * Records a single allowlisted, anonymous event to the backend.
 * Fails silently (logging only to console) so a network hiccup never
 * blocks the participant's simulation flow.
 */
async function recordEvent(eventType) {
    try {
        await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId: getSessionId(),
                eventType
            })
        });
    } catch (err) {
        console.warn("Could not record event (non-blocking):", eventType, err);
    }
}

/**
 * Wires up the mobile nav toggle button, if present on the page.
 */
function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
        links.classList.toggle("open");
    });
}

document.addEventListener("DOMContentLoaded", initNavToggle);
