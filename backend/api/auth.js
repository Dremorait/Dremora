const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getSupabaseClient } = require('../utils/supabase');
const { comparePassword, sanitize } = require('../utils/security');

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
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (envError) {
      return res.status(500).json({ success: false, message: envError.message, code: 'SERVER_ERROR' });
    }

    const intern_id = sanitize(req.body.intern_id);
    const full_name = sanitize(req.body.full_name);

    if (!intern_id || !full_name) {
      return res.status(400).json({ success: false, message: 'Internship ID and Full Name are required.', code: 'INVALID_CREDENTIALS' });
    }

    // Query Supabase
    const { data: interns, error } = await supabase
      .from('interns')
      .select('*')
      .eq('intern_id', intern_id)
      .eq('full_name', full_name)
      .limit(1);

    if (error || !interns || interns.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. We could not find a matching record.', code: 'INVALID_CREDENTIALS' });
    }

    const intern = interns[0];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Missing environment variable: JWT_SECRET', code: 'SERVER_ERROR' });
    }

    const token = jwt.sign(
      { role: 'intern', id: intern.id, intern_id: intern.intern_id, full_name: intern.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    setCookie(res, 'intern_token', token);
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: intern.id,
        intern_id: intern.intern_id,
        full_name: intern.full_name,
        role: 'intern'
      },
      session: token,
      redirect: '/intern-dashboard.html'
    });
  } catch (err) {
    console.error('Intern Login Error:', err.stack || err);
    res.status(500).json({ success: false, message: err.message || 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// @route   POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (envError) {
      return res.status(500).json({ success: false, message: envError.message, code: 'SERVER_ERROR' });
    }

    const admin_id = sanitize(req.body.admin_id);
    const password = req.body.password;

    if (!admin_id || !password) {
      return res.status(400).json({ success: false, message: 'Admin ID and Password are required.', code: 'INVALID_CREDENTIALS' });
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
      return res.status(401).json({ success: false, message: 'Invalid Admin ID or Password', code: 'INVALID_CREDENTIALS' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Missing environment variable: JWT_SECRET', code: 'SERVER_ERROR' });
    }

    const token = jwt.sign(
      { role: 'admin', id: admin.id, admin_id: admin.admin_id, full_name: admin.full_name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    setCookie(res, 'admin_token', token);
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: admin.id,
        admin_id: admin.admin_id,
        role: 'admin'
      },
      session: token,
      redirect: '/admin-dashboard.html'
    });
  } catch (err) {
    console.error('Admin Login Error:', err.stack || err);
    res.status(500).json({ success: false, message: err.message || 'Internal server error', code: 'SERVER_ERROR' });
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
    return res.status(401).json({ success: false, message: 'Not authenticated', code: 'UNAUTHORIZED' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', code: 'UNAUTHORIZED' });
  }
});

module.exports = router;
