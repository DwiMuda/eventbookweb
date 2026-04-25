<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-screen bg-surface-50 flex">
    <!-- Left panel - decorative -->
    <div class="hidden lg:flex lg:w-1/2 bg-brand-600 flex-col justify-between p-12 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white" style="filter: blur(80px)" />
        <div class="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-white" style="filter: blur(60px)" />
      </div>
      <div class="relative z-10">
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <svg class="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <span class="font-display font-bold text-xl text-white tracking-tight">Event<span class="opacity-80">Book</span></span>
        </RouterLink>
      </div>
      <div class="relative z-10 space-y-4">
        <h1 class="font-display text-4xl font-bold text-white leading-tight">
          Kelola event<br />dengan mudah.
        </h1>
        <p class="text-brand-200 text-base leading-relaxed max-w-sm">
          Platform manajemen event modern untuk komunitas, workshop, dan event organizer profesional.
        </p>
      </div>
      <div class="relative z-10 flex items-center gap-2">
        <div class="flex -space-x-2">
          <div v-for="i in 4" :key="i" class="w-8 h-8 rounded-full bg-white/20 border-2 border-brand-600 flex items-center justify-center text-xs text-white font-bold">
            {{ ['B','D','R','A'][i-1] }}
          </div>
        </div>
        <p class="text-brand-200 text-sm">+200 organizer aktif</p>
      </div>
    </div>

    <!-- Right panel - form -->
    <div class="flex-1 flex items-center justify-center px-8 py-12">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-3 mb-8">
          <div class="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <span class="font-display font-bold text-xl text-ink tracking-tight">Event<span class="text-brand-600">Book</span></span>
        </div>

        <div class="mb-8">
          <h2 class="font-display text-2xl font-bold text-ink">Selamat datang kembali</h2>
          <p class="text-ink-muted text-sm mt-1">Masuk ke akun EventBook Anda</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <AppInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="nama@email.com"
            :error="errors.email"
            required
          />
          <AppInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            required
          />

          <p v-if="errors.general" class="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
            {{ errors.general }}
          </p>

          <AppButton type="submit" class="w-full" :loading="auth.loading" size="lg">
            Masuk
          </AppButton>
        </form>

        <p class="text-center text-sm text-ink-muted mt-6">
          Belum punya akun?
          <RouterLink to="/register" class="text-brand-600 font-medium hover:text-brand-700">
            Daftar sekarang
          </RouterLink>
        </p>

        <!-- Demo credentials -->
        <div class="mt-6 p-4 bg-surface-100 rounded-xl border border-surface-200">
          <p class="text-xs font-medium text-ink-muted mb-2">Demo credentials:</p>
          <button
            class="text-xs text-brand-600 hover:text-brand-700 block"
            @click="fillDemo('organizer@eventbook.id', 'organizer123')"
          >
            organizer@eventbook.id / organizer123
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const auth = useAuthStore()
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '', general: '' })

const fillDemo = (email, password) => {
  form.email = email
  form.password = password
}

const handleLogin = async () => {
  errors.email = ''
  errors.password = ''
  errors.general = ''
  if (!form.email) { errors.email = 'Email wajib diisi'; return }
  if (!form.password) { errors.password = 'Password wajib diisi'; return }
  try {
    await auth.login(form)
  } catch (err) {
    errors.general = err.response?.data?.message || 'Login gagal, coba lagi'
  }
}
</script>
