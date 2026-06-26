const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sanitize } = require('../utils/security');

// @route   POST /api/verify
// @desc    Verify intern by intern_id AND full_name
// @access  Public (Rate limited in server.js)
router.post('/', async (req, res) => {
  try {
    const rawInternId = req.body.intern_id;
    const rawFullName = req.body.full_name;

    if (!rawInternId || !rawFullName) {
      return res.status(400).json({ error: 'Intern ID and Full Name are required.' });
    }

    const internId = sanitize(rawInternId);
    const fullName = sanitize(rawFullName);

    // Case-insensitive exact match for both (MySQL handles case insensitivity by default for VARCHAR depending on collation, but we enforce it logic-wise if needed. We'll use standard parameterized queries which are safe).
    const [rows] = await db.execute(
      `SELECT intern_id, certificate_number, full_name, domain, batch, status, start_date, end_date, certificate_url, photo, email, created_at, updated_at 
       FROM interns 
       WHERE LOWER(intern_id) = LOWER($1) AND LOWER(full_name) = LOWER($2)
       LIMIT 1`,
      [internId, fullName]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Internship record not found. Please check your credentials.' });
    }

    const intern = rows[0];
    
    // Success - Record Found
    res.json({
      success: true,
      data: intern
    });

  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @route   GET /api/verify/certificate/:id
// @desc    Public route to get basic cert info (used for QR code scanning)
router.get('/certificate/:id', async (req, res) => {
  try {
    const certId = sanitize(req.params.id);
    const [rows] = await db.execute(
      `SELECT intern_id, certificate_number, full_name, domain, batch, status 
       FROM interns 
       WHERE certificate_number = $1 LIMIT 1`,
      [certId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
