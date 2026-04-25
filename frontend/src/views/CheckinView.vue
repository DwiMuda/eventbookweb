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

    <!-- Hidden element for file scanning -->
    <div id="qr-reader-hidden" class="hidden"></div>

    <!-- Check-in form -->
    <div class="card mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-sm text-ink">Check-in Peserta</h3>
        <div class="flex gap-2">
          <!-- Button Scan Kamera -->
          <button 
            @click="toggleScanner" 
            class="text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5"
            :class="isScanning ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-surface-50 text-ink-muted border-surface-200 hover:bg-surface-100'"
          >
            <svg v-if="!isScanning" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <span>{{ isScanning ? 'Tutup' : 'Scan QR' }}</span>
          </button>

          <!-- Button Upload File -->
          <button 
            @click="$refs.fileInput.click()" 
            class="text-xs font-medium px-2.5 py-1.5 rounded-lg border bg-surface-50 text-ink-muted border-surface-200 hover:bg-surface-100 transition-colors flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12.75a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>Pilih Foto</span>
          </button>
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="image/*" 
            @change="handleFileUpload"
          />
        </div>
      </div>

      <!-- QR Scanner Container -->
      <QrScanner 
        v-if="isScanning" 
        @scan="onScanSuccess" 
        @error="isScanning = false" 
        class="mb-4" 
      />

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
    console.error("Error scanning file:", err)
    result.value = { 
      success: false, 
      message: "Tidak dapat menemukan kode QR di foto ini. Pastikan gambar jelas." 
    }
  } finally {
    loading.value = false
    // Reset file input
    if (fileInput.value) fileInput.value.value = ''
    // Clean up
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
    
    // Refresh stats
    const statsRes = await checkinApi.getStats(route.params.id)
    stats.value = statsRes.data.data
  } catch (err) {
    result.value = { success: false, message: err.response?.data?.message || 'Check-in gagal' }
  } finally {
    loading.value = false
    setTimeout(() => { if (result.value?.success) result.value = null }, 5000)
  }
}

onMounted(async () => {
  const { data } = await checkinApi.getStats(route.params.id)
  stats.value = data.data
})
</script>
