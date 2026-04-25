<!-- src/views/EventDetailView.vue -->
<template>
  <div v-if="event">
    <!-- Back + actions -->
    <div class="flex items-center justify-between mb-6">
      <RouterLink to="/events" class="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Kembali
      </RouterLink>
      <div class="flex items-center gap-2">
        <RouterLink :to="`/checkin/${event.id}`" class="btn-secondary btn-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Check-in
        </RouterLink>
        <RouterLink :to="`/events/${event.id}/edit`" class="btn-secondary btn-sm">Edit</RouterLink>
        <button @click="showDeleteModal = true" class="btn-danger btn-sm">Hapus</button>
      </div>
    </div>

    <!-- Header card -->
    <div class="card mb-6">
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <svg class="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <AppBadge :variant="event.status.toLowerCase()" dot>
              {{ statusLabel(event.status) }}
            </AppBadge>
          </div>
          <h1 class="font-display text-xl font-bold text-ink">{{ event.title }}</h1>
          <p class="text-sm text-ink-muted mt-1">{{ event.description }}</p>
        </div>
      </div>

      <div class="divider" />

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p class="text-ink-faint text-xs mb-1 uppercase tracking-wider font-medium">Tanggal</p>
          <p class="font-medium text-ink">{{ formatDate(event.date) }}</p>
        </div>
        <div>
          <p class="text-ink-faint text-xs mb-1 uppercase tracking-wider font-medium">Waktu</p>
          <p class="font-medium text-ink">{{ formatTime(event.date) }}</p>
        </div>
        <div>
          <p class="text-ink-faint text-xs mb-1 uppercase tracking-wider font-medium">Lokasi</p>
          <div class="flex items-center gap-2">
            <p class="font-medium text-ink truncate">{{ event.location }}</p>
            <a 
              :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`" 
              target="_blank"
              class="text-brand-600 hover:text-brand-700 p-1 rounded-lg hover:bg-brand-50 transition-colors"
              title="Buka di Google Maps"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <p class="text-ink-faint text-xs mb-1 uppercase tracking-wider font-medium">Kuota</p>
          <p class="font-medium text-ink">{{ event.bookedCount }} / {{ event.quota }}</p>
        </div>
      </div>
    </div>

    <!-- Quota bar + CTA -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="card col-span-2">
        <p class="text-sm font-medium text-ink mb-3">Kapasitas</p>
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="text-ink-muted">Terdaftar</span>
          <span class="font-mono font-semibold text-ink">{{ event.bookedCount }} / {{ event.quota }}</span>
        </div>
        <div class="h-2.5 bg-surface-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="fillPct >= 100 ? 'bg-red-400' : fillPct >= 80 ? 'bg-amber-400' : 'bg-brand-500'"
            :style="{ width: `${Math.min(fillPct, 100)}%` }"
          />
        </div>
        <p class="text-xs text-ink-faint mt-2">{{ event.availableSlots }} slot tersisa</p>
      </div>

      <div class="card flex flex-col items-center justify-center gap-3 text-center">
        <p class="text-xs font-medium text-ink-muted uppercase tracking-wider">Link Publik</p>
        <a :href="`/e/${event.id}`" target="_blank" class="btn-secondary btn-sm">
          Buka halaman event
        </a>
        <button @click="copyLink" class="text-xs text-brand-600 hover:text-brand-700">
          {{ copied ? '✓ Link disalin!' : 'Salin link' }}
        </button>
      </div>
    </div>

    <!-- Participants table -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display font-semibold text-base text-ink">
          Daftar Peserta
          <span class="text-ink-faint font-sans font-normal text-sm ml-2">({{ bookings.length }})</span>
        </h2>
        <button @click="exportCSV" class="btn-secondary btn-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      <div v-if="bookingsLoading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="flex gap-3 items-center">
          <div class="skeleton h-8 w-8 rounded-full" />
          <div class="flex-1 space-y-1.5">
            <div class="skeleton h-3.5 w-1/3" />
            <div class="skeleton h-3 w-1/2" />
          </div>
        </div>
      </div>

      <div v-else-if="bookings.length === 0" class="text-center py-8 text-ink-muted text-sm">
        Belum ada peserta terdaftar
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200">
              <th class="pb-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">#</th>
              <th class="pb-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">Peserta</th>
              <th class="pb-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider hidden sm:table-cell">Kode Booking</th>
              <th class="pb-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">Status</th>
              <th class="pb-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider hidden md:table-cell">Check-in</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <tr v-for="(booking, i) in bookings" :key="booking.id" class="hover:bg-surface-50 transition-colors">
              <td class="py-3 pr-4 text-ink-faint font-mono text-xs">{{ i + 1 }}</td>
              <td class="py-3 pr-4">
                <p class="font-medium text-ink">{{ booking.participant.name }}</p>
                <p class="text-xs text-ink-faint">{{ booking.participant.email }}</p>
              </td>
              <td class="py-3 pr-4 hidden sm:table-cell">
                <span class="font-mono text-xs bg-surface-100 px-2 py-1 rounded-lg text-ink-muted">
                  {{ booking.bookingCode }}
                </span>
              </td>
              <td class="py-3 pr-4">
                <AppBadge :variant="booking.status.toLowerCase()">
                  {{ booking.status === 'CONFIRMED' ? 'Terkonfirmasi' : booking.status === 'WAITLISTED' ? 'Antrian' : 'Dibatalkan' }}
                </AppBadge>
              </td>
              <td class="py-3 hidden md:table-cell">
                <span :class="booking.checkedIn ? 'text-emerald-600 font-medium' : 'text-ink-faint'">
                  {{ booking.checkedIn ? '✓ Hadir' : '—' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Delete modal -->
  <AppModal v-model="showDeleteModal" title="Hapus Event" subtitle="Tindakan ini tidak dapat dibatalkan">
    <p class="text-sm text-ink-muted mb-4">Apakah Anda yakin ingin menghapus event <strong class="text-ink">{{ event?.title }}</strong>?</p>
    <template #footer>
      <button class="btn-secondary btn-sm" @click="showDeleteModal = false">Batal</button>
      <button class="btn-danger btn-sm" :disabled="deleteLoading" @click="handleDelete">
        {{ deleteLoading ? 'Menghapus...' : 'Ya, hapus event' }}
      </button>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eventsApi, bookingsApi } from '@/api/index'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppModal from '@/components/ui/AppModal.vue'

const route = useRoute()
const router = useRouter()
const event = ref(null)
const bookings = ref([])
const bookingsLoading = ref(true)
const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const copied = ref(false)

const fillPct = computed(() => event.value ? (event.value.bookedCount / event.value.quota) * 100 : 0)
const formatDate = (d) => format(new Date(d), 'd MMMM yyyy', { locale: id })
const formatTime = (d) => format(new Date(d), 'HH:mm') + ' WIB'
const statusLabel = (s) => ({ ACTIVE: 'Aktif', CLOSED: 'Ditutup', DRAFT: 'Draft' }[s])

const copyLink = async () => {
  await navigator.clipboard.writeText(`${window.location.origin}/e/${event.value.id}`)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const exportCSV = async () => {
  const { data } = await bookingsApi.exportCSV(route.params.id)
  const url = URL.createObjectURL(data)
  const a = document.createElement('a'); a.href = url; a.download = 'peserta.csv'; a.click()
  URL.revokeObjectURL(url)
}

const handleDelete = async () => {
  deleteLoading.value = true
  try {
    await eventsApi.delete(route.params.id)
    router.push('/dashboard')
  } finally {
    deleteLoading.value = false
    showDeleteModal.value = false
  }
}

onMounted(async () => {
  const [evRes] = await Promise.all([
    eventsApi.getOne(route.params.id),
  ])
  event.value = evRes.data.data
  bookingsLoading.value = true
  try {
    const { data } = await eventsApi.getParticipants(route.params.id)
    bookings.value = data.data
  } finally {
    bookingsLoading.value = false
  }
})
</script>
