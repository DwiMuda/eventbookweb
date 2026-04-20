<!-- src/views/EventFormView.vue -->
<template>
  <div class="max-w-2xl">
    <!-- Back -->
    <RouterLink to="/events" class="flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-6 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Kembali ke Events
    </RouterLink>

    <div class="page-header">
      <h1 class="page-title">{{ isEdit ? 'Edit Event' : 'Buat Event Baru' }}</h1>
      <p class="page-subtitle">{{ isEdit ? 'Perbarui informasi event Anda' : 'Isi detail event yang ingin dibuat' }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="card space-y-5">
        <h3 class="font-display font-semibold text-sm text-ink-muted uppercase tracking-wider">Informasi Dasar</h3>

        <AppInput v-model="form.title" label="Judul Event" placeholder="Vue.js Workshop — Bali Tech" :error="errors.title" required />
        <AppInput v-model="form.description" label="Deskripsi" type="textarea" :rows="4" placeholder="Deskripsikan event Anda..." :error="errors.description" required />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput v-model="form.date" label="Tanggal & Waktu" type="datetime-local" :error="errors.date" required />
          <AppInput v-model="form.location" label="Lokasi" placeholder="Dojo Bali, Canggu" :error="errors.location" required />
        </div>
      </div>

      <div class="card space-y-5">
        <h3 class="font-display font-semibold text-sm text-ink-muted uppercase tracking-wider">Pengaturan</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput v-model="form.quota" label="Kuota Peserta" type="number" placeholder="50" :error="errors.quota" required />

          <div>
            <label class="input-label">Status Event</label>
            <select v-model="form.status" class="input">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Aktif</option>
              <option value="CLOSED">Ditutup</option>
            </select>
          </div>
        </div>
      </div>

      <p v-if="errors.general" class="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{{ errors.general }}</p>

      <div class="flex items-center gap-3">
        <AppButton type="submit" :loading="loading">
          {{ isEdit ? 'Simpan Perubahan' : 'Buat Event' }}
        </AppButton>
        <RouterLink to="/events" class="btn-secondary">Batal</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eventsApi } from '@/api/index'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const form = reactive({
  title: '', description: '', date: '', location: '',
  quota: '', status: 'ACTIVE',
})
const errors = reactive({ title: '', description: '', date: '', location: '', quota: '', general: '' })

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await eventsApi.getOne(route.params.id)
      const e = data.data
      form.title = e.title
      form.description = e.description
      form.date = format(new Date(e.date), "yyyy-MM-dd'T'HH:mm")
      form.location = e.location
      form.quota = e.quota
      form.status = e.status
    } catch {
      router.push('/events')
    }
  }
})

const handleSubmit = async () => {
  Object.keys(errors).forEach(k => errors[k] = '')
  if (!form.title) { errors.title = 'Judul wajib diisi'; return }
  if (!form.description) { errors.description = 'Deskripsi wajib diisi'; return }
  if (!form.date) { errors.date = 'Tanggal wajib diisi'; return }
  if (!form.location) { errors.location = 'Lokasi wajib diisi'; return }
  if (!form.quota || form.quota < 1) { errors.quota = 'Kuota minimal 1'; return }

  loading.value = true
  try {
    if (isEdit.value) {
      await eventsApi.update(route.params.id, form)
    } else {
      await eventsApi.create(form)
    }
    router.push('/events')
  } catch (err) {
    errors.general = err.response?.data?.message || 'Gagal menyimpan event'
  } finally {
    loading.value = false
  }
}
</script>
