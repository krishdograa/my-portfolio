// GitHub API to fetch reports
const GITHUB_REPORTS_FOLDER = "https://api.github.com/repos/krishdograa/my-portfolio/contents/reports";
const REPORTS_JSON_URL = "https://raw.githubusercontent.com/krishdograa/my-portfolio/main/reports.json";

async function fetchReports() {
    const reportsContainer = document.getElementById("reports");
    reportsContainer.innerHTML = "<p>Loading reports...</p>";

    try {
        // Fetch both data sources simultaneously
        const [filesResponse, jsonResponse] = await Promise.all([
            fetch(GITHUB_REPORTS_FOLDER),
            fetch(REPORTS_JSON_URL)
        ]);

        if (!filesResponse.ok || !jsonResponse.ok) throw new Error("Failed to fetch data");

        const [filesData, jsonData] = await Promise.all([
            filesResponse.json(),
            jsonResponse.json()
        ]);

        reportsContainer.innerHTML = "";

        // Combine both data sources
        filesData.forEach(file => {
            // Find matching metadata from JSON
            const reportInfo = jsonData.find(item => item.name === file.name);

            const reportDiv = document.createElement("div");
            reportDiv.className = "report-item";

            reportDiv.innerHTML = `
                <a href="${file.download_url}" target="_blank" class="report-link">
                    ${file.name}
                </a>
                ${reportInfo ? `<p class="report-comment">${reportInfo.comment}</p>` : ''}
                
            `;

            reportsContainer.appendChild(reportDiv);
        });

    } catch (error) {
        console.error("Error:", error);
        reportsContainer.innerHTML = `<p class="error">Error loading reports. ${error.message}</p>`;
    }
}

// Helper function to format file size
function formatFileSize(size) {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

fetchReports(); // Call function on page load


// Smooth scrolling and active section highlighting
document.addEventListener("scroll", function () {
    let sections = document.querySelectorAll("section");
    let navLinks = document.querySelectorAll(".nav-link");

    sections.forEach((section) => {
        let top = window.scrollY;
        let offset = section.offsetTop - 150;
        let height = section.offsetHeight;
        let id = section.getAttribute("id");

        if (top >= offset && top < offset + height) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
                document
                    .querySelector("nav ul li a[href*=" + id + "]")
                    .classList.add("active");
            });
        }
    });
});

// Section Fade-in Effect
function revealSections() {
    let sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        let position = section.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;

        if (position < windowHeight - 50) {
            section.classList.add("show");
        }
    });
}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);

// Save Daily Log to localStorage
function saveLog() {
    let input = document.getElementById("daily-input").value;
    if (input) {
        let list = document.getElementById("log-list");
        let li = document.createElement("li");
        li.textContent = input;
        li.classList.add("log-item");

        list.appendChild(li);
        document.getElementById("daily-input").value = "";

        // Save to Local Storage
        let logs = JSON.parse(localStorage.getItem("dailyLogs")) || [];
        logs.push(input);
        localStorage.setItem("dailyLogs", JSON.stringify(logs));
    }
}

// Load Logs on Page Load
window.onload = function () {
    fetchReports();
    
    let logs = JSON.parse(localStorage.getItem("dailyLogs")) || [];
    let list = document.getElementById("log-list");

    logs.forEach((log) => {
        let li = document.createElement("li");
        li.textContent = log;
        li.classList.add("log-item");
        list.appendChild(li);
    });
};

// Fetch Reports from Backend API (Flask API running on localhost)
window.onload = function () {
    fetchReports();
    
    fetch("http://localhost:5000/reports")
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("report-list");
            list.innerHTML = ""; // Clear previous content
            data.forEach(report => {
                let li = document.createElement("li");
                li.innerHTML = `<strong>${report.title}</strong> - <a href="${report.link}" target="_blank">View Report</a>`;
                list.appendChild(li);
            });
        });
};

// Add a new report to the server
function addReport() {
    const title = document.getElementById("title").value;
    const link = document.getElementById("link").value;

    if (title && link) {
        fetch("http://localhost:5000/add-report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, link })
        })
        .then(response => response.json())
        .then(() => {
            alert("Report added!");
            window.location.reload(); // Refresh to show new reports
        });
    } else {
        alert("Please enter both title and link.");
    }
}


dodocument.addEventListener("scroll", function () {
    let sections = document.querySelectorAll("section");
    let navLinks = document.querySelectorAll(".nav-link");

    sections.forEach((section) => {
        let top = window.scrollY;
        let offset = section.offsetTop - 150;
        let height = section.offsetHeight;
        let id = section.getAttribute("id");

        if (top >= offset && top < offset + height) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("data-section") === id) {
                    link.classList.add("active");
                }
            });
        }
    });
});



window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);



function scrollToAbout(event) {
        event.preventDefault(); // Prevent default jump
        let aboutSection = document.getElementById("about");
        let offset = 75; // Adjust this value between 50-100 pixels

        if (aboutSection) {
            let targetPosition = aboutSection.offsetTop - offset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
    }

function smoothScroll(event, sectionId) {
        event.preventDefault(); // Prevent default anchor behavior
        let targetSection = document.getElementById(sectionId);
        let offset = 75; // Adjust between 50-100 pixels

        if (targetSection) {
            let targetPosition = targetSection.offsetTop - offset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
    }
