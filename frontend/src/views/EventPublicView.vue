<!-- src/views/EventPublicView.vue -->
<template>
  <div class="min-h-screen bg-surface-50">
    <div class="max-w-2xl mx-auto px-6 py-12" v-if="event">
      <!-- Logo -->
      <div class="flex items-center gap-3 mb-10">
        <div class="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
          </svg>
        </div>
        <span class="font-display font-bold text-base text-ink">EventBook</span>
      </div>

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
  const { data } = await eventsApi.getOne(route.params.id)
  event.value = data.data
})
</script>
