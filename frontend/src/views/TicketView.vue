<!-- src/views/TicketView.vue -->
<template>
  <div class="min-h-screen bg-surface-100 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-sm">
      <div v-if="booking" class="space-y-0">
        <!-- Ticket top -->
        <div class="bg-brand-600 rounded-t-3xl px-8 pt-8 pb-6 text-white text-center">
          <div class="flex items-center justify-center gap-2 mb-6">
            <div class="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
              </svg>
            </div>
            <span class="font-display font-bold text-sm">EventBook</span>
          </div>
          <AppBadge variant="confirmed" class="mb-4 !bg-white/20 !text-white">
            {{ booking.status === 'CONFIRMED' ? '✓ Terkonfirmasi' : booking.status }}
          </AppBadge>
          <h2 class="font-display font-bold text-xl leading-snug mb-1">{{ booking.event.title }}</h2>
          <p class="text-brand-200 text-sm">{{ formatDate(booking.event.date) }}</p>
          <p class="text-brand-200 text-sm">{{ booking.event.location }}</p>
        </div>

        <!-- Dashed separator -->
        <div class="relative bg-surface-0 border-x border-surface-200">
          <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-surface-100 rounded-full border border-surface-200" />
          <div class="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-surface-100 rounded-full border border-surface-200" />
          <div class="border-t-2 border-dashed border-surface-200 mx-4" />
        </div>

        <!-- Ticket body -->
        <div class="bg-surface-0 rounded-b-3xl border border-surface-200 border-t-0 px-8 py-6 text-center space-y-5">
          <!-- QR Code -->
          <div class="flex justify-center">
            <div class="p-3 bg-surface-0 rounded-2xl border border-surface-200 shadow-card-md inline-block">
              <img v-if="booking.qrCode" :src="booking.qrCode" alt="QR Code" class="w-36 h-36" />
              <div v-else class="w-36 h-36 bg-surface-100 rounded-xl flex items-center justify-center text-ink-faint text-xs">
                QR tidak tersedia
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs text-ink-faint mb-1">Kode Booking</p>
            <p class="font-mono font-bold text-lg text-ink tracking-wider">{{ booking.bookingCode }}</p>
          </div>

          <div class="divider" />

          <div class="grid grid-cols-2 gap-4 text-left">
            <div>
              <p class="text-xs text-ink-faint mb-0.5">Nama</p>
              <p class="text-sm font-medium text-ink">{{ booking.participant.name }}</p>
            </div>
            <div>
              <p class="text-xs text-ink-faint mb-0.5">Waktu</p>
              <p class="text-sm font-medium text-ink">{{ formatTime(booking.event.date) }}</p>
            </div>
          </div>

          <div v-if="booking.checkedIn" class="bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl py-3">
            ✓ Sudah Check-in
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="text-center py-16">
        <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <div v-else class="card text-center py-8">
        <p class="text-ink-muted">Tiket tidak ditemukan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { bookingsApi } from '@/api/index'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import AppBadge from '@/components/ui/AppBadge.vue'

const route = useRoute()
const booking = ref(null)
const loading = ref(true)

const formatDate = (d) => format(new Date(d), 'd MMMM yyyy', { locale: id })
const formatTime = (d) => format(new Date(d), 'HH:mm') + ' WIB'

onMounted(async () => {
  try {
    const { data } = await bookingsApi.getByCode(route.params.code)
    booking.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
