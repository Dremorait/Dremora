const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { adminRequired } = require('../middleware/auth');
const { hashPassword, comparePassword, sanitize } = require('../utils/security');

// Setup Multer for file uploads (Photos & Certificates)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
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
    const [admins] = await db.execute('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      `UPDATE interns SET intern_id=?, certificate_number=?, full_name=?, domain=?, batch=?, status=?, start_date=?, end_date=?, email=? WHERE id=?`,
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
    await db.execute('DELETE FROM interns WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Intern deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete intern' });
  }
});

// @route   POST /api/admin/upload
// @desc    Upload certificate or photo
router.post('/upload', adminRequired, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the path so frontend can save it to DB
  res.json({ 
    success: true, 
    url: \`/uploads/\${req.file.filename}\` 
  });
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
