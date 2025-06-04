const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const multer = require('multer');
const pdfParse = require('pdf-parse');

const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Apply rate limiting to all routes
app.use(limiter);

// JWT Secret (in production, use a more secure way to store this)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Multer setup for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      // Pass an error if the file is not a PDF. This will be caught by the Express error handler.
      cb(new Error('Only PDF files are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Mock user database (in a real app, use a proper database)
const users = [];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword
    };

    users.push(user);

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    // Set JWT in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    // Set JWT in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example
app.get('/api/profile', (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: decoded.id, email: decoded.email } });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// Route to upload resume and extract text
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  // If fileFilter in multer passed cb(null, false) or no file was uploaded with 'resume' field
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded, or file was not a PDF. Please upload a PDF file named \'resume\'.' });
  }

  try {
    const dataBuffer = req.file.buffer;
    const data = await pdfParse(dataBuffer);
    res.json({
      message: 'Resume uploaded and text extracted successfully.',
      filename: req.file.originalname,
      text: data.text,
      metadata: data.metadata, // Contains metadata like PDF title, author etc.
      numPages: data.numpages,
      info: data.info // Contains PDF creation date, modification date etc.
    });
  } catch (error) {
    // This catches errors from pdf-parse (e.g., malformed PDF)
    console.error('Error parsing PDF:', error.message);
    res.status(500).json({ message: 'Error processing PDF file. The file might be corrupted or not a valid PDF.' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Error handling middleware
// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Only PDF files are allowed!') {
    console.error(`File upload validation error for ${req.path}: ${err.message}`);
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading (e.g., file too large).
    console.error(`Multer error for ${req.path} (${err.code}): ${err.message}`);
    return res.status(400).json({ message: `File upload error: ${err.field ? err.field + ' ' : ''}${err.message}` });
  }
  
  // For other unhandled errors
  console.error(`Unhandled error for ${req.path}:`, err.stack);
  res.status(500).json({ message: 'Server error: Something broke!' });
});

module.exports = app;
