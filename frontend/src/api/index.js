// src/api/auth.js
import client from './client'
export const authApi = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  me: () => client.get('/auth/me'),
}

// src/api/events.js — re-exported below for convenience
import client2 from './client'
export const eventsApi = {
  getAll: (params) => client2.get('/events', { params }),
  getOne: (id) => client2.get(`/events/${id}`),
  create: (data) => client2.post('/events', data),
  update: (id, data) => client2.put(`/events/${id}`, data),
  delete: (id) => client2.delete(`/events/${id}`),
  getParticipants: (id) => client2.get(`/events/${id}/participants`),
}

import client3 from './client'
export const bookingsApi = {
  create: (data) => client3.post('/bookings', data),
  getByCode: (code) => client3.get(`/bookings/${code}`),
  cancel: (code, email) => client3.patch(`/bookings/${code}/cancel`, { email }),
  exportCSV: (eventId) => client3.get(`/bookings/export/${eventId}`, { responseType: 'blob' }),
}

import client4 from './client'
export const checkinApi = {
  checkIn: (bookingCode) => client4.post('/checkin/', { bookingCode }),
  getStats: (eventId) => client4.get(`/checkin/stats/${eventId}`),
}

import client5 from './client'
export const dashboardApi = {
  getStats: () => client5.get('/dashboard/'),
}
