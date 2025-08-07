const express = require('express');
const router = express.Router();

// Simple auth routes placeholder
// For initial version, we'll keep it simple without user authentication
// This can be expanded later for multi-user support

router.get('/status', (req, res) => {
  res.json({ authenticated: true, user: 'default' });
});

module.exports = router;