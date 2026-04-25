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

      <RouterLink to="/" class="flex items-center gap-3 mb-8 group">
        <div class="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        </div>
        <span class="font-display font-bold text-xl text-ink tracking-tight">Event<span class="text-brand-600">Book</span></span>
      </RouterLink>

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
