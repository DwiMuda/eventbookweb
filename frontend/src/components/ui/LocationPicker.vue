<!-- src/components/ui/LocationPicker.vue -->
<template>
  <div class="space-y-3">
    <!-- Search Input & Suggestions Wrapper -->
    <div class="relative group">
      <div class="relative flex items-center">
        <input
          type="text"
          class="input w-full pl-11 pr-11 h-12 shadow-sm border-surface-200 focus:border-brand-500 transition-all duration-300 rounded-xl"
          placeholder="Cari lokasi atau nama tempat..."
          v-model="searchQuery"
          @input="handleSearch"
          @focus="isFocused = true"
        />
        <!-- Left Icon -->
        <div class="absolute left-4 text-ink-faint group-focus-within:text-brand-500 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <!-- Clear/Loading Button -->
        <div class="absolute right-4 flex items-center">
          <div v-if="searching" class="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <button v-else-if="searchQuery" @click="clearSearch" class="text-ink-faint hover:text-red-500 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Suggestions Dropdown -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="suggestions.length > 0 && isFocused" class="absolute z-[2000] left-0 right-0 mt-2 bg-white border border-surface-200 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-white/95">
          <div class="p-2">
            <button
              v-for="s in suggestions"
              :key="s.place_id"
              type="button"
              class="w-full text-left px-4 py-3 hover:bg-brand-50 rounded-xl transition-all duration-200 flex items-start gap-3 group/item"
              @click="selectLocation(s)"
            >
              <div class="mt-0.5 text-ink-faint group-hover/item:text-brand-500 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-ink leading-tight">{{ s.name || 'Lokasi' }}</p>
                <p class="text-[11px] text-ink-muted mt-0.5 line-clamp-1">{{ s.display_name }}</p>
              </div>
            </button>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Map Container Container -->
    <div class="relative rounded-2xl border border-surface-200 overflow-hidden shadow-inner group/map">
      <div ref="mapContainer" class="h-72 w-full bg-surface-100 z-0"></div>
      
      <!-- Floating Map Info -->
      <div class="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
        <div class="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/50 shadow-lg flex items-center justify-between pointer-events-auto transition-all duration-300" :class="modelValue ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
            <p class="text-xs font-medium text-ink truncate">{{ modelValue || 'Pilih lokasi di peta' }}</p>
          </div>
          <button @click="locateMe" class="p-1.5 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors flex-shrink-0" title="Gunakan lokasi saya">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Map Prompt Overlay -->
      <div v-if="!modelValue" class="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
        <div class="bg-black/5 backdrop-blur-[1px] px-4 py-2 rounded-full border border-white/20 shadow-sm">
          <p class="text-[10px] font-bold text-black/40 uppercase tracking-widest">Klik untuk pilih lokasi</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const mapContainer = ref(null)
const searchQuery = ref(props.modelValue || '')
const suggestions = ref([])
const searching = ref(false)
const isFocused = ref(false)

let map = null
let marker = null
let searchTimeout = null

const initMap = () => {
  if (typeof L === 'undefined') {
    setTimeout(initMap, 100)
    return
  }

  const defaultCenter = [-8.65, 115.21] // Bali
  
  // Hapus map lama jika ada (mencegah double init)
  if (map) {
    map.remove()
  }

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false
  }).setView(defaultCenter, 13)

  // Gunakan OSM Standar dulu untuk memastikan koneksi (lebih stabil)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  // Custom Marker Icon
  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class='marker-pin'></div><div class='marker-dot'></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  })

  marker = L.marker(defaultCenter, { icon, draggable: true }).addTo(map)

  // FIX PETA ABU-ABU: Paksa render ulang setelah container stabil
  setTimeout(() => {
    map.invalidateSize()
  }, 250)

  map.on('click', async (e) => {
    const { lat, lng } = e.latlng
    updateMarker(lat, lng)
    reverseGeocode(lat, lng)
  })

  marker.on('dragend', () => {
    const { lat, lng } = marker.getLatLng()
    reverseGeocode(lat, lng)
  })
}

const locateMe = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords
      updateMarker(latitude, longitude)
      reverseGeocode(latitude, longitude)
    })
  }
}

const updateMarker = (lat, lng) => {
  if (marker) {
    marker.setLatLng([lat, lng])
    map.flyTo([lat, lng], 16, { duration: 1.5 })
  }
}

const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    const data = await res.json()
    if (data.display_name) {
      searchQuery.value = data.display_name
      emit('update:modelValue', data.display_name)
    }
  } catch (err) {}
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  if (searchQuery.value.length < 3) {
    suggestions.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    searching.value = true
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&limit=5`)
      const data = await res.json()
      suggestions.value = data.map(item => ({
        ...item,
        name: item.display_name.split(',')[0]
      }))
    } catch (err) {
    } finally {
      searching.value = false
    }
  }, 500)
}

const selectLocation = (s) => {
  const lat = parseFloat(s.lat)
  const lon = parseFloat(s.lon)
  updateMarker(lat, lon)
  searchQuery.value = s.display_name
  emit('update:modelValue', s.display_name)
  suggestions.value = []
  isFocused.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
  emit('update:modelValue', '')
}

onMounted(() => {
  initMap()
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== searchQuery.value) {
    searchQuery.value = newVal || ''
  }
})
</script>

<style>
/* Custom Marker Styling */
.marker-pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: #4253e8;
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(66, 83, 232, 0.3);
}

.marker-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -4px 0 0 -4px;
  z-index: 10;
}

/* Hide leaflet branding if desired */
.leaflet-control-attribution {
  font-size: 8px !important;
  background: rgba(255,255,255,0.5) !important;
}

.input:focus {
  box-shadow: 0 0 0 4px rgba(66, 83, 232, 0.1);
}
</style>
