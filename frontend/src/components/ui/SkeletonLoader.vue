<!-- src/components/ui/SkeletonLoader.vue -->
<template>
  <div 
    class="animate-pulse bg-surface-100 rounded-xl" 
    :class="[heightClass, widthClass]"
  ></div>
</template>

<script setup>
defineProps({
  heightClass: {
    type: String,
    default: 'h-4'
  },
  widthClass: {
    type: String,
    default: 'w-full'
  }
})
</script>
