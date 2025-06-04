const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { supabase } = require('../lib/supabaseClient');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// Upload and process resume
router.post('/upload', requireAuth, upload.single('resume'), async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 2. Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    
    // 3. Upload to Supabase Storage
    const filePath = `resumes/${req.user.id}/${Date.now()}_${req.file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, req.file.buffer);

    if (uploadError) throw uploadError;

    // 4. Save to database
    const { data: resumeData, error: dbError } = await supabase
      .from('resumes')
      .insert({
        user_id: req.user.id,
        file_name: req.file.originalname,
        file_path: filePath,
        text_content: pdfData.text,
        metadata: {
          pages: pdfData.numpages,
          info: pdfData.info
        }
      })
      .select()
      .single();

    if (dbError) throw dbError;

    res.json({
      message: 'Resume processed successfully',
      resume: resumeData
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

// Get user's resumes
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

module.exports = router;