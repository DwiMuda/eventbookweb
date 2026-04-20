// src/services/checkin.service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkIn = async (bookingCode, userId) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    include: { event: true, participant: true },
  });

  if (!booking) throw { status: 404, message: 'Booking not found' };
  if (booking.event.createdBy !== userId) throw { status: 403, message: 'Not authorized to check in for this event' };
  if (booking.status === 'CANCELLED') throw { status: 400, message: 'Booking is cancelled' };
  if (booking.status === 'WAITLISTED') throw { status: 400, message: 'Booking is on waitlist' };
  if (booking.checkedIn) throw { status: 400, message: 'Already checked in' };

  return prisma.booking.update({
    where: { bookingCode },
    data: { checkedIn: true, checkedInAt: new Date() },
    include: { event: true, participant: true },
  });
};

const getCheckinStats = async (eventId, userId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { bookings: true } } },
  });
  if (!event) throw { status: 404, message: 'Event not found' };
  if (event.createdBy !== userId) throw { status: 403, message: 'Not authorized' };

  const [confirmed, checkedIn, waitlisted] = await Promise.all([
    prisma.booking.count({ where: { eventId, status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { eventId, checkedIn: true } }),
    prisma.booking.count({ where: { eventId, status: 'WAITLISTED' } }),
  ]);

  return { confirmed, checkedIn, waitlisted, total: event._count.bookings };
};

module.exports = { checkIn, getCheckinStats };
