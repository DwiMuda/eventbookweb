// src/services/dashboard.service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (userId) => {
  const [totalEvents, activeEvents, totalBookings, checkedInBookings, recentEvents] = await Promise.all([
    prisma.event.count({ where: { createdBy: userId } }),
    prisma.event.count({ where: { createdBy: userId, status: 'ACTIVE' } }),
    prisma.booking.count({
      where: { event: { createdBy: userId }, status: 'CONFIRMED' },
    }),
    prisma.booking.count({
      where: { event: { createdBy: userId }, checkedIn: true },
    }),
    prisma.event.findMany({
      where: { createdBy: userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { bookings: true } } },
    }),
  ]);

  const checkinRate = totalBookings > 0 
    ? Math.round((checkedInBookings / totalBookings) * 100) 
    : 0;

  return {
    totalEvents,
    activeEvents,
    totalBookings,
    checkedInBookings,
    checkinRate,
    recentEvents: recentEvents.map((e) => ({
      ...e,
      bookedCount: e._count.bookings,
      availableSlots: e.quota - e._count.bookings,
    })),
  };
};

module.exports = { getDashboardStats };
