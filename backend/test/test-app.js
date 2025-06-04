const express = require('express');
const bodyParser = require('body-parser');
const { router: matchRouter } = require('../routes/match');

// Create a test app
const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // Routes
  app.use('/api/matches', matchRouter);
  
  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });
  
  return app;
};

module.exports = { createTestApp };
