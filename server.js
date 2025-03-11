const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to JSON file
const FILE_PATH = './server/reports.json';

// Read Reports
app.get('/reports', (req, res) => {
    fs.readFile(FILE_PATH, (err, data) => {
        if (err) return res.status(500).json({ error: "Error reading file" });
        res.json(JSON.parse(data));
    });
});

// Save Report
app.post('/add-report', (req, res) => {
    const newReport = req.body;

    fs.readFile(FILE_PATH, (err, data) => {
        let reports = [];
        if (!err) {
            reports = JSON.parse(data);
        }

        reports.push(newReport);
        fs.writeFile(FILE_PATH, JSON.stringify(reports, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error writing file" });
            res.json({ message: "Report added successfully!" });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
