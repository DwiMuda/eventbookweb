<!-- src/views/EventDetailView.vue -->
<template>
  <div v-if="event" class="animate-in fade-in duration-700 text-left">
    <!-- Top Navigation & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <RouterLink to="/events" class="inline-flex items-center gap-2 text-xs font-semibold text-ink-faint hover:text-brand-600 transition-all group">
        <div class="p-1.5 rounded-lg bg-surface-0 border border-surface-200 group-hover:border-brand-500/30 transition-all">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </div>
        Kembali ke Daftar Event
      </RouterLink>

      <div class="flex items-center gap-2">
        <!-- Check-in Button -->
        <RouterLink :to="`/checkin/${event.id}`" class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10 active:scale-95">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Check-in
        </RouterLink>
        
        <!-- Edit Button -->
        <RouterLink :to="`/events/${event.id}/edit`" class="flex items-center gap-2 px-4 py-2 bg-surface-0 border border-surface-200 text-ink-muted hover:text-brand-600 hover:border-brand-500/30 rounded-xl transition-all shadow-sm text-xs font-bold uppercase tracking-widest">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit
        </RouterLink>
        
        <!-- Delete Button -->
        <button @click="showDeleteModal = true" class="flex items-center gap-2 px-4 py-2 bg-surface-0 border border-surface-200 text-ink-muted hover:text-red-600 hover:border-red-500/30 rounded-xl transition-all shadow-sm text-xs font-bold uppercase tracking-widest">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Hapus
        </button>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div class="grid lg:grid-cols-3 gap-6 mb-8">
      <!-- Info Card -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-surface-0 border border-surface-200 rounded-3xl p-8 shadow-sm">
          <div class="flex items-start gap-6">
            <div class="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center shrink-0">
              <svg class="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
              </svg>
            </div>
            <div class="min-w-0">
              <AppBadge :variant="event.status.toLowerCase()" dot class="mb-2 font-medium">
                {{ statusLabel(event.status) }}
              </AppBadge>
              <h1 class="text-2xl font-display font-bold text-ink leading-tight mb-2 tracking-tight">{{ event.title }}</h1>
              <p class="text-sm text-ink-muted leading-relaxed line-clamp-2 opacity-90">{{ event.description }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-surface-100">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-1.5">Tanggal</p>
              <p class="text-sm font-semibold text-ink">{{ formatDate(event.date) }}</p>
              <p class="text-xs text-ink-muted mt-0.5">{{ formatTime(event.date) }}</p>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-1.5">Lokasi</p>
              <div class="flex items-center gap-1.5">
                <p class="text-sm font-semibold text-ink truncate">{{ event.location }}</p>
                <a :href="`https://maps.google.com/?q=${encodeURIComponent(event.location)}`" target="_blank" class="shrink-0 text-brand-600 opacity-70 hover:opacity-100">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-1.5">Kuota</p>
              <p class="text-sm font-semibold text-ink">{{ event.quota }} Kursi</p>
              <p class="text-xs text-ink-muted mt-0.5">{{ event.availableSlots }} Tersedia</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-1.5">Terisi</p>
              <p class="text-sm font-semibold text-brand-600">{{ event.bookedCount }} Pendaftar</p>
              <p class="text-xs text-emerald-600 mt-0.5 font-medium">{{ Math.round(fillPct) }}% Penuh</p>
            </div>
          </div>
        </div>

        <!-- Visual Map Card -->
        <div class="bg-surface-0 border border-surface-200 rounded-3xl overflow-hidden shadow-sm p-2">
          <div class="w-full h-[250px] rounded-2xl overflow-hidden border border-surface-100 bg-surface-50 group">
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              class="grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
              :src="`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Quick Actions Sidebar -->
      <div class="space-y-4">
        <div class="bg-surface-0 border border-surface-200 rounded-3xl p-6 shadow-sm">
          <h3 class="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-4">Pengisian Registrasi</h3>
          <div class="h-2 bg-surface-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
              :class="fillPct >= 90 ? 'bg-red-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-brand-600'"
              :style="{ width: `${Math.min(fillPct, 100)}%` }"
            ></div>
          </div>
          <p class="text-[11px] text-center font-medium text-ink-muted mt-3">
            {{ event.bookedCount }} pendaftaran terkonfirmasi
          </p>
        </div>

        <div class="bg-surface-0 border border-surface-200 rounded-3xl p-6 shadow-sm group text-left">
          <h3 class="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-4">Halaman Publik</h3>
          <div class="space-y-3">
            <a :href="`/e/${event.id}`" target="_blank" class="flex items-center justify-center w-full py-2 bg-surface-50 dark:bg-surface-100 hover:bg-surface-100 border border-surface-200 rounded-xl text-xs font-semibold text-ink transition-all">
              Buka Halaman
            </a>
            <button @click="copyLink" class="w-full text-center text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
              {{ copied ? '✓ Berhasil Disalin!' : 'Salin Link Undangan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Participants Table Section -->
    <div class="bg-surface-0 border border-surface-200 rounded-3xl overflow-hidden shadow-sm">
      <div class="p-6 border-b border-surface-100 flex items-center justify-between">
        <div>
          <h2 class="font-display font-bold text-lg text-ink">Daftar Peserta</h2>
          <p class="text-[11px] font-medium text-ink-faint mt-0.5 uppercase tracking-wider">Total {{ bookings.length }} Registrations</p>
        </div>
        <button @click="exportCSV" class="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-50 dark:bg-surface-100 border border-surface-200 rounded-xl text-xs font-semibold text-ink hover:bg-surface-100 transition-all active:scale-95">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-surface-50/50 dark:bg-surface-100/50">
              <th class="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-ink-faint">Peserta</th>
              <th class="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-ink-faint hidden sm:table-cell text-center">Kode</th>
              <th class="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-ink-faint text-center">Status</th>
              <th class="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-ink-faint text-right">Kehadiran</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-200">
            <tr v-for="(booking, i) in bookings" :key="booking.id" class="hover:bg-surface-50/50 dark:hover:bg-surface-100/50 transition-colors group">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-200 flex items-center justify-center text-ink-faint font-semibold text-xs group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 group-hover:text-brand-600 transition-colors">
                    {{ i + 1 }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-ink truncate leading-tight">{{ booking.participant.name }}</p>
                    <p class="text-xs text-ink-muted truncate opacity-70 mt-0.5">{{ booking.participant.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 hidden sm:table-cell text-center">
                <span class="inline-block font-mono text-[11px] font-semibold bg-surface-50 dark:bg-surface-100 border border-surface-200 rounded px-2 py-0.5 text-ink-muted">
                  {{ booking.bookingCode }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <AppBadge :variant="booking.status.toLowerCase()" class="!px-2.5 !py-0.5 !text-[10px] font-medium">
                  {{ booking.status === 'CONFIRMED' ? 'Confirmed' : booking.status === 'WAITLISTED' ? 'Waiting' : 'Canceled' }}
                </AppBadge>
              </td>
              <td class="py-4 px-6 text-right">
                <div v-if="booking.checkedIn" class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Hadir
                </div>
                <span v-else class="text-[10px] font-semibold text-ink-faint uppercase tracking-widest opacity-50">Belum</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Delete modal -->
  <AppModal v-model="showDeleteModal" title="Hapus Event" subtitle="Tindakan ini tidak dapat dibatalkan">
    <div class="text-left py-2">
      <p class="text-sm text-ink-muted leading-relaxed">Apakah Anda yakin ingin menghapus event <strong class="text-ink font-bold">{{ event?.title }}</strong>?</p>
    </div>
    <template #footer>
      <button class="px-4 py-2 bg-surface-100 text-ink font-semibold text-xs rounded-xl hover:bg-surface-200 transition-all" @click="showDeleteModal = false">Batal</button>
      <button class="px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20" :disabled="deleteLoading" @click="handleDelete">
        {{ deleteLoading ? 'Menghapus...' : 'Ya, Hapus' }}
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
const formatDate = (d) => format(new Date(d), 'EEEE, d MMM yyyy', { locale: id })
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
  const a = document.createElement('a'); a.href = url; a.download = `peserta-${event.value.title}.csv`; a.click()
  URL.revokeObjectURL(url)
}

const handleDelete = async () => {
  deleteLoading.value = true
  try {
    await eventsApi.delete(route.params.id)
    router.push('/events')
  } catch (err) {
    console.error(err)
  } finally {
    deleteLoading.value = false
    showDeleteModal.value = false
  }
}

onMounted(async () => {
  try {
    const [evRes] = await Promise.all([
      eventsApi.getOne(route.params.id),
    ])
    event.value = evRes.data.data
    bookingsLoading.value = true
    const { data } = await eventsApi.getParticipants(route.params.id)
    bookings.value = data.data
  } finally {
    bookingsLoading.value = false
  }
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.animate-in { animation-fill-mode: both; }
.fade-in { animation-name: fade-in; }

/* Custom Scrollbar */
.overflow-x-auto::-webkit-scrollbar { height: 4px; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .overflow-x-auto::-webkit-scrollbar-thumb { background: #334155; }
</style>
