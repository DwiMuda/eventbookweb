<!-- src/components/ui/AppBadge.vue -->
<template>
  <span :class="['badge', variantClass]">
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :class="dotClass" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: { type: String, default: 'default' },
  dot: Boolean,
})
const variantClass = computed(() => ({
  active: 'badge-active',
  closed: 'badge-closed',
  draft: 'badge-draft',
  waitlist: 'badge-waitlist',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  default: 'bg-surface-200 text-ink-muted',
}[props.variant] || 'badge-confirmed'))
const dotClass = computed(() => ({
  active: 'bg-emerald-500',
  closed: 'bg-gray-400',
  confirmed: 'bg-brand-500',
  cancelled: 'bg-red-500',
  waitlist: 'bg-purple-500',
}[props.variant] || 'bg-gray-400'))
</script>
