// src/routes/event.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/event.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, ctrl.getAll);
router.get('/public/:id', ctrl.getPublicOne);
router.get('/:id', authenticate, ctrl.getOne);
router.post('/', authenticate, ctrl.create);
router.put('/:id', authenticate, ctrl.update);
router.delete('/:id', authenticate, ctrl.remove);
router.get('/:id/participants', authenticate, ctrl.getParticipants);

module.exports = router;
