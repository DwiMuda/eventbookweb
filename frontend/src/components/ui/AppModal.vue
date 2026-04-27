<!-- src/components/ui/AppModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm dark:bg-black/60" />

        <!-- Panel -->
        <div
          class="relative bg-surface-0 rounded-2xl shadow-card-lg border border-surface-200 w-full overflow-hidden"
          :style="{ maxWidth: widthMap[size] }"
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="flex items-start justify-between px-6 pt-6 pb-4">
            <div>
              <h3 class="font-display font-bold text-lg text-ink">{{ title }}</h3>
              <p v-if="subtitle" class="text-sm text-ink-muted mt-0.5">{{ subtitle }}</p>
            </div>
            <button
              class="p-1.5 rounded-lg text-ink-faint hover:bg-surface-100 transition-colors ml-4 flex-shrink-0"
              @click="$emit('update:modelValue', false)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 pb-6" :class="{ 'pt-6': !title && !$slots.header }">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 bg-surface-50 border-t border-surface-200 flex items-center justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
  subtitle: String,
  size: { type: String, default: 'md' },
})
defineEmits(['update:modelValue'])

const widthMap = { sm: '400px', md: '540px', lg: '680px', xl: '800px' }
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(8px); }
</style>
