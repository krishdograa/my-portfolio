// Highlight active navbar link on scroll
document.addEventListener('scroll', function() {
    let sections = document.querySelectorAll("section");
    let navLinks = document.querySelectorAll(".nav-link");

    sections.forEach(section => {
        let top = window.scrollY;
        let offset = section.offsetTop - 150;
        let height = section.offsetHeight;
        let id = section.getAttribute("id");

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                document.querySelector("nav ul li a[href*=" + id + "]").classList.add("active");
            });
        }
    });
});

// Save daily log
function saveLog() {
    let input = document.getElementById("daily-input").value;
    if (input) {
        let list = document.getElementById("log-list");
        let li = document.createElement("li");
        li.textContent = input;
        list.appendChild(li);
        document.getElementById("daily-input").value = "";
    }
}


window.onload = function() {
    fetch("http://localhost:5000/reports")
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("report-list");
            list.innerHTML = "";  // Clear previous content
            data.forEach(report => {
                let li = document.createElement("li");
                li.innerHTML = `<strong>${report.title}</strong> - <a href="${report.link}" target="_blank">View Report</a>`;
                list.appendChild(li);
            });
        });
}

// Add New Report
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
            window.location.reload();  // Refresh to show new reports
        });
    } else {
        alert("Please enter both title and link.");
    }
}