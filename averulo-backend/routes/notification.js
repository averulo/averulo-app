// src/routes/notifications.js
const express = require('express');
const router = express.Router();
const { markNotificationAsRead } = require('../controllers/notificationController');
const { auth } = require('../lib/auth');

// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth, markNotificationAsRead);

module.exports = router;
