// src/services/event.service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllEvents = async ({ status, search, page = 1, limit = 10 }, userId, userRole) => {
  const where = {
    AND: [
      userRole === 'ADMIN' ? {} : { createdBy: userId }, // Admin lihat semua, Organizer lihat miliknya saja
      status ? { status } : {},
      search ? {
        OR: [
          { title: { contains: search } },
          { location: { contains: search } },
        ]
      } : {}
    ]
  };
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events: events.map((e) => ({
      ...e,
      bookedCount: e._count.bookings,
      availableSlots: e.quota - e._count.bookings,
    })),
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

const getEventById = async (id) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: { select: { id: true, name: true, email: true } },
      _count: { select: { bookings: true } },
    },
  });
  if (!event) throw { status: 404, message: 'Event not found' };
  return { ...event, bookedCount: event._count.bookings, availableSlots: event.quota - event._count.bookings };
};

const createEvent = async (data, userId) => {
  return prisma.event.create({
    data: {
      ...data,
      quota: parseInt(data.quota),  // tambah parseInt di sini
      createdBy: userId,
      date: new Date(data.date),
    },
    include: { organizer: { select: { id: true, name: true } } },
  });
};

const updateEvent = async (id, data, userId, userRole) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw { status: 404, message: 'Event not found' };
  
  // Admin bisa edit apa saja, Organizer hanya miliknya sendiri
  if (userRole !== 'ADMIN' && event.createdBy !== userId) {
    throw { status: 403, message: 'Not authorized' };
  }

  return prisma.event.update({
    where: { id },
    data: {
      ...data,
      ...(data.quota && { quota: parseInt(data.quota) }),
      ...(data.date && { date: new Date(data.date) }),
    },
  });
};

const deleteEvent = async (id, userId, userRole) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw { status: 404, message: 'Event not found' };
  
  if (userRole !== 'ADMIN' && event.createdBy !== userId) {
    throw { status: 403, message: 'Not authorized' };
  }
  
  await prisma.booking.deleteMany({ where: { eventId: id } });
  await prisma.event.delete({ where: { id } });
};

const getEventParticipants = async (eventId, userId, userRole) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw { status: 404, message: 'Event not found' };
  
  if (userRole !== 'ADMIN' && event.createdBy !== userId) {
    throw { status: 403, message: 'Not authorized' };
  }

  return prisma.booking.findMany({
    where: { eventId },
    include: { participant: true },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventParticipants };
