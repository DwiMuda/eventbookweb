// src/controllers/booking.controller.js
const bookingService = require('../services/booking.service');

const create = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

const getByCode = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingByCode(req.params.code);
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

const cancel = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.code, req.body.email);
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

const exportCSV = async (req, res, next) => {
  try {
    const { csv, filename } = await bookingService.exportBookings(req.params.eventId, req.user.id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) { next(err); }
};

module.exports = { create, getByCode, cancel, exportCSV };
