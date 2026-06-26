const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getSupabaseClient } = require('../utils/supabase');
const { adminRequired } = require('../middleware/auth');
const { sanitize } = require('../utils/security');

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

// Helper to get supabase client with error handling
const getSb = (res) => {
  try {
    return getSupabaseClient();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Supabase configuration error' });
    return null;
  }
};

// @route   GET /api/admin/interns
// @desc    List all interns (Dashboard)
router.get('/interns', adminRequired, async (req, res) => {
  const sb = getSb(res); if(!sb) return;
  try {
    const { data: interns, error } = await sb
      .from('interns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: interns });
  } catch (err) {
    console.error("GET /interns error:", err);
    res.status(500).json({ success: false, message: 'Server error fetching interns' });
  }
});

// @route   POST /api/admin/interns
// @desc    Add new intern
router.post('/interns', adminRequired, async (req, res) => {
  const sb = getSb(res); if(!sb) return;
  try {
    const payload = {
      intern_id: sanitize(req.body.intern_id),
      full_name: sanitize(req.body.full_name),
      email: sanitize(req.body.email),
      phone: sanitize(req.body.phone),
      college: sanitize(req.body.college),
      course: sanitize(req.body.course),
      domain: sanitize(req.body.domain),
      batch: sanitize(req.body.batch),
      mentor: sanitize(req.body.mentor),
      start_date: req.body.start_date || null,
      end_date: req.body.end_date || null,
      progress_percent: req.body.progress_percent || 0,
      attendance_percent: req.body.attendance_percent || 0,
      tasks_completed: req.body.tasks_completed || 0,
      github_url: sanitize(req.body.github_url),
      linkedin_url: sanitize(req.body.linkedin_url),
      portfolio_url: sanitize(req.body.portfolio_url),
      certificate_status: sanitize(req.body.certificate_status) || 'Pending',
      certificate_number: sanitize(req.body.certificate_number),
      certificate_url: req.body.certificate_url,
      photo: req.body.photo,
      status: sanitize(req.body.status) || 'Active',
      remarks: sanitize(req.body.remarks),
      notes: sanitize(req.body.notes)
    };
    
    const { data, error } = await sb.from('interns').insert([payload]).select();

    if (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: 'Failed to add intern. Ensure ID and Email are unique.' });
    }

    res.json({ success: true, message: 'Intern added successfully', data: data[0] });
  } catch (err) {
    console.error("POST /interns error:", err);
    res.status(500).json({ success: false, message: 'Failed to add intern' });
  }
});

// @route   PUT /api/admin/interns/:id
// @desc    Update intern
router.put('/interns/:id', adminRequired, async (req, res) => {
  const sb = getSb(res); if(!sb) return;
  try {
    const { id } = req.params;
    const payload = {
      intern_id: sanitize(req.body.intern_id),
      full_name: sanitize(req.body.full_name),
      email: sanitize(req.body.email),
      phone: sanitize(req.body.phone),
      college: sanitize(req.body.college),
      course: sanitize(req.body.course),
      domain: sanitize(req.body.domain),
      batch: sanitize(req.body.batch),
      mentor: sanitize(req.body.mentor),
      start_date: req.body.start_date || null,
      end_date: req.body.end_date || null,
      progress_percent: req.body.progress_percent,
      attendance_percent: req.body.attendance_percent,
      tasks_completed: req.body.tasks_completed,
      github_url: sanitize(req.body.github_url),
      linkedin_url: sanitize(req.body.linkedin_url),
      portfolio_url: sanitize(req.body.portfolio_url),
      certificate_status: sanitize(req.body.certificate_status),
      certificate_number: sanitize(req.body.certificate_number),
      certificate_url: req.body.certificate_url,
      photo: req.body.photo,
      status: sanitize(req.body.status),
      remarks: sanitize(req.body.remarks),
      notes: sanitize(req.body.notes),
      updated_at: new Date().toISOString()
    };

    // Remove undefined fields
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const { data, error } = await sb.from('interns').update(payload).eq('id', id).select();

    if (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: 'Update failed.' });
    }

    res.json({ success: true, message: 'Intern updated successfully', data: data[0] });
  } catch (err) {
    console.error("PUT /interns error:", err);
    res.status(500).json({ success: false, message: 'Failed to update intern' });
  }
});

// @route   DELETE /api/admin/interns/:id
// @desc    Delete intern
router.delete('/interns/:id', adminRequired, async (req, res) => {
  const sb = getSb(res); if(!sb) return;
  try {
    const { error } = await sb.from('interns').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Intern deleted' });
  } catch (err) {
    console.error("DELETE /interns error:", err);
    res.status(500).json({ success: false, message: 'Failed to delete intern' });
  }
});

// @route   POST /api/admin/upload
// @desc    Upload certificate or photo to Supabase Storage
router.post('/upload', adminRequired, upload.single('file'), async (req, res) => {
  const sb = getSb(res); if(!sb) return;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + path.extname(req.file.originalname);
    
    const { data, error } = await sb.storage
      .from('intern-portal-uploads')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to upload to storage.' });
    }

    const { data: publicUrlData } = sb.storage
      .from('intern-portal-uploads')
      .getPublicUrl(fileName);

    res.json({ success: true, url: publicUrlData.publicUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: 'Server error during upload.' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get dashboard stats
router.get('/analytics', adminRequired, async (req, res) => {
  const sb = getSb(res); if(!sb) return;
  try {
    // Perform multiple counts efficiently
    const [totalReq, activeReq, completedReq, certsReq] = await Promise.all([
      sb.from('interns').select('id', { count: 'exact', head: true }),
      sb.from('interns').select('id', { count: 'exact', head: true }).eq('status', 'Active'),
      sb.from('interns').select('id', { count: 'exact', head: true }).eq('status', 'Completed'),
      sb.from('interns').select('id', { count: 'exact', head: true }).not('certificate_url', 'is', null)
    ]);

    res.json({
      success: true,
      data: {
        total: totalReq.count || 0,
        active: activeReq.count || 0,
        completed: completedReq.count || 0,
        certificates: certsReq.count || 0
      }
    });
  } catch (err) {
    console.error("GET /analytics error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
