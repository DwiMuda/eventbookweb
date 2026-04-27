<!-- src/components/event/EventCard.vue -->
<template>
  <div 
    class="bg-surface-0 border border-surface-200 rounded-2xl p-6 transition-shadow duration-300 cursor-pointer group hover:shadow-md relative flex flex-col h-full" 
    @click="$router.push(`/events/${event.id}`)"
  >
    <!-- Status & Date Row -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <span class="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
          {{ formatMonth(event.date) }}
        </span>
        <span class="text-xl font-display font-bold text-ink leading-none mt-0.5">
          {{ formatDay(event.date) }}
        </span>
      </div>
      <AppBadge :variant="event.status.toLowerCase()" dot class="!px-3 !py-1 !text-[10px] font-semibold border-none bg-surface-50 dark:bg-surface-100">
        {{ event.status === 'ACTIVE' ? 'Aktif' : event.status === 'CLOSED' ? 'Tutup' : 'Draft' }}
      </AppBadge>
    </div>

    <!-- Title -->
    <div class="mb-4">
      <h3 class="font-display font-bold text-lg text-ink leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
        {{ event.title }}
      </h3>
    </div>

    <!-- Meta Info (Horizontal) -->
    <div class="flex items-center gap-4 mb-6">
      <div class="flex items-center gap-1.5 text-xs text-ink-muted min-w-0">
        <svg class="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        <span class="truncate">{{ event.location }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-xs text-ink-muted shrink-0">
        <svg class="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ formatTime(event.date) }}</span>
      </div>
    </div>

    <!-- Capacity (Minimal) -->
    <div class="mt-auto pt-4 border-t border-surface-100">
      <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
        <span class="text-ink-faint">Kapasitas</span>
        <span class="text-ink">{{ event.bookedCount }} / {{ event.quota }}</span>
      </div>
      <div class="h-1 bg-surface-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full bg-brand-500 transition-all duration-1000 ease-out"
          :class="{ 'bg-red-500': fillPercentage >= 90, 'bg-amber-500': fillPercentage >= 70 && fillPercentage < 90 }"
          :style="{ width: `${Math.min(fillPercentage, 100)}%` }"
        ></div>
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
const formatDay = (d) => format(new Date(d), 'dd')
const formatMonth = (d) => format(new Date(d), 'MMMM', { locale: id })
const formatTime = (d) => format(new Date(d), 'HH:mm')
</script>
