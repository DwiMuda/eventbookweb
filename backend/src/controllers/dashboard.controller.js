// src/controllers/dashboard.controller.js
const dashboardService = require('../services/dashboard.service');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

module.exports = { getStats };
