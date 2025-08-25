// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const REPORTS_DIR = path.join(__dirname, "reports");

// Serve the PDFs statically
app.use("/reports", express.static(REPORTS_DIR));

// List all PDFs in /reports
app.get("/api/reports", (req, res) => {
  fs.readdir(REPORTS_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const pdfs = files.filter(f => f.toLowerCase().endsWith(".pdf"));
    res.json(pdfs);
  });
});

// Health check (optional)
app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Reports server running on http://localhost:${PORT}`);
  console.log(`Place PDFs in: ${REPORTS_DIR}`);
});
