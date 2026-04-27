<!-- src/views/TicketView.vue -->
<template>
  <div class="min-h-screen bg-surface-50 transition-colors duration-500 relative overflow-hidden flex items-center justify-center p-6">
    <!-- Ambient Background (Consistent with Public View) -->
    <div class="absolute top-0 inset-x-0 h-full pointer-events-none overflow-hidden">
      <div class="absolute -top-[250px] -left-[100px] w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px] dark:bg-brand-500/5"></div>
      <div class="absolute bottom-0 -right-[100px] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] dark:bg-emerald-500/5"></div>
    </div>

    <div class="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-700">
      <div v-if="booking" class="relative group">
        <!-- Ticket Container -->
        <div class="bg-surface-0 rounded-[2.5rem] shadow-2xl shadow-ink/10 border border-surface-200 overflow-hidden">
          
          <!-- Top Section: Event Header -->
          <div class="bg-ink p-8 text-surface-0 relative overflow-hidden">
            <!-- Decorative Pattern -->
            <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
            
            <div class="relative z-10 flex flex-col items-center text-center">
              <div class="flex items-center gap-2 mb-6 opacity-80">
                <div class="w-6 h-6 bg-surface-0/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                  </svg>
                </div>
                <span class="text-xs font-black uppercase tracking-[0.2em]">Official Ticket</span>
              </div>

              <h1 class="font-display text-2xl sm:text-3xl font-black mb-2 leading-tight tracking-tight text-white">
                {{ booking.event.title }}
              </h1>
              
              <div class="flex items-center gap-3 text-surface-0/60 text-xs font-bold uppercase tracking-widest mt-2">
                <span>{{ formatDate(booking.event.date) }}</span>
                <span class="w-1 h-1 rounded-full bg-surface-0/40"></span>
                <span>{{ formatTime(booking.event.date) }}</span>
              </div>
            </div>
          </div>

          <!-- Perforation Effect -->
          <div class="relative h-10 bg-surface-0">
            <div class="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-surface-50 border border-surface-200 rounded-full z-10 shadow-inner"></div>
            <div class="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-surface-50 border border-surface-200 rounded-full z-10 shadow-inner"></div>
            <div class="absolute top-1/2 inset-x-10 h-px border-t-2 border-dashed border-surface-200 -translate-y-1/2"></div>
          </div>

          <!-- Bottom Section: Participant & QR -->
          <div class="p-8 sm:p-10 pt-4 bg-surface-0">
            <div class="grid sm:grid-cols-2 gap-8 items-center">
              <!-- Info -->
              <div class="space-y-6 text-left">
                <div>
                  <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-ink-faint mb-1.5">Nama Peserta</h4>
                  <p class="text-ink font-bold text-lg leading-tight">{{ booking.participant.name }}</p>
                  <p class="text-xs text-ink-muted mt-0.5 truncate">{{ booking.participant.email }}</p>
                </div>

                <div>
                  <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-ink-faint mb-1.5">Booking Code</h4>
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-xl">
                    <span class="font-mono font-black text-ink tracking-widest">{{ booking.bookingCode }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div v-if="booking.checkedIn" class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Check-in Selesai
                  </div>
                  <div v-else class="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Menunggu Check-in
                  </div>
                </div>
              </div>

              <!-- QR Code -->
              <div class="flex flex-col items-center justify-center p-6 bg-surface-50 rounded-[2rem] border border-surface-200 group-hover:bg-white transition-colors duration-500 shadow-inner">
                <img v-if="booking.qrCode" :src="booking.qrCode" alt="Ticket QR" class="w-32 h-32 mix-blend-multiply dark:mix-blend-normal opacity-90 group-hover:opacity-100 transition-opacity" />
                <div v-else class="w-32 h-32 flex items-center justify-center text-ink-faint text-[10px] font-bold uppercase tracking-widest text-center">
                  QR Code<br/>Generating...
                </div>
                <p class="mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-ink-faint text-center font-sans">Scan to Verify</p>
              </div>
            </div>

            <!-- Footer Meta -->
            <div class="mt-10 pt-8 border-t border-surface-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span class="text-xs font-bold text-ink-muted">{{ booking.event.location }}</span>
              </div>
              
              <button @click="window.print()" class="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Ticket
              </button>
            </div>
          </div>
        </div>

        <!-- Back to Event Link -->
        <div class="mt-8 text-center">
          <RouterLink :to="`/e/${booking.event.id}`" class="text-sm font-bold text-ink-muted hover:text-ink transition-colors inline-flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Detail Event
          </RouterLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-black uppercase tracking-widest text-ink-muted animate-pulse font-sans">Fetching Your Ticket...</p>
      </div>

      <!-- Error State -->
      <div v-else class="bg-surface-0 p-10 rounded-[2.5rem] border border-surface-200 text-center shadow-xl">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="font-display font-bold text-xl text-ink mb-2">Tiket Tidak Ditemukan</h3>
        <p class="text-ink-muted text-sm mb-8">Maaf, kami tidak dapat menemukan tiket dengan kode tersebut. Silakan periksa kembali link Anda.</p>
        <RouterLink to="/" class="btn-primary inline-flex">Kembali ke Beranda</RouterLink>
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

const formatDate = (d) => {
  try {
    return format(new Date(d), 'EEEE, d MMMM yyyy', { locale: id })
  } catch (e) {
    return d
  }
}

const formatTime = (d) => {
  try {
    return format(new Date(d), 'HH:mm') + ' WIB'
  } catch (e) {
    return d
  }
}

onMounted(async () => {
  try {
    const { data } = await bookingsApi.getByCode(route.params.code)
    booking.value = data.data
  } catch (err) {
    console.error('Failed to load ticket:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.animate-in {
  animation-fill-mode: both;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in.fade-in { animation-name: fade-in; }
.animate-in.zoom-in { animation-name: zoom-in; }

@media print {
  .bg-surface-50 { background: white !important; }
  .min-h-screen { padding: 0 !important; }
  .max-w-lg { max-width: 100% !important; }
  button, .absolute, .mt-8 { display: none !important; }
  .shadow-2xl { shadow: none !important; }
  .border { border: 1px solid #eee !important; }
  .bg-ink { background: black !important; -webkit-print-color-adjust: exact; }
  .text-surface-0 { color: white !important; }
}
</style>
