// src/controllers/checkin.controller.js
const checkinService = require('../services/checkin.service');

const checkIn = async (req, res, next) => {
  try {
    const booking = await checkinService.checkIn(req.body.bookingCode, req.user.id);
    res.json({ success: true, data: booking, message: 'Check-in successful' });
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await checkinService.getCheckinStats(req.params.eventId, req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

module.exports = { checkIn, getStats };
