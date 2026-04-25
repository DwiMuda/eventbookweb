<!-- src/views/DashboardView.vue -->
<template>
  <div>
    <!-- Page header -->
    <div class="page-header">
      <h1 class="page-title">
        Halo, {{ auth.user?.name?.split(' ')[0] }} 👋
      </h1>
      <p class="page-subtitle">Berikut ringkasan aktivitas event Anda</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatsCard 
        label="Tingkat Kehadiran" 
        :value="(stats?.checkinRate ?? 0) + '%'" 
        :sub="`${stats?.checkedInBookings ?? 0} peserta hadir`" 
        icon-bg="bg-emerald-50 text-emerald-600"
        :loading="loading"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatsCard>

      <StatsCard 
        label="Total Peserta" 
        :value="stats?.totalBookings ?? '—'" 
        sub="Booking terkonfirmasi" 
        icon-bg="bg-brand-50 text-brand-600"
        :loading="loading"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </template>
      </StatsCard>

      <StatsCard 
        label="Total Event" 
        :value="stats?.totalEvents ?? '—'" 
        sub="Event yang dikelola" 
        icon-bg="bg-purple-50 text-purple-600"
        :loading="loading"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
          </svg>
        </template>
      </StatsCard>
    </div>

    <!-- Recent events -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display font-semibold text-base text-ink">Event Terbaru</h2>
        <RouterLink to="/events" class="text-sm text-brand-600 hover:text-brand-700 font-medium">
          Lihat semua →
        </RouterLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="card">
          <SkeletonLoader width-class="w-16" height-class="h-4" class="mb-4" />
          <SkeletonLoader width-class="w-3/4" height-class="h-5" class="mb-2" />
          <SkeletonLoader width-class="w-full" height-class="h-4" class="mb-1" />
          <SkeletonLoader width-class="w-2/3" height-class="h-4" class="mb-4" />
          <SkeletonLoader width-class="w-full" height-class="h-2" />
        </div>
      </div>

      <div v-else-if="stats?.recentEvents?.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <EventCard v-for="event in stats.recentEvents" :key="event.id" :event="event" />
      </div>

      <div v-else class="card text-center py-12">
        <div class="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
          </svg>
        </div>
        <p class="font-medium text-ink mb-1">Belum ada event</p>
        <p class="text-sm text-ink-muted mb-4">Mulai buat event pertama Anda</p>
        <RouterLink to="/events/new" class="btn-primary btn-sm inline-flex">
          Buat Event
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardApi } from '@/api/index'
import StatsCard from '@/components/ui/StatsCard.vue'
import EventCard from '@/components/event/EventCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

const auth = useAuthStore()
const stats = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await dashboardApi.getStats()
    stats.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
