<!-- src/components/ui/StatsCard.vue -->
<template>
  <div class="card">
    <div v-if="loading">
      <SkeletonLoader width-class="w-20" height-class="h-3" class="mb-3" />
      <SkeletonLoader width-class="w-16" height-class="h-8" class="mb-2" />
      <SkeletonLoader width-class="w-24" height-class="h-3" />
    </div>
    <div v-else class="flex items-start justify-between">
      <div>
        <p class="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">{{ label }}</p>
        <p class="font-display text-3xl font-bold text-ink">{{ value }}</p>
        <p v-if="sub" class="text-xs text-ink-faint mt-1">{{ sub }}</p>
      </div>
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', iconBg]">
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from './SkeletonLoader.vue'

defineProps({
  label: String,
  value: [String, Number],
  sub: String,
  iconBg: { type: String, default: 'bg-brand-50 text-brand-600' },
  loading: Boolean,
})
</script>
