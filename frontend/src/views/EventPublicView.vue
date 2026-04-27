<!-- src/views/EventPublicView.vue -->
<template>
  <div class="min-h-screen bg-surface-50 transition-colors duration-500 relative overflow-hidden">
    <!-- Sophisticated Ambient Background -->
    <div class="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden">
      <div class="absolute -top-[250px] -left-[100px] w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px] dark:bg-brand-500/5"></div>
      <div class="absolute -top-[150px] -right-[100px] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] dark:bg-emerald-500/5"></div>
      <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent"></div>
    </div>

    <!-- Navbar / Header -->
    <header class="sticky top-0 z-50 bg-surface-0/60 backdrop-blur-xl border-b border-surface-200/50">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-all duration-300">
            <svg class="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <span class="font-display font-bold text-lg text-ink tracking-tight">Event<span class="text-brand-600 dark:text-brand-400">Book</span></span>
        </RouterLink>
      </div>
    </header>

    <main v-if="event" class="relative z-10">
      <div class="max-w-6xl mx-auto px-6 py-12">
        <!-- Breadcrumb / Meta -->
        <div class="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <AppBadge :variant="event.status.toLowerCase()" dot>
            {{ event.status === 'ACTIVE' ? 'Pendaftaran Terbuka' : 'Telah Berakhir' }}
          </AppBadge>
          <span class="w-1 h-1 rounded-full bg-surface-300"></span>
          <span class="text-xs font-semibold text-ink-faint tracking-wider uppercase">Public Exhibition</span>
        </div>

        <div class="grid lg:grid-cols-12 gap-12 items-start">
          <!-- Left Content -->
          <div class="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <section class="space-y-6">
              <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-[1.1] tracking-tight">
                {{ event.title }}
              </h1>
              <div class="text-lg text-ink-muted leading-relaxed max-w-2xl whitespace-pre-wrap">
                {{ event.description }}
              </div>
            </section>

            <!-- Details Cards -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="group p-6 bg-surface-0/50 backdrop-blur-sm border border-surface-200 rounded-3xl hover:border-brand-500/50 transition-all duration-300">
                <div class="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint mb-1">Jadwal Acara</h4>
                <p class="text-ink font-bold text-lg">{{ formatDate(event.date) }}</p>
                <p class="text-sm text-ink-muted">{{ formatTime(event.date) }}</p>
              </div>

              <div class="group p-6 bg-surface-0/50 backdrop-blur-sm border border-surface-200 rounded-3xl hover:border-emerald-500/50 transition-all duration-300">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint mb-1">Lokasi Venue</h4>
                <p class="text-ink font-bold text-lg truncate">{{ event.location }}</p>
                <a :href="`https://maps.google.com/?q=${encodeURIComponent(event.location)}`" target="_blank" class="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline">Lihat Rute di Maps →</a>
              </div>
            </div>

            <!-- Map Section -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">Visual Location</h3>
              </div>
              <div class="w-full h-[300px] rounded-[2rem] overflow-hidden border border-surface-200 bg-surface-100 shadow-sm group">
                <iframe
                  width="100%"
                  height="100%"
                  frameborder="0"
                  scrolling="no"
                  marginheight="0"
                  marginwidth="0"
                  class="grayscale-[0.5] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
                  :src="`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Right Sidebar: The Ticket Card -->
          <div class="lg:col-span-4 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div class="sticky top-24">
              <div class="bg-surface-0 border border-surface-200 rounded-[2.5rem] p-8 shadow-2xl shadow-ink/5 overflow-hidden relative group">
                <!-- Decorative element -->
                <div class="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-8">
                    <div class="px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Free Access
                    </div>
                  </div>

                  <div class="space-y-6 mb-10">
                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-ink-muted font-medium">Ketersediaan Slot</span>
                        <span class="font-bold text-ink">{{ event.availableSlots }} / {{ event.quota }}</span>
                      </div>
                      <div class="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full bg-ink transition-all duration-1000 ease-out"
                          :style="{ width: `${Math.min(fillPct, 100)}%` }"
                        ></div>
                      </div>
                    </div>
                    
                    <div class="flex -space-x-3 overflow-hidden p-1">
                      <div v-for="i in 4" :key="i" class="inline-block h-8 w-8 rounded-full ring-4 ring-surface-0 bg-surface-100 flex items-center justify-center text-[10px] font-bold text-ink-muted">
                        {{ ['J', 'A', 'M', 'S'][i-1] }}
                      </div>
                      <div class="flex items-center justify-center h-8 px-3 rounded-full bg-surface-50 text-[10px] font-bold text-ink-muted border border-surface-200 ml-4">
                        +{{ event.bookedCount }} Joiners
                      </div>
                    </div>
                  </div>

                  <div v-if="event.status === 'ACTIVE' && event.availableSlots > 0">
                    <RouterLink
                      :to="`/book/${event.id}`"
                      class="block w-full py-5 px-6 bg-ink text-surface-0 text-center rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-ink/20"
                    >
                      Amankan Slot Anda
                    </RouterLink>
                  </div>
                  <div v-else class="text-center p-5 bg-surface-50 border border-dashed border-surface-300 rounded-2xl text-ink-muted font-medium">
                    {{ event.status !== 'ACTIVE' ? 'Registrasi Ditutup' : 'Kuota Terpenuhi' }}
                  </div>

                  <p class="text-[10px] text-center text-ink-faint mt-6 leading-relaxed">
                    Dengan mendaftar, Anda menyetujui syarat & ketentuan acara ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Loading State -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-bold uppercase tracking-widest text-ink-muted animate-pulse">Syncing Event...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { eventsApi } from '@/api/index'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import AppBadge from '@/components/ui/AppBadge.vue'

const route = useRoute()
const event = ref(null)

const fillPct = computed(() => {
  if (!event.value) return 0
  return (event.value.bookedCount / event.value.quota) * 100
})

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
    const { data } = await eventsApi.getPublicOne(route.params.id)
    event.value = data.data
  } catch (err) {
    console.error('Failed to fetch event:', err)
  }
})
</script>

<style scoped>
/* Modern Animations */
.animate-in {
  animation-delay: 0.1s;
  animation-fill-mode: both;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-from-bottom-4 {
  from { transform: translateY(1rem); }
  to { transform: translateY(0); }
}

@keyframes slide-in-from-bottom-8 {
  from { transform: translateY(2rem); }
  to { transform: translateY(0); }
}

@keyframes slide-in-from-right-8 {
  from { transform: translateX(2rem); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-in.fade-in { animation-name: fade-in; }
.animate-in.slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
.animate-in.slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
.animate-in.slide-in-from-right-8 { animation-name: slide-in-from-right-8; }
</style>
