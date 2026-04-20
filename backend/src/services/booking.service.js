// src/services/booking.service.js
const { PrismaClient } = require('@prisma/client');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

const generateBookingCode = () => {
  return 'EVT-' + uuidv4().split('-')[0].toUpperCase();
};

const createBooking = async ({ eventId, name, email, phone }) => {
  // Check event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { bookings: { where: { status: 'CONFIRMED' } } } } },
  });
  if (!event) throw { status: 404, message: 'Event not found' };
  if (event.status === 'CLOSED') throw { status: 400, message: 'Event is closed' };

  const bookedCount = event._count.bookings;
  const isWaitlisted = bookedCount >= event.quota;

  // Find or create participant
  let participant = await prisma.participant.findFirst({ where: { email } });
  if (!participant) {
    participant = await prisma.participant.create({ data: { name, email, phone } });
  }

  // Check duplicate booking
  const duplicate = await prisma.booking.findFirst({
    where: { eventId, participantId: participant.id, status: { not: 'CANCELLED' } },
  });
  if (duplicate) throw { status: 409, message: 'Already registered for this event' };

  const bookingCode = generateBookingCode();
  const status = isWaitlisted ? 'WAITLISTED' : 'CONFIRMED';

  // Generate QR code
  const qrCode = await QRCode.toDataURL(bookingCode);

  const booking = await prisma.booking.create({
    data: { bookingCode, status, qrCode, eventId, participantId: participant.id },
    include: { event: true, participant: true },
  });

  return booking;
};

const getBookingByCode = async (bookingCode) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    include: { event: true, participant: true },
  });
  if (!booking) throw { status: 404, message: 'Booking not found' };
  return booking;
};

const cancelBooking = async (bookingCode, email) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    include: { participant: true },
  });
  if (!booking) throw { status: 404, message: 'Booking not found' };
  if (booking.participant.email !== email) throw { status: 403, message: 'Not authorized' };

  return prisma.booking.update({ where: { bookingCode }, data: { status: 'CANCELLED' } });
};

const exportBookings = async (eventId, userId) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw { status: 404, message: 'Event not found' };
  if (event.createdBy !== userId) throw { status: 403, message: 'Not authorized' };

  const bookings = await prisma.booking.findMany({
    where: { eventId },
    include: { participant: true },
    orderBy: { createdAt: 'asc' },
  });

  const headers = ['No', 'Booking Code', 'Name', 'Email', 'Phone', 'Status', 'Check-in', 'Registered At'];
  const rows = bookings.map((b, i) => [
    i + 1,
    b.bookingCode,
    b.participant.name,
    b.participant.email,
    b.participant.phone,
    b.status,
    b.checkedIn ? 'Yes' : 'No',
    new Date(b.createdAt).toLocaleString('id-ID'),
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  return { csv, filename: `${event.title.replace(/\s+/g, '_')}_participants.csv` };
};

module.exports = { createBooking, getBookingByCode, cancelBooking, exportBookings };
