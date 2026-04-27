<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const auth = useAuthStore()
const { theme } = useTheme()

onMounted(() => {
  auth.fetchUser()
})
</script>
