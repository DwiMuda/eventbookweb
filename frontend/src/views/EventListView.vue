<!-- src/views/EventListView.vue -->
<template>
  <div>
    <div class="page-header flex items-start justify-between gap-4">
      <div>
        <h1 class="page-title">Events</h1>
        <p class="page-subtitle">Kelola semua event Anda</p>
      </div>
      <RouterLink to="/events/new" class="btn-primary flex-shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Buat Event
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
          activeTab === tab.value
            ? 'bg-brand-600 text-white shadow-sm'
            : 'bg-surface-0 text-ink-muted border border-surface-200 hover:bg-surface-100'
        ]"
        @click="activeTab = tab.value; fetchEvents()"
      >
        {{ tab.label }}
      </button>

      <div class="ml-auto">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input v-model="search" class="input pl-9 w-56" placeholder="Cari event..." @input="debouncedFetch" />
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="card">
        <div class="skeleton h-4 w-16 mb-4" />
        <div class="skeleton h-5 w-3/4 mb-2" />
        <div class="skeleton h-4 w-full mb-1" />
        <div class="skeleton h-4 w-2/3 mb-4" />
        <div class="skeleton h-2 w-full" />
      </div>
    </div>

    <div v-else-if="events.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>

    <div v-else class="card text-center py-16">
      <div class="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
        </svg>
      </div>
      <p class="font-medium text-ink mb-1">Tidak ada event</p>
      <p class="text-sm text-ink-muted">Coba ubah filter atau buat event baru</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <button
        class="btn-secondary btn-sm"
        :disabled="pagination.page <= 1"
        @click="goToPage(pagination.page - 1)"
      >← Prev</button>
      <span class="text-sm text-ink-muted px-3">{{ pagination.page }} / {{ pagination.totalPages }}</span>
      <button
        class="btn-secondary btn-sm"
        :disabled="pagination.page >= pagination.totalPages"
        @click="goToPage(pagination.page + 1)"
      >Next →</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventsApi } from '@/api/index'
import EventCard from '@/components/event/EventCard.vue'

const events = ref([])
const loading = ref(true)
const search = ref('')
const activeTab = ref('')
const pagination = ref({ page: 1, totalPages: 1 })

const tabs = [
  { label: 'Semua', value: '' },
  { label: 'Aktif', value: 'ACTIVE' },
  { label: 'Ditutup', value: 'CLOSED' },
  { label: 'Draft', value: 'DRAFT' },
]

let debounceTimer
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchEvents, 300)
}

const fetchEvents = async (page = 1) => {
  loading.value = true
  try {
    const params = { page, limit: 9 }
    if (activeTab.value) params.status = activeTab.value
    if (search.value) params.search = search.value
    const { data } = await eventsApi.getAll(params)
    events.value = data.events
    pagination.value = data.pagination
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => fetchEvents(page)
onMounted(fetchEvents)
</script>
