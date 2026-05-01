<!-- src/views/EventFormView.vue -->
<template>
  <div class="max-w-6xl mx-auto pb-20 text-left animate-in fade-in duration-700">
    <!-- Header -->
    <div class="mb-10">
      <RouterLink to="/events" class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-faint hover:text-brand-600 transition-colors mb-4">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Kembali ke Daftar
      </RouterLink>
      <h1 class="text-3xl font-display font-bold text-ink tracking-tight">
        {{ isEdit ? 'Perbarui Event' : 'Rancang Event Baru' }}
      </h1>
    </div>

    <div class="grid lg:grid-cols-12 gap-10 items-start">
      <!-- Left Column: Form Fields -->
      <form @submit.prevent="handleSubmit" class="lg:col-span-7 space-y-8">
        <!-- Section 1: Informasi Utama -->
        <section class="bg-surface-0 border border-surface-200 rounded-[2rem] p-6 sm:p-8 shadow-sm">
          <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint mb-8 flex items-center gap-3">
            <span class="w-8 h-px bg-surface-200"></span>
            Detail Acara
          </h2>
          
          <div class="space-y-6">
            <AppInput
              v-model="form.title"
              label="Apa Nama Eventnya?"
              placeholder="Masukkan judul yang menarik..."
              required
              :error="errors.title"
            />

            <AppInput
              v-model="form.description"
              type="textarea"
              label="Tentang Event Ini"
              placeholder="Berikan deskripsi lengkap agar peserta tertarik..."
              required
              :error="errors.description"
              :rows="6"
            />
          </div>
        </section>

        <!-- Section 2: Logistik & Kapasitas -->
        <section class="bg-surface-0 border border-surface-200 rounded-[2rem] p-6 sm:p-8 shadow-sm">
          <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint mb-8 flex items-center gap-3">
            <span class="w-8 h-px bg-surface-200"></span>
            Waktu & Tempat
          </h2>
          
          <div class="grid sm:grid-cols-2 gap-6">
            <AppInput
              v-model="form.date"
              type="datetime-local"
              label="Kapan Dilaksanakan?"
              required
              :error="errors.date"
            />
            <AppInput
              v-model="form.quota"
              type="number"
              label="Maksimal Peserta"
              required
              :error="errors.quota"
            />
          </div>

          <div class="mt-6">
            <label class="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint mb-3 ml-1">Di Mana Lokasinya?</label>
            <LocationPicker
              v-model="form.location"
              :error="errors.location"
            />
          </div>
        </section>

        <!-- Section 3: Status -->
        <section class="bg-surface-0 border border-surface-200 rounded-[2rem] p-6 sm:p-8 shadow-sm">
          <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint mb-6 flex items-center gap-3">
            <span class="w-8 h-px bg-surface-200"></span>
            Pengaturan Publikasi
          </h2>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="s in ['DRAFT', 'ACTIVE']"
              :key="s"
              type="button"
              @click="form.status = s"
              class="flex-1 min-w-[140px] h-14 rounded-2xl border-2 font-bold text-xs uppercase tracking-widest transition-all"
              :class="form.status === s 
                ? 'bg-ink text-surface-0 border-ink shadow-lg shadow-ink/10' 
                : 'bg-surface-0 text-ink-muted border-surface-200 hover:border-brand-500/30'"
            >
              {{ s === 'ACTIVE' ? '🚀 Publikasikan' : '💾 Simpan Draft' }}
            </button>
          </div>
        </section>

        <!-- Mobile Action Buttons -->
        <div class="flex items-center justify-end gap-4 pt-4 lg:hidden">
          <AppButton 
            type="submit" 
            :loading="loading" 
            size="lg" 
            class="w-full !rounded-2xl !h-14"
          >
            {{ isEdit ? 'Simpan Perubahan' : 'Buat Event Sekarang' }}
          </AppButton>
        </div>
      </form>

      <!-- Right Column: Sticky Preview & Final Actions -->
      <aside class="lg:col-span-5 sticky top-24 space-y-6 hidden lg:block">
        <div class="bg-surface-0 border border-surface-200 rounded-[2.5rem] p-8 shadow-xl shadow-ink/5">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-ink">Pratinjau Kartu</h3>
            <span class="text-[10px] font-bold text-ink-faint">Live Preview</span>
          </div>

          <!-- Dummy Event Card for Preview -->
          <div class="bg-surface-50 border border-surface-100 rounded-3xl p-6 opacity-90 grayscale-[0.2]">
            <div class="flex items-center justify-between mb-4">
              <div class="px-2.5 py-1 bg-brand-500/10 text-brand-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                {{ form.status }}
              </div>
              <span class="text-[10px] font-bold text-ink-faint">{{ form.date ? new Date(form.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : 'Tanggal' }}</span>
            </div>
            <h4 class="font-display font-bold text-lg text-ink mb-2 line-clamp-1">
              {{ form.title || 'Judul Event Anda' }}
            </h4>
            <p class="text-xs text-ink-muted line-clamp-2 mb-4 leading-relaxed">
              {{ form.description || 'Deskripsi singkat acara Anda akan muncul di sini...' }}
            </p>
            <div class="flex items-center gap-4 text-[10px] font-bold text-ink-muted">
              <span class="truncate">📍 {{ form.location || 'Lokasi Belum Diatur' }}</span>
              <span>👥 {{ form.quota || 0 }} Kursi</span>
            </div>
          </div>

          <div class="mt-10 space-y-4">
            <p class="text-xs text-ink-muted text-center leading-relaxed">Pastikan semua data sudah benar sebelum mempublikasikan event Anda ke publik.</p>
            <AppButton 
              @click="handleSubmit"
              :loading="loading" 
              size="lg" 
              class="w-full !rounded-[1.5rem] !h-16 !text-base shadow-xl shadow-brand-600/20"
            >
              {{ isEdit ? 'Simpan Perubahan' : 'Publikasikan Sekarang' }}
            </AppButton>
            <button @click="$router.back()" class="w-full text-xs font-bold text-ink-faint hover:text-ink transition-colors uppercase tracking-widest">
              Batalkan
            </button>
          </div>
        </div>

        <!-- Tips Card -->
        <div class="bg-brand-600 rounded-[2rem] p-6 text-white relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <h4 class="text-sm font-bold mb-2">Tips Organizer</h4>
          <p class="text-xs text-white/80 leading-relaxed">Gunakan foto yang jernih dan deskripsi yang jelas untuk meningkatkan minat peserta pendaftar hingga 40%.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eventsApi } from '@/api/index'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import LocationPicker from '@/components/ui/LocationPicker.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  quota: 50,
  status: 'DRAFT',
})

const loading = ref(false)
const errors = ref({})

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}
  try {
    if (isEdit.value) {
      await eventsApi.update(route.params.id, form.value)
    } else {
      await eventsApi.create(form.value)
    }
    router.push('/events')
  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    const { data } = await eventsApi.getOne(route.params.id)
    const event = data.data
    form.value = {
      title: event.title,
      description: event.description,
      date: event.date.substring(0, 16),
      location: event.location,
      quota: event.quota,
      status: event.status,
    }
  }
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.animate-in { animation-fill-mode: both; }
.fade-in { animation-name: fade-in; }
</style>
