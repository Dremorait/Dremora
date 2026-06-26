const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { comparePassword, sanitize } = require('../utils/security');
const { adminRequired, internRequired } = require('../middleware/auth');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to set cookies securely
const setCookie = (res, name, token) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });
};

// @route   POST /api/auth/intern/login
router.post('/intern/login', async (req, res) => {
  try {
    const intern_id = sanitize(req.body.intern_id);
    const full_name = sanitize(req.body.full_name);

    if (!intern_id || !full_name) {
      return res.status(400).json({ error: 'Internship ID and Full Name are required.' });
    }

    // Query Supabase
    const { data: interns, error } = await supabase
      .from('interns')
      .select('*')
      .eq('intern_id', intern_id)
      .eq('full_name', full_name)
      .limit(1);

    if (error || !interns || interns.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. We could not find a matching record.' });
    }

    const intern = interns[0];

    const token = jwt.sign(
      { role: 'intern', id: intern.id, intern_id: intern.intern_id, full_name: intern.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    setCookie(res, 'intern_token', token);
    res.json({ success: true, message: 'Welcome back!' });
  } catch (err) {
    console.error('Intern Login Error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// @route   POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const admin_id = sanitize(req.body.admin_id);
    const password = req.body.password;

    if (!admin_id || !password) {
      return res.status(400).json({ error: 'Admin ID and Password are required.' });
    }

    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .eq('admin_id', admin_id)
      .limit(1);

    let validPassword = false;
    let admin = null;
    
    if (admins && admins.length > 0) {
      admin = admins[0];
      validPassword = await comparePassword(password, admin.password_hash);
    }

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const token = jwt.sign(
      { role: 'admin', id: admin.id, admin_id: admin.admin_id, full_name: admin.full_name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    setCookie(res, 'admin_token', token);
    res.json({ success: true, message: 'Admin authenticated.' });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('intern_token');
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// @route   GET /api/auth/me
// Returns current session info
router.get('/me', (req, res) => {
  let token = req.cookies?.intern_token;
  let role = 'intern';
  
  if (!token) {
    token = req.cookies?.admin_token;
    role = 'admin';
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
