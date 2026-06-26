const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { adminRequired } = require('../middleware/auth');
const { hashPassword, comparePassword, sanitize } = require('../utils/security');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client for Storage
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Setup Multer to keep files in memory (Serverless friendly)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

// @route   POST /api/admin/login
// @desc    Admin authentication
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For this demonstration, we are bypassing DB password check if they use the hardcoded admin token as password,
    // OR checking against an admins table.
    // Dremora schema has an `admins` table.
    const [admins] = await db.execute('SELECT * FROM admins WHERE email = $1 LIMIT 1', [email]);
    
    let validPassword = false;
    if (admins.length > 0) {
      validPassword = await comparePassword(password, admins[0].password_hash);
    } else if (password === process.env.ADMIN_SECRET_TOKEN && email === 'admin@dremora.com') {
      // Fallback/Bootstrap admin if DB is empty
      validPassword = true;
    }

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign(
      { role: 'admin', email: email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Set secure HttpOnly cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

// @route   GET /api/admin/interns
// @desc    List all interns (Dashboard)
router.get('/interns', adminRequired, async (req, res) => {
  try {
    const [interns] = await db.execute('SELECT * FROM interns ORDER BY created_at DESC');
    res.json({ success: true, data: interns });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/interns
// @desc    Add new intern
router.post('/interns', adminRequired, async (req, res) => {
  try {
    const { intern_id, certificate_number, full_name, domain, batch, status, start_date, end_date, email } = req.body;
    
    await db.execute(
      `INSERT INTO interns (intern_id, certificate_number, full_name, domain, batch, status, start_date, end_date, email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [intern_id, certificate_number, full_name, domain, batch, status, start_date || null, end_date || null, email || null]
    );

    res.json({ success: true, message: 'Intern added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add intern. Ensure ID/Cert numbers are unique.' });
  }
});

// @route   PUT /api/admin/interns/:id
// @desc    Update intern
router.put('/interns/:id', adminRequired, async (req, res) => {
  try {
    const { intern_id, certificate_number, full_name, domain, batch, status, start_date, end_date, email } = req.body;
    const { id } = req.params;

    await db.execute(
      `UPDATE interns SET intern_id=$1, certificate_number=$2, full_name=$3, domain=$4, batch=$5, status=$6, start_date=$7, end_date=$8, email=$9 WHERE id=$10`,
      [intern_id, certificate_number, full_name, domain, batch, status, start_date || null, end_date || null, email || null, id]
    );

    res.json({ success: true, message: 'Intern updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update intern' });
  }
});

// @route   DELETE /api/admin/interns/:id
// @desc    Delete intern
router.delete('/interns/:id', adminRequired, async (req, res) => {
  try {
    await db.execute('DELETE FROM interns WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Intern deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete intern' });
  }
});

// @route   POST /api/admin/upload
// @desc    Upload certificate or photo to Supabase Storage
router.post('/upload', adminRequired, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase credentials not configured on the server.' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + path.extname(req.file.originalname);
    
    // Upload to Supabase Storage bucket named "intern-portal-uploads"
    const { data, error } = await supabase.storage
      .from('intern-portal-uploads')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      return res.status(500).json({ error: 'Failed to upload to Supabase Storage.' });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('intern-portal-uploads')
      .getPublicUrl(fileName);

    res.json({ 
      success: true, 
      url: publicUrlData.publicUrl 
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Server error during upload.' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get dashboard stats
router.get('/analytics', adminRequired, async (req, res) => {
  try {
    const [totalRows] = await db.execute('SELECT COUNT(*) as count FROM interns');
    const [activeRows] = await db.execute('SELECT COUNT(*) as count FROM interns WHERE status="Active"');
    const [completedRows] = await db.execute('SELECT COUNT(*) as count FROM interns WHERE status="Completed"');
    
    res.json({
      success: true,
      data: {
        total: totalRows[0].count,
        active: activeRows[0].count,
        completed: completedRows[0].count
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
