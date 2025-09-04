const path = require('path');
const fs = require('fs/promises');
const express = require('express');

const app = express();
const REPORTS_DIR = path.join(__dirname, 'reports');

// API first
app.get('/api/reports', async (_req, res) => {
  try {
    const files = await fs.readdir(REPORTS_DIR);
    res.json(files.filter(f => f.toLowerCase().endsWith('.pdf')).sort());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to list reports' });
  }
});

// PDFs
app.use('/reports', express.static(REPORTS_DIR, { fallthrough: false }));

// Static UI
const BUILD_DIR = path.join(__dirname, 'build');
app.use(express.static(BUILD_DIR));

// Express 5-safe SPA fallback (no wildcard pattern)
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/reports')) return next();
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`http://localhost:${PORT}`));
