
const API_URL = "http://localhost:8080/api/jobs";

let allJobs = [];

document.addEventListener("DOMContentLoaded", () => {
    loadJobs();

    const searchForm = document.getElementById("searchForm");
    const refreshButton = document.getElementById("refreshJobs");

    if (searchForm) {
        searchForm.addEventListener("submit", event => {
            event.preventDefault();

            const query = document
                .getElementById("searchInput")
                .value.trim()
                .toLowerCase();

            const filteredJobs = allJobs.filter(job =>
                [
                    job.title,
                    job.company,
                    job.location,
                    job.jobType,
                    job.description,
                    job.requiredSkills
                ].some(value =>
                    String(value ?? "").toLowerCase().includes(query)
                )
            );

            displayJobs(filteredJobs);
        });
    }

    if (refreshButton) {
        refreshButton.addEventListener("click", loadJobs);
    }
});

async function loadJobs() {
    const container = document.getElementById("jobList");
    const status = document.getElementById("status");

    if (!container) {
        console.error("Could not find the jobList element in index.html.");
        return;
    }

    container.innerHTML = "<p>Loading jobs...</p>";
    if (status) status.textContent = "Loading opportunities...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        allJobs = await response.json();

        if (!Array.isArray(allJobs)) {
            throw new Error("The jobs API did not return a list.");
        }

        displayJobs(allJobs);

        if (status) {
            status.textContent = `${allJobs.length} opportunities found`;
        }
    } catch (error) {
        console.error("Could not load jobs:", error);
        container.innerHTML =
            "<p>Unable to load jobs. Please check the backend.</p>";

        if (status) {
            status.textContent = "Unable to load opportunities.";
        }
    }
}

function displayJobs(jobs) {
    const container = document.getElementById("jobList");
    if (!container) return;

    if (jobs.length === 0) {
        container.innerHTML = "<p>No matching jobs found.</p>";
        return;
    }

    container.innerHTML = jobs.map(job => `
        <article class="job-card">
            <h3>${escapeHTML(job.title)}</h3>
            <p><strong>Company:</strong> ${escapeHTML(job.company)}</p>
            <p><strong>Location:</strong> ${escapeHTML(job.location)}</p>
            <p><strong>Type:</strong> ${escapeHTML(job.jobType)}</p>
            <p>${escapeHTML(job.description || "")}</p>
            <p><strong>Skills:</strong> ${escapeHTML(job.requiredSkills || "")}</p>
            <a href="${safeURL(job.applicationUrl)}"
               target="_blank"
               rel="noopener noreferrer">Apply Now</a>
        </article>
    `).join("");
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function safeURL(value) {
    try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol)
            ? url.href
            : "#";
    } catch {
        return "#";
    }
}
