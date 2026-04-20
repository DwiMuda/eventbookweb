// src/controllers/event.controller.js
const eventService = require('../services/event.service');

const getAll = async (req, res, next) => {
  try {
    const result = await eventService.getAllEvents(req.query);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json({ success: true, data: event });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json({ success: true, data: event });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: event });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id, req.user.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) { next(err); }
};

const getParticipants = async (req, res, next) => {
  try {
    const bookings = await eventService.getEventParticipants(req.params.id, req.user.id);
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove, getParticipants };
