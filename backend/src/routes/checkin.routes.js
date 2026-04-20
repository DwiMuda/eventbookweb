// src/routes/checkin.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/checkin.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, ctrl.checkIn);
router.get('/stats/:eventId', authenticate, ctrl.getStats);

module.exports = router;
