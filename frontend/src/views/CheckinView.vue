<!-- src/views/CheckinView.vue -->
<template>
  <div class="max-w-xl text-left">
    <!-- Back Link -->
    <RouterLink :to="`/events/${route.params.id}`" class="flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-6 transition-colors group">
      <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Kembali ke Dashboard
    </RouterLink>

    <div class="page-header">
      <h1 class="page-title flex items-center gap-3">
        <svg class="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Check-in Peserta
      </h1>
      <p class="page-subtitle">Validasi kehadiran peserta melalui kode booking atau QR</p>
    </div>

    <!-- Stats Grid with Icons -->
    <div class="grid grid-cols-3 gap-4 mb-6" v-if="stats">
      <div class="card p-4 border-surface-200">
        <div class="flex items-center gap-2 mb-2 text-ink-faint">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-[10px] font-bold uppercase tracking-wider">Total</span>
        </div>
        <p class="font-display text-2xl font-bold text-ink">{{ stats.confirmed }}</p>
      </div>
      
      <div class="card p-4 border-emerald-100 bg-emerald-50/30">
        <div class="flex items-center gap-2 mb-2 text-emerald-600">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-[10px] font-bold uppercase tracking-wider">Hadir</span>
        </div>
        <p class="font-display text-2xl font-bold text-emerald-600">{{ stats.checkedIn }}</p>
      </div>

      <div class="card p-4 border-surface-200">
        <div class="flex items-center gap-2 mb-2 text-ink-faint">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-[10px] font-bold uppercase tracking-wider">Sisa</span>
        </div>
        <p class="font-display text-2xl font-bold text-ink-faint">{{ stats.confirmed - stats.checkedIn }}</p>
      </div>
    </div>

    <!-- Check-in Action Card -->
    <div class="card mb-6 shadow-sm border-surface-200">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-bold text-sm text-ink flex items-center gap-2">
          <svg class="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Input Validator
        </h3>
        <div class="flex gap-2">
          <button 
            @click="toggleScanner" 
            class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5"
            :class="isScanning ? 'bg-red-50 text-red-600 border-red-200' : 'bg-surface-50 text-ink-muted border-surface-200 hover:bg-surface-100'"
          >
            <svg v-if="!isScanning" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ isScanning ? 'Batal' : 'Scan QR' }}
          </button>

          <button 
            @click="$refs.fileInput.click()" 
            class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border bg-surface-50 text-ink-muted border-surface-200 hover:bg-surface-100 flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Foto
          </button>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>
      </div>

      <QrScanner v-if="isScanning" @scan="onScanSuccess" @error="isScanning = false" class="mb-5 rounded-xl overflow-hidden border border-surface-200 shadow-inner" />

      <form @submit.prevent="handleCheckin" class="flex gap-2">
        <input
          v-model="bookingCode"
          class="input flex-1 font-mono uppercase text-base tracking-widest"
          placeholder="KODE BOOKING"
          @input="bookingCode = bookingCode.toUpperCase()"
        />
        <AppButton type="submit" :loading="loading" :disabled="!bookingCode">
          Check-in
        </AppButton>
      </form>

      <!-- Result Feedback -->
      <Transition name="fade">
        <div v-if="result" class="mt-4">
          <div v-if="result.success" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <div class="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-bold text-emerald-900 text-sm leading-tight">Check-in Berhasil</p>
              <p class="text-emerald-700 text-xs mt-1 truncate">{{ result.data.participant.name }}</p>
            </div>
          </div>
          <div v-else class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <div class="w-9 h-9 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-red-900 text-sm leading-tight">Check-in Gagal</p>
              <p class="text-red-700 text-xs mt-1">{{ result.message }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Recent Logs -->
    <div class="card border-surface-200" v-if="recentCheckins.length">
      <h3 class="font-bold text-[10px] uppercase tracking-widest text-ink-faint mb-4 flex items-center gap-2">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Aktivitas Terkini
      </h3>
      <div class="space-y-2">
        <div v-for="c in recentCheckins" :key="c.bookingCode" class="flex items-center justify-between p-3 bg-surface-50 rounded-xl border border-surface-100">
          <div class="min-w-0 flex items-center gap-3">
            <div class="w-7 h-7 bg-white rounded-lg border border-surface-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-ink truncate">{{ c.name }}</p>
              <p class="text-[9px] font-mono font-bold text-ink-faint tracking-widest uppercase">{{ c.bookingCode }}</p>
            </div>
          </div>
          <p class="text-[10px] font-bold text-ink-faint bg-white px-2 py-1 rounded border border-surface-200">{{ c.time }}</p>
        </div>
      </div>
    </div>

    <div id="qr-reader-hidden" class="hidden"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { checkinApi } from '@/api/index'
import AppButton from '@/components/ui/AppButton.vue'
import { format } from 'date-fns'
import { Html5Qrcode } from 'html5-qrcode'

const QrScanner = defineAsyncComponent(() => import('@/components/chousi/QrScanner.vue'))

const route = useRoute()
const bookingCode = ref('')
const loading = ref(false)
const result = ref(null)
const stats = ref(null)
const recentCheckins = ref([])
const fileInput = ref(null)
const isScanning = ref(false)

const onScanSuccess = (decodedText) => {
  bookingCode.value = decodedText.toUpperCase()
  isScanning.value = false
  handleCheckin()
}

const toggleScanner = () => {
  isScanning.value = !isScanning.value
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  loading.value = true
  const html5QrCode = new Html5Qrcode("qr-reader-hidden")
  try {
    const decodedText = await html5QrCode.scanFile(file, true)
    bookingCode.value = decodedText.toUpperCase()
    handleCheckin()
  } catch (err) {
    result.value = { success: false, message: "QR tidak ditemukan" }
  } finally {
    loading.value = false
    if (fileInput.value) fileInput.value.value = ''
    html5QrCode.clear()
  }
}

const handleCheckin = async () => {
  if (!bookingCode.value) return
  loading.value = true
  result.value = null
  try {
    const { data } = await checkinApi.checkIn(bookingCode.value)
    result.value = { success: true, data: data.data }
    recentCheckins.value.unshift({
      name: data.data.participant.name,
      bookingCode: bookingCode.value,
      time: format(new Date(), 'HH:mm'),
    })
    if (recentCheckins.value.length > 5) recentCheckins.value.pop()
    bookingCode.value = ''
    const statsRes = await checkinApi.getStats(route.params.id)
    stats.value = statsRes.data.data
  } catch (err) {
    result.value = { success: false, message: err.response?.data?.message || 'Kode Tidak Valid' }
  } finally {
    loading.value = false
    setTimeout(() => { if (result.value?.success) result.value = null }, 3000)
  }
}

onMounted(async () => {
  const { data } = await checkinApi.getStats(route.params.id)
  stats.value = data.data
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
