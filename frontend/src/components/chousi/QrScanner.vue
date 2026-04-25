<!-- src/components/chousi/QrScanner.vue -->
<template>
  <div class="qr-scanner-container overflow-hidden rounded-xl border border-surface-200 bg-black aspect-square relative shadow-inner">
    <div :id="scannerId" class="w-full h-full overflow-hidden"></div>
    
    <!-- Scanner Overlay UI -->
    <div class="absolute inset-0 z-10 pointer-events-none border-[40px] border-black/40">
      <div class="w-full h-full border-2 border-brand-500/50 relative">
        <div class="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-brand-500"></div>
        <div class="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-brand-500"></div>
        <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-brand-500"></div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-brand-500"></div>
        
        <!-- Animated Scan Line -->
        <div class="absolute top-0 left-0 w-full h-0.5 bg-brand-500/50 shadow-[0_0_8px_rgba(66,83,232,0.8)] animate-scan"></div>
      </div>
    </div>
    
    <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-xs text-brand-200 font-medium">Menghubungkan kamera...</p>
    </div>

    <div v-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-30 p-6 text-center">
      <p class="text-red-400 text-sm mb-4">{{ error }}</p>
      <button @click="retry" class="px-4 py-2 bg-brand-500 text-white rounded-lg text-xs font-semibold">
        Coba Lagi
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const props = defineProps({
  scannerId: {
    type: String,
    default: 'qr-reader'
  },
  fps: {
    type: Number,
    default: 15
  },
  qrbox: {
    type: Number,
    default: 250
  }
})

const emit = defineEmits(['scan', 'error', 'close'])

const loading = ref(false)
const error = ref(null)
let html5QrcodeInstance = null

const onScanSuccess = (decodedText) => {
  emit('scan', decodedText)
}

const startScanner = async () => {
  loading.value = true
  error.value = null
  
  await nextTick()
  
  try {
    if (html5QrcodeInstance) {
      try { await html5QrcodeInstance.stop() } catch (e) {}
    }
    
    html5QrcodeInstance = new Html5Qrcode(props.scannerId)
    const config = { 
      fps: props.fps, 
      qrbox: { width: props.qrbox, height: props.qrbox } 
    }
    
    try {
      await html5QrcodeInstance.start(
        { facingMode: "environment" },
        config,
        onScanSuccess
      )
    } catch (err) {
      console.warn("Kamera belakang tidak ditemukan, mencoba kamera default...")
      await html5QrcodeInstance.start(
        { facingMode: "user" },
        config,
        onScanSuccess
      )
    }
  } catch (err) {
    console.error("Camera access error:", err)
    error.value = "Gagal mengakses kamera. Gunakan localhost atau HTTPS untuk izin kamera."
    emit('error', err)
  } finally {
    loading.value = false
  }
}

const stopScanner = async () => {
  if (html5QrcodeInstance) {
    try {
      if (html5QrcodeInstance.isScanning) {
        await html5QrcodeInstance.stop()
      }
    } catch (e) {
      console.error("Error stopping scanner:", e)
    } finally {
      html5QrcodeInstance = null
    }
  }
}

const retry = () => {
  startScanner()
}

onMounted(() => {
  startScanner()
})

onUnmounted(() => {
  stopScanner()
})

defineExpose({
  stopScanner,
  retry
})
</script>

<style scoped>
@keyframes scan {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}

.animate-scan {
  animation: scan 3s linear infinite;
}
</style>
