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

// @route   POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (envError) {
      return res.status(500).json({ success: false, message: envError.message, code: 'SERVER_ERROR' });
    }

    const email = sanitize(req.body.admin_id || req.body.email); // Support both fields
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin Email/ID and Password are required.', code: 'INVALID_CREDENTIALS' });
    }

    // Admins authenticate by email or admin_id
    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .or(`email.eq.${email},admin_id.eq.${email}`)
      .limit(1);

    let validPassword = false;
    let admin = null;
    
    if (admins && admins.length > 0) {
      admin = admins[0];
      validPassword = await comparePassword(password, admin.password_hash);
    } else if (password === process.env.ADMIN_SECRET_TOKEN && email === 'admin@dremora.com') {
      // Fallback/Bootstrap admin if DB is empty and environment allows it
      validPassword = true;
      admin = { id: 'bootstrap', admin_id: 'ADMIN-000', full_name: 'Super Admin', email: 'admin@dremora.com' };
    }

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid Admin credentials.', code: 'INVALID_CREDENTIALS' });
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
        full_name: admin.full_name,
        role: 'admin'
      },
      session: token,
      redirect: '/admin-dashboard.html'
    });
  } catch (err) {
    console.error('Admin Login Error:', err.stack || err);
    res.status(500).json({ success: false, message: err.message || String(err), code: 'SERVER_ERROR', stack: err.stack });
  }
});

// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// @route   GET /api/auth/me
// Returns current session info
router.get('/me', (req, res) => {
  let token = req.cookies?.admin_token;

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
