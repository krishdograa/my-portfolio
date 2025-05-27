'use strict';



/**
 * navbar toggle
 */

const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");

navToggleBtn.addEventListener("click", function () {
  header.classList.toggle("nav-active");
  this.classList.toggle("active");
});

/**
 * toggle the navbar when click any navbar link
 */

const navbarLinks = document.querySelectorAll("[data-nav-link]");

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");

    if (targetId === "#about") {
      event.preventDefault(); // prevent default anchor behavior for "about"
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop + 50;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth"
        });
      }
    }

    // Toggle navbar after click (for all links)
    header.classList.toggle("nav-active");
    navToggleBtn.classList.toggle("active");
  });
}

document.querySelector(".button1-about").addEventListener("click", function () {
  const aboutSection = document.querySelector("#about");

  if (aboutSection) {
    const scrollTarget = aboutSection.offsetTop + 760;

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth"
    });
  }
});




/**
 * back to top & header
 */

const backTopBtn = document.querySelector("[data-back-to-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



//<<--------------------------------------------------------------------------->>

const GITHUB_REPORTS_FOLDER = "https://api.github.com/repos/krishdograa/my-portfolio/contents/reports";
const REPORTS_JSON_URL = "https://raw.githubusercontent.com/krishdograa/my-portfolio/main/reports.json";

async function fetchReports() {
    const reportsContainer = document.getElementById("reports");
    reportsContainer.innerHTML = "<p>Loading reports...</p>";

    try {
        const [filesRes, jsonRes] = await Promise.all([
            fetch(GITHUB_REPORTS_FOLDER),
            fetch(REPORTS_JSON_URL)
        ]);

        if (!filesRes.ok || !jsonRes.ok) throw new Error("Data fetch failed");

        const [filesData, jsonData] = await Promise.all([
            filesRes.json(),
            jsonRes.json()
        ]);

        reportsContainer.innerHTML = "";

        // Group by category
        const categories = {};

        filesData.forEach(file => {
            const reportInfo = jsonData.find(item => item.name === file.name);
            if (!reportInfo) return;

            const category = reportInfo.category || "Uncategorized";
            if (!categories[category]) {
                categories[category] = [];
            }

            categories[category].push({ file, reportInfo });
        });

        // Render grouped reports
        for (const [categoryName, reports] of Object.entries(categories)) {
            const sectionHeader = document.createElement("h3");
            sectionHeader.textContent = categoryName;
            sectionHeader.style.color = "#fff";
            sectionHeader.style.marginTop = "30px";
            reportsContainer.appendChild(sectionHeader);

            const groupDiv = document.createElement("div");
            groupDiv.className = "report-group";
            groupDiv.style.display = "flex";
            groupDiv.style.flexWrap = "wrap";
            groupDiv.style.gap = "10px";

            for (const { file, reportInfo } of reports) {
                const reportDiv = document.createElement("div");
                reportDiv.className = "report-item";

                reportDiv.innerHTML = `
                    ${reportInfo.image ? `
                        <img src="${reportInfo.image}" 
                            alt="${file.name}" 
                            class="report-image">` : ''}

                    ${reportInfo.comment ? `<p class="report-comment">${reportInfo.comment}</p>` : ''}

                    ${reportInfo.youtube ? `
                        <p>
                            <a href="${reportInfo.youtube}" 
                            target="_blank" 
                            class="youtube-link"
                            style="color: #e62117; font-weight: bold;">
                                ▶ Watch Video
                            </a>
                        </p>` : ''}

                    ${reportInfo.medium ? `
                        <a href="${reportInfo.medium}" 
                            target="_blank" 
                            style="color: white; font-weight: bold;">
                            ▶ See it on Medium
                        </a>` : ''}

                    <a href="${file.download_url}" 
                        target="_blank" 
                        class="report-link">
                        ▶ Download Report 
                    </a>
                `;

                groupDiv.appendChild(reportDiv);
            }

            reportsContainer.appendChild(groupDiv);
        }

    } catch (error) {
        console.error("Error:", error);
        reportsContainer.innerHTML = `<p class="error">Failed to load reports: ${error.message}</p>`;
    }
}


// Call function on page load
fetchReports();



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