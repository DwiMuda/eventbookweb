<!-- src/views/CheckinView.vue -->
<template>
  <div class="max-w-xl">
    <RouterLink :to="`/events/${route.params.id}`" class="flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-6 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Kembali ke Event
    </RouterLink>

    <div class="page-header">
      <h1 class="page-title">Check-in Peserta</h1>
      <p class="page-subtitle">Input kode booking untuk check-in manual</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3 mb-6" v-if="stats">
      <div class="card text-center">
        <p class="font-display text-2xl font-bold text-ink">{{ stats.confirmed }}</p>
        <p class="text-xs text-ink-muted mt-0.5">Terdaftar</p>
      </div>
      <div class="card text-center">
        <p class="font-display text-2xl font-bold text-emerald-600">{{ stats.checkedIn }}</p>
        <p class="text-xs text-ink-muted mt-0.5">Hadir</p>
      </div>
      <div class="card text-center">
        <p class="font-display text-2xl font-bold text-ink-faint">{{ stats.confirmed - stats.checkedIn }}</p>
        <p class="text-xs text-ink-muted mt-0.5">Belum hadir</p>
      </div>
    </div>

    <!-- Check-in form -->
    <div class="card mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-sm text-ink">Check-in Peserta</h3>
        <button 
          @click="toggleScanner" 
          class="text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5"
          :class="isScanning ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-surface-50 text-ink-muted border-surface-200 hover:bg-surface-100'"
        >
          <svg v-if="!isScanning" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          <span v-else>Tutup Scanner</span>
          <span v-if="!isScanning">Scan QR</span>
        </button>
      </div>

      <!-- QR Scanner Container -->
      <div v-show="isScanning" class="mb-4 overflow-hidden rounded-xl border border-surface-200 bg-black">
        <div id="qr-reader"></div>
      </div>

      <form @submit.prevent="handleCheckin" class="flex gap-3">
        <input
          v-model="bookingCode"
          class="input flex-1 font-mono uppercase"
          placeholder="Input kode atau scan QR"
          @input="bookingCode = bookingCode.toUpperCase()"
        />
        <AppButton type="submit" :loading="loading" :disabled="!bookingCode">
          Check-in
        </AppButton>
      </form>

      <!-- Result -->
      <div v-if="result" class="mt-4">
        <div v-if="result.success" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-emerald-800">Check-in Berhasil!</p>
            <p class="text-sm text-emerald-700">{{ result.data.participant.name }}</p>
            <p class="text-xs text-emerald-600">{{ result.data.participant.email }}</p>
          </div>
        </div>
        <div v-else class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-red-800">Gagal</p>
            <p class="text-sm text-red-600">{{ result.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent check-ins -->
    <div class="card" v-if="recentCheckins.length">
      <h3 class="font-semibold text-sm text-ink mb-4">Check-in Terakhir</h3>
      <div class="space-y-2">
        <div v-for="c in recentCheckins" :key="c.bookingCode" class="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
          <div class="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold flex-shrink-0">
            ✓
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ink truncate">{{ c.name }}</p>
            <p class="text-xs text-ink-faint font-mono">{{ c.bookingCode }}</p>
          </div>
          <p class="text-xs text-ink-faint">{{ c.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { checkinApi } from '@/api/index'
import AppButton from '@/components/ui/AppButton.vue'
import { format } from 'date-fns'
import { Html5QrcodeScanner } from 'html5-qrcode'

const route = useRoute()
const bookingCode = ref('')
const loading = ref(false)
const result = ref(null)
const stats = ref(null)
const recentCheckins = ref([])

const isScanning = ref(false)
let html5QrcodeScanner = null

const onScanSuccess = (decodedText) => {
  bookingCode.value = decodedText.toUpperCase()
  handleCheckin()
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear()
    isScanning.value = false
  }
}

const toggleScanner = () => {
  isScanning.value = !isScanning.value
  if (isScanning.value) {
    setTimeout(() => {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      )
      html5QrcodeScanner.render(onScanSuccess)
    }, 100)
  } else {
    if (html5QrcodeScanner) {
      html5QrcodeScanner.clear()
    }
  }
}

const handleCheckin = async () => {
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
    // Refresh stats
    const statsRes = await checkinApi.getStats(route.params.id)
    stats.value = statsRes.data.data
  } catch (err) {
    result.value = { success: false, message: err.response?.data?.message || 'Check-in gagal' }
  } finally {
    loading.value = false
    setTimeout(() => result.value = null, 5000)
  }
}

onMounted(async () => {
  const { data } = await checkinApi.getStats(route.params.id)
  stats.value = data.data
})

onUnmounted(() => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear()
  }
})
</script>
