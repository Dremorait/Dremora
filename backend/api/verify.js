const express = require('express');
const router = express.Router();
const { getSupabaseClient } = require('../utils/supabase');
const { sanitize } = require('../utils/security');

// @route   POST /api/verify
// @desc    Verifies an intern by Intern ID and Full Name
router.post('/', async (req, res) => {
  try {
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (envError) {
      return res.status(500).json({ success: false, message: envError.message, code: 'SERVER_ERROR' });
    }

    const intern_id = sanitize(req.body.intern_id);
    const full_name = sanitize(req.body.full_name);

    if (!intern_id || !full_name) {
      return res.status(400).json({ success: false, message: 'Internship ID and Full Name are required.' });
    }

    const { data: intern, error } = await supabase
      .from('interns')
      .select('id, intern_id, status')
      .eq('intern_id', intern_id)
      .ilike('full_name', full_name) // Case-insensitive matching
      .single();

    if (error || !intern) {
      return res.status(404).json({ success: false, message: 'Intern record not found. Please verify your details.' });
    }

    res.json({ success: true, intern_id: intern.intern_id });
  } catch (err) {
    console.error('Verification Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// @route   GET /api/verify/data/:intern_id
// @desc    Fetches public dashboard data for a verified intern
router.get('/data/:intern_id', async (req, res) => {
  try {
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (envError) {
      return res.status(500).json({ success: false, message: envError.message, code: 'SERVER_ERROR' });
    }

    const intern_id = sanitize(req.params.intern_id);

    if (!intern_id) {
      return res.status(400).json({ success: false, message: 'Intern ID is required.' });
    }

    const { data: intern, error } = await supabase
      .from('interns')
      .select('intern_id, full_name, email, phone, college, course, domain, batch, mentor, start_date, end_date, progress_percent, attendance_percent, tasks_completed, github_url, linkedin_url, portfolio_url, certificate_status, certificate_number, certificate_url, photo, status')
      .eq('intern_id', intern_id)
      .single();

    if (error || !intern) {
      return res.status(404).json({ success: false, message: 'Intern record not found.' });
    }

    res.json({ success: true, data: intern });
  } catch (err) {
    console.error('Fetch Data Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
