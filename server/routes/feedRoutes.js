const express = require('express');
const router = express.Router();
const { getFeed } = require('../controllers/feedController');

// GET /api/feed (and /feed)
router.get('/', getFeed);

module.exports = router;
