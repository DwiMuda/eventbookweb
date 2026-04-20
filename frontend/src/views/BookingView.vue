<!-- src/views/BookingView.vue -->
<template>
  <div class="min-h-screen bg-surface-50 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3 mb-8">
        <div class="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
          </svg>
        </div>
        <span class="font-display font-bold text-base text-ink">EventBook</span>
      </RouterLink>

      <!-- Event preview -->
      <div class="bg-brand-600 rounded-2xl p-5 mb-6 text-white" v-if="event">
        <p class="text-brand-200 text-xs mb-1">Anda mendaftar ke</p>
        <h2 class="font-display font-bold text-lg leading-snug">{{ event.title }}</h2>
        <p class="text-brand-200 text-sm mt-1">{{ formatDate(event.date) }} · {{ event.location }}</p>
      </div>

      <!-- Success state -->
      <div v-if="booking" class="card text-center py-8">
        <div class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="font-display font-bold text-lg text-ink mb-1">Pendaftaran Berhasil!</h3>
        <p class="text-sm text-ink-muted mb-2">Kode booking Anda:</p>
        <p class="font-mono font-bold text-xl text-brand-600 bg-brand-50 inline-block px-4 py-2 rounded-xl mb-6">
          {{ booking.bookingCode }}
        </p>
        <RouterLink :to="`/ticket/${booking.bookingCode}`" class="btn-primary w-full justify-center">
          Lihat Tiket Digital
        </RouterLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleBook" class="card space-y-4">
        <h3 class="font-display font-semibold text-base text-ink">Data Peserta</h3>

        <AppInput v-model="form.name" label="Nama Lengkap" placeholder="Budi Santoso" :error="errors.name" required />
        <AppInput v-model="form.email" label="Email" type="email" placeholder="budi@email.com" :error="errors.email" required hint="Tiket akan dikirim ke email ini" />
        <AppInput v-model="form.phone" label="Nomor HP / WhatsApp" type="tel" placeholder="08123456789" :error="errors.phone" required />

        <p v-if="errors.general" class="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{{ errors.general }}</p>

        <AppButton type="submit" class="w-full" size="lg" :loading="loading">
          Daftar Sekarang
        </AppButton>
        <p class="text-xs text-center text-ink-faint">
          Dengan mendaftar, Anda menyetujui penggunaan data untuk keperluan event ini.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { eventsApi, bookingsApi } from '@/api/index'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const route = useRoute()
const event = ref(null)
const booking = ref(null)
const loading = ref(false)
const form = reactive({ name: '', email: '', phone: '' })
const errors = reactive({ name: '', email: '', phone: '', general: '' })

const formatDate = (d) => format(new Date(d), 'd MMMM yyyy', { locale: id })

const handleBook = async () => {
  Object.keys(errors).forEach(k => errors[k] = '')
  if (!form.name) { errors.name = 'Nama wajib diisi'; return }
  if (!form.email) { errors.email = 'Email wajib diisi'; return }
  if (!form.phone) { errors.phone = 'Nomor HP wajib diisi'; return }

  loading.value = true
  try {
    const { data } = await bookingsApi.create({ ...form, eventId: route.params.id })
    booking.value = data.data
  } catch (err) {
    errors.general = err.response?.data?.message || 'Pendaftaran gagal, coba lagi'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const { data } = await eventsApi.getOne(route.params.id)
  event.value = data.data
})
</script>
