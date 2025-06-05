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
            sectionHeader.style.marginTop = "10px";
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
        ${reportInfo.image ? `<img src="${reportInfo.image}" alt="${file.name}" class="report-image">` : ''}

        ${reportInfo.comment ? `<p class="report-comment">${reportInfo.comment}</p><br>` : ''}

        <button class="view-more-btn">View More</button>

        <div class="popup-card hidden">
            ${reportInfo.youtube ? `<p><a href="${reportInfo.youtube}" target="_blank" class="youtube-link">▶ Watch Video</a></p>` : ''}
            ${reportInfo.medium ? `<p><a href="${reportInfo.medium}" target="_blank" class="medium-link">▶ See it on Medium</a></p>` : ''}
            <p><a href="${file.download_url}" target="_blank" class="download-link">▶ Download Report</a></p>
            <button class="close-popup-btn">&times</button>
        </div>
    `;

    // ADD CLICK EVENTS RIGHT HERE
    reportDiv.querySelector(".view-more-btn").addEventListener("click", (e) => {
        const popup = e.target.nextElementSibling;
        if (popup) {
            popup.classList.remove("hidden");
            setTimeout(() => popup.classList.add("show"), 10);
        }
    });

    reportDiv.querySelector(".close-popup-btn").addEventListener("click", (e) => {
        const popup = e.target.closest(".popup-card");
        if (popup) {
            popup.classList.remove("show");
            setTimeout(() => popup.classList.add("hidden"), 300);
        }
    });

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
        .then(() => 
 {           alert("Report added!");
            window.location.reload(); // Refresh to show new reports
        });
    } else {
        alert("Please enter both title and link.");
    }
}

function showTabExp(evt, tabId) {
  // Hide all tab contents
  const contents = document.querySelectorAll(".tab-content-exp");
  contents.forEach(content => content.classList.remove("active-exp"));

  // Remove active from all buttons
  const buttons = document.querySelectorAll(".tab-btn-exp");
  buttons.forEach(btn => btn.classList.remove("active-exp"));

  // Show the selected tab and mark button active
  document.getElementById(tabId).classList.add("active-exp");
  evt.currentTarget.classList.add("active-exp");
}



function showTabskill(evt, tabId) {
  // Hide all tab contents
  const contents = document.querySelectorAll(".tab-content-skill");
  contents.forEach(content => content.classList.remove("active-skill"));

  // Remove active from all buttons
  const buttons = document.querySelectorAll(".tab-btn-skill");
  buttons.forEach(btn => btn.classList.remove("active-skill"));

  // Show the selected tab and mark button active
  document.getElementById(tabId).classList.add("active-skill");
  evt.currentTarget.classList.add("active-skill");
}

const certDescriptions = {
    cert1: `<h3>Introduction to Cybersecurity - Cisco</h3><br><p style="text-align:justify;">This certification provided a strong foundation in essential cybersecurity concepts, including threats, vulnerabilities, and best practices. It helped me understand the importance of securing digital assets and networks. Through this program, I gained practical insights into real-world cyber risks, enhanced my critical thinking, and developed a deeper interest in pursuing a career in cybersecurity.</p>`,

    cert2: `<h3>Ericsson Edge Academia Program - Erricson</h3><br><p style="text-align:justify;">This certification significantly deepened my knowledge of 5G, edge computing, and network transformation. It offered hands-on learning, real-world insights, and prepared me for future roles in the evolving telecom and technology landscape. This program not only strengthened my technical foundation but also enhanced my problem-solving and industry-readiness, empowering me to contribute meaningfully to advanced digital solutions.</p>`,

    cert3: `<h3>Cloud Computing - NPTEL(IIT Kharagpur)</h3><br><p style="text-align:justify;">The NPTEL Cloud Computing certification provided in-depth knowledge of cloud models, virtualization, deployment techniques, and services like IaaS, PaaS, and SaaS. It strengthened my understanding of distributed computing and scalable architecture. The course enhanced my technical skills and prepared me to work with modern cloud platforms and infrastructure.</p>`,

    cert4: `<h3>Python for Data Science - NPTEL(IIT Madras)</h3><br><p style="text-align:justify;">The NPTEL Python for Data Science certification helped me build strong foundations in Python programming, data handling, and libraries like NumPy, Pandas, and Matplotlib. It equipped me with essential data analysis skills and practical experience, empowering me to explore real-world data problems and pursue opportunities in data-driven fields.

</p>`,

    cert5: `<h3>Python(Basics) - HackerRank</h3><br><p style="text-align:justify;">This certification validated my fundamental programming skills in Python, including data types, loops, functions, and conditionals. It strengthened my logical thinking and problem-solving abilities through hands-on coding challenges. This certification boosted my confidence in writing efficient Python code and laid a solid foundation for advanced learning.</p>`,

  };

  function openModal(certId) {
    document.getElementById('cert-desc-content').innerHTML = certDescriptions[certId];
    document.getElementById('cert-modal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('cert-modal').style.display = 'none';
  }

  // Optional: close modal when clicking outside
  window.onclick = function (event) {
    const modal = document.getElementById('cert-modal');
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
  

  document.getElementById("secureForm").addEventListener("submit", function(event) {
    var captchaResponse = grecaptcha.getResponse();
    if (captchaResponse.length === 0) {
      event.preventDefault(); // Stop form from submitting
      document.getElementById("captcha-popup").style.display = "flex"; // Show custom popup
    }
  });

  function closeCaptchaPopup() {
    document.getElementById("captcha-popup").style.display = "none";
  }


