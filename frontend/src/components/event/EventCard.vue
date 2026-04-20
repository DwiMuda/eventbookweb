<!-- src/components/event/EventCard.vue -->
<template>
  <div class="card-hover group" @click="$router.push(`/events/${event.id}`)">
    <!-- Status bar -->
    <div class="flex items-start justify-between mb-4">
      <AppBadge :variant="event.status.toLowerCase()" dot>
        {{ event.status === 'ACTIVE' ? 'Aktif' : event.status === 'CLOSED' ? 'Ditutup' : 'Draft' }}
      </AppBadge>
      <span class="text-xs text-ink-faint font-mono">
        {{ formatDate(event.date) }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="font-display font-semibold text-base text-ink mb-1 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
      {{ event.title }}
    </h3>
    <p class="text-sm text-ink-muted line-clamp-2 mb-4">{{ event.description }}</p>

    <!-- Meta -->
    <div class="space-y-2 mb-4">
      <div class="flex items-center gap-2 text-xs text-ink-muted">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span class="truncate">{{ event.location }}</span>
      </div>
      <div class="flex items-center gap-2 text-xs text-ink-muted">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ formatTime(event.date) }}</span>
      </div>
    </div>

    <!-- Quota bar -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-xs">
        <span class="text-ink-muted">Peserta terdaftar</span>
        <span class="font-mono font-medium text-ink">
          {{ event.bookedCount }} / {{ event.quota }}
        </span>
      </div>
      <div class="h-1.5 bg-surface-200 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="fillPercentage >= 100 ? 'bg-red-400' : fillPercentage >= 80 ? 'bg-amber-400' : 'bg-brand-500'"
          :style="{ width: `${Math.min(fillPercentage, 100)}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import AppBadge from '@/components/ui/AppBadge.vue'

const props = defineProps({ event: { type: Object, required: true } })

const fillPercentage = computed(() => (props.event.bookedCount / props.event.quota) * 100)
const formatDate = (d) => format(new Date(d), 'd MMM yyyy', { locale: id })
const formatTime = (d) => format(new Date(d), 'HH:mm') + ' WIB'
</script>
