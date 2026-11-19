const express = require('express');
const router = express.Router();
const { getMatches, getDemoUser, resetDemoState } = require('../controllers/matchController');

// GET /api/matches (and /matches)
router.get('/', getMatches);

// GET /api/me - demo user profile
router.get('/me', getDemoUser);

// POST /api/reset - resets demo user swipes & matches
router.post('/reset', resetDemoState);

module.exports = router;
