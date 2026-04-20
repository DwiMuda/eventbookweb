<!-- src/components/ui/AppButton.vue -->
<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :disabled="disabled || loading"
    :class="[
      'btn',
      variantClass,
      sizeClass,
      { 'opacity-60 cursor-not-allowed': disabled || loading }
    ]"
    v-bind="$attrs"
  >
    <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: Boolean,
  disabled: Boolean,
  to: String,
  href: String,
})

const tag = computed(() => props.to ? 'RouterLink' : props.href ? 'a' : 'button')

const variantClass = computed(() => ({
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}[props.variant]))

const sizeClass = computed(() => ({
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}[props.size]))
</script>
