// js/dashboard.js
// Fetches aggregate, anonymous statistics from the backend and renders
// the results dashboard cards and Chart.js visualizations.

let funnelChart = null;
let actionsChart = null;

function renderStatCards(stats) {
    const grid = document.getElementById("stat-grid");
    grid.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.participants}</div>
            <div class="stat-label">Participants</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.emailsViewed}</div>
            <div class="stat-label">Emails Viewed</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.linksClicked}</div>
            <div class="stat-label">Links Clicked</div>
            <div class="stat-rate rate-click">${stats.clickRate}%</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.loginAttempts}</div>
            <div class="stat-label">Login Attempts</div>
            <div class="stat-rate rate-login">${stats.loginAttemptRate}%</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.reported}</div>
            <div class="stat-label">Reported</div>
            <div class="stat-rate rate-report">${stats.reportRate}%</div>
        </div>
    `;
}

function renderCharts(stats) {
    const funnelCtx = document.getElementById("funnel-chart").getContext("2d");
    const actionsCtx = document.getElementById("actions-chart").getContext("2d");

    const gridColor = "rgba(148, 163, 194, 0.14)";
    const tickColor = "#a6b0c3";

    if (funnelChart) funnelChart.destroy();
    if (actionsChart) actionsChart.destroy();

    funnelChart = new Chart(funnelCtx, {
        type: "bar",
        data: {
            labels: ["Emails Viewed", "Clicked", "Login Attempt", "Reported"],
            datasets: [{
                label: "Participants",
                data: [stats.emailsViewed, stats.linksClicked, stats.loginAttempts, stats.reported],
                backgroundColor: ["#3b82f6", "#fbbf24", "#f87171", "#34d399"],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: tickColor }, grid: { color: gridColor } },
                y: { ticks: { color: tickColor }, grid: { color: gridColor }, beginAtZero: true }
            }
        }
    });

    actionsChart = new Chart(actionsCtx, {
        type: "doughnut",
        data: {
            labels: ["Clicked", "Login Attempt", "Reported"],
            datasets: [{
                data: [stats.linksClicked, stats.loginAttempts, stats.reported],
                backgroundColor: ["#fbbf24", "#f87171", "#34d399"]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: "bottom", labels: { color: tickColor } } }
        }
    });
}

function renderDemoData(loginAttempts) {
    const tbody = document.getElementById("demo-data-tbody");
    if (!tbody) return;
    
    tbody.innerHTML = ""; // Clear existing
    
    if (loginAttempts === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 16px; color: #a6b0c3;">No simulated login attempts yet.</td></tr>`;
        return;
    }
    
    const dummyPasswords = ["Demo@123", "password123!", "Welcome2023", "QWERTYuiop", "letmeIN!"];
    
    // Generate dummy rows matching the count of login attempts
    for (let i = 1; i <= loginAttempts; i++) {
        // Pad attempt number to 3 digits (e.g., 001)
        const idString = i.toString().padStart(3, "0");
        const recordId = `DEMO-${idString}`;
        
        // Cycle through mock data
        const username = `demo_user${idString}@example.local`;
        const password = dummyPasswords[i % dummyPasswords.length];
        
        // Generate a documentation/example IP (e.g., 192.0.2.x or 203.0.113.x or 198.51.100.x)
        const ipLastOctet = (10 + (i * 3)) % 255;
        const ipAddress = `192.0.2.${ipLastOctet}`;
        
        // Generate a recent timestamp (mocked: just now minus (attempts - i) minutes)
        const date = new Date();
        date.setMinutes(date.getMinutes() - (loginAttempts - i) * 5);
        const timestamp = date.toLocaleString();
        
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid rgba(148, 163, 194, 0.1)";
        
        tr.innerHTML = `
            <td style="padding: 12px 8px; font-family: monospace;">${recordId}</td>
            <td style="padding: 12px 8px;">${i}</td>
            <td style="padding: 12px 8px; color: #f87171;">${username}</td>
            <td style="padding: 12px 8px; color: #f87171; font-family: monospace;">${password}</td>
            <td style="padding: 12px 8px;">${ipAddress}</td>
            <td style="padding: 12px 8px; font-size: 0.85em;">${timestamp}</td>
            <td style="padding: 12px 8px;"><span style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">SIMULATED</span></td>
        `;
        
        tbody.appendChild(tr);
    }
}

async function loadStats() {
    try {
        const res = await fetch("/api/stats");
        const stats = await res.json();
        renderStatCards(stats);
        renderCharts(stats);
        renderDemoData(stats.loginAttempts);
    } catch (err) {
        console.error("Failed to load stats:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadStats();

    const resetBtn = document.getElementById("reset-btn");
    const resetStatus = document.getElementById("reset-status");

    resetBtn.addEventListener("click", async () => {
        const confirmed = confirm("This will permanently delete all demo simulation data. Continue?");
        if (!confirmed) return;

        try {
            const res = await fetch("/api/reset", { method: "POST" });
            if (res.ok) {
                resetStatus.textContent = "Simulation data reset.";
                loadStats();
            } else {
                const body = await res.json();
                resetStatus.textContent = body.error || "Reset failed.";
            }
        } catch (err) {
            resetStatus.textContent = "Reset failed (network error).";
        }
    });
});
