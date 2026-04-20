<!-- src/views/RegisterView.vue -->
<template>
  <div class="min-h-screen bg-surface-50 flex items-center justify-center px-8 py-12">
    <div class="w-full max-w-sm">
      <RouterLink to="/login" class="flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-8 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Kembali ke login
      </RouterLink>

      <div class="flex items-center gap-3 mb-8">
        <div class="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
          </svg>
        </div>
        <span class="font-display font-bold text-lg text-ink">EventBook</span>
      </div>

      <div class="mb-8">
        <h2 class="font-display text-2xl font-bold text-ink">Buat akun baru</h2>
        <p class="text-ink-muted text-sm mt-1">Mulai kelola event Anda hari ini</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <AppInput v-model="form.name" label="Nama lengkap" placeholder="Budi Santoso" :error="errors.name" required />
        <AppInput v-model="form.email" label="Email" type="email" placeholder="nama@email.com" :error="errors.email" required />
        <AppInput v-model="form.password" label="Password" type="password" placeholder="Min. 8 karakter" :error="errors.password" required />

        <p v-if="errors.general" class="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{{ errors.general }}</p>
        <p v-if="success" class="text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl">
          Akun berhasil dibuat! Silakan login.
        </p>

        <AppButton type="submit" class="w-full" :loading="auth.loading" size="lg">
          Buat akun
        </AppButton>
      </form>

      <p class="text-center text-sm text-ink-muted mt-6">
        Sudah punya akun?
        <RouterLink to="/login" class="text-brand-600 font-medium hover:text-brand-700">Masuk</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()
const form = reactive({ name: '', email: '', password: '' })
const errors = reactive({ name: '', email: '', password: '', general: '' })
const success = ref(false)

const handleRegister = async () => {
  Object.keys(errors).forEach(k => errors[k] = '')
  if (!form.name) { errors.name = 'Nama wajib diisi'; return }
  if (!form.email) { errors.email = 'Email wajib diisi'; return }
  if (form.password.length < 8) { errors.password = 'Password minimal 8 karakter'; return }
  try {
    await auth.register(form)
    success.value = true
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    errors.general = err.response?.data?.message || 'Registrasi gagal'
  }
}
</script>
