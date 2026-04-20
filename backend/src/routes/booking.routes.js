// src/routes/booking.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', ctrl.create);
router.get('/:code', ctrl.getByCode);
router.patch('/:code/cancel', ctrl.cancel);
router.get('/export/:eventId', authenticate, ctrl.exportCSV);

module.exports = router;
