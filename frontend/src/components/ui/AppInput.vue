<!-- src/components/ui/AppInput.vue -->
<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="text-xs font-bold uppercase tracking-widest text-ink-muted/80 ml-1">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative group">
      <!-- Prefix Icon Slot -->
      <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-ink-faint group-focus-within:text-brand-600 transition-colors">
        <slot name="prefix" />
      </div>

      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        :id="id"
        :type="type !== 'textarea' ? type : undefined"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        class="w-full bg-surface-0 border-2 border-surface-200 rounded-2xl text-ink text-sm font-medium placeholder:text-ink-faint/50 placeholder:font-normal focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none disabled:opacity-50 disabled:bg-surface-50"
        :class="[
          $slots.prefix ? 'pl-11' : 'px-4',
          $slots.suffix ? 'pr-11' : 'px-4',
          type === 'textarea' ? 'py-4 resize-none' : 'h-12',
          error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/5' : ''
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />

      <!-- Suffix Icon Slot -->
      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-ink-faint group-focus-within:text-brand-600 transition-colors">
        <slot name="suffix" />
      </div>
    </div>
    
    <!-- Error/Hint Message -->
    <Transition name="fade-slide">
      <p v-if="error" class="text-[11px] font-bold text-red-600 flex items-center gap-1 ml-1">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {{ error }}
      </p>
      <p v-else-if="hint" class="text-[11px] text-ink-faint font-medium ml-1">
        {{ hint }}
      </p>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
  rows: { type: Number, default: 4 },
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2)}` },
})
defineEmits(['update:modelValue', 'blur'])
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(-4px); }
.fade-slide-leave-to { opacity: 0; }
</style>
