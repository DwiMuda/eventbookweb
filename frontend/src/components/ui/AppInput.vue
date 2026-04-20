<!-- src/components/ui/AppInput.vue -->
<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-ink-faint">
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
        :class="[
          'input',
          $slots.prefix ? 'pl-10' : '',
          $slots.suffix ? 'pr-10' : '',
          error ? 'border-red-400 focus:ring-red-400' : '',
          type === 'textarea' ? 'resize-none' : ''
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />
      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-ink-faint">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    <p v-if="hint && !error" class="text-xs text-ink-faint">{{ hint }}</p>
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
