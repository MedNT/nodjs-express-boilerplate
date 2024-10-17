// Main routes index file to organize routes
const express = require('express');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Use different route modules
router.use('/users', userRoutes);

module.exports = router;
