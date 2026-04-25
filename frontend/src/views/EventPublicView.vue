<!-- src/views/EventPublicView.vue -->
<template>
  <div class="min-h-screen bg-surface-50">
    <div class="max-w-2xl mx-auto px-6 py-12" v-if="event">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 mb-10">
        <div class="relative w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md shadow-brand-500/20">
          <svg class="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        </div>
        <span class="font-display font-bold text-lg text-ink tracking-tight">Event<span class="text-brand-600">Book</span></span>
      </RouterLink>

      <!-- Event card -->
      <div class="card mb-6">
        <AppBadge :variant="event.status.toLowerCase()" dot class="mb-4">
          {{ event.status === 'ACTIVE' ? 'Pendaftaran Terbuka' : 'Pendaftaran Ditutup' }}
        </AppBadge>
        <h1 class="font-display text-2xl font-bold text-ink mb-3 leading-snug">{{ event.title }}</h1>
        <p class="text-ink-muted text-sm leading-relaxed mb-6">{{ event.description }}</p>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-surface-50 rounded-xl p-4">
            <p class="text-xs text-ink-faint mb-1">Tanggal</p>
            <p class="font-medium text-sm text-ink">{{ formatDate(event.date) }}</p>
            <p class="text-xs text-ink-muted">{{ formatTime(event.date) }}</p>
          </div>
          <div class="bg-surface-50 rounded-xl p-4">
            <p class="text-xs text-ink-faint mb-1">Lokasi</p>
            <p class="font-medium text-sm text-ink">{{ event.location }}</p>
          </div>
        </div>

        <!-- Quota -->
        <div class="mb-6">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="text-ink-muted">{{ event.bookedCount }} dari {{ event.quota }} peserta terdaftar</span>
            <span class="font-mono font-medium" :class="event.availableSlots <= 5 ? 'text-red-500' : 'text-ink-muted'">
              {{ event.availableSlots }} tersisa
            </span>
          </div>
          <div class="h-2 bg-surface-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              :class="fillPct >= 100 ? 'bg-red-400' : fillPct >= 80 ? 'bg-amber-400' : 'bg-brand-500'"
              :style="{ width: `${Math.min(fillPct, 100)}%` }"
            />
          </div>
        </div>

        <RouterLink
          v-if="event.status === 'ACTIVE' && event.availableSlots > 0"
          :to="`/book/${event.id}`"
          class="btn-primary w-full justify-center"
        >
          Daftar Sekarang
        </RouterLink>
        <div v-else class="text-center py-3 text-sm text-ink-muted bg-surface-100 rounded-xl">
          {{ event.status !== 'ACTIVE' ? 'Pendaftaran telah ditutup' : 'Kuota penuh — daftar waitlist' }}
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
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

const fillPct = computed(() => event.value ? (event.value.bookedCount / event.value.quota) * 100 : 0)
const formatDate = (d) => format(new Date(d), 'd MMMM yyyy', { locale: id })
const formatTime = (d) => format(new Date(d), 'HH:mm') + ' WIB'

onMounted(async () => {
  const { data } = await eventsApi.getPublicOne(route.params.id)
  event.value = data.data
})
</script>
