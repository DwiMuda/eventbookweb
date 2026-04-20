// src/routes/dashboard.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, ctrl.getStats);

module.exports = router;
