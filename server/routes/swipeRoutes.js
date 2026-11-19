const express = require('express');
const router = express.Router();
const { recordSwipe } = require('../controllers/swipeController');

// POST /api/swipe (and /swipe)
router.post('/', recordSwipe);

module.exports = router;
