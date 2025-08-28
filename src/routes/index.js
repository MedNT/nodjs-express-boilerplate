// Main routes index file to organize routes
const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

// Use different route modules
router.get('/health', (_, res) => {
  res.status(200).send('OK');
});

// Use different route modules
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
