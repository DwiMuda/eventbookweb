<template>
  <div class="flex h-screen overflow-hidden bg-surface-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-surface-0 border-r border-surface-200 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:relative lg:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <RouterLink to="/" class="group flex items-center gap-3 px-6 py-5 border-b border-surface-200">
        <div class="relative">
          <div class="absolute -inset-1 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative w-9 h-9 bg-surface-0 border border-surface-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="font-display font-bold text-lg text-ink tracking-tight leading-none">Event<span class="text-brand-600 dark:text-brand-400">Book</span></span>
          <span class="text-[10px] font-semibold text-ink-faint uppercase tracking-[0.15em] mt-1">Platform</span>
        </div>
      </RouterLink>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
          :class="isActive(item.path)
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
            : 'text-ink-muted hover:bg-surface-100 hover:text-ink'"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0 opacity-80" />
          {{ item.label }}
        </RouterLink>

        <!-- Theme Toggle (In Sidebar) -->
        <button 
          @click="toggleTheme" 
          class="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-sm font-medium text-ink-muted hover:bg-surface-100 hover:text-ink transition-colors"
        >
          <div class="w-5 h-5 flex items-center justify-center">
            <svg v-if="theme === 'light'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25M4.25 12H2v.034m17.664-7.664l-1.591 1.591M6.343 17.657l-1.591 1.591m12.728 0l-1.591-1.591M6.343 6.343L4.752 4.752M14.25 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <span>Mode {{ theme === 'light' ? 'Gelap' : 'Terang' }}</span>
        </button>
      </nav>

      <!-- User -->
      <div class="p-4 border-t border-surface-200">
        <div class="flex items-center gap-3 px-2">
          <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 flex items-center justify-center text-sm font-bold font-display">
            {{ auth.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ink truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-ink-faint truncate">{{ auth.user?.role }}</p>
          </div>
          <button @click="auth.logout()" class="p-1.5 rounded-lg text-ink-faint hover:bg-surface-100 hover:text-ink transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-sm lg:hidden dark:bg-black/60"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header class="flex items-center gap-4 px-6 py-4 bg-surface-0 border-b border-surface-200">
        <button
          class="lg:hidden p-2 rounded-lg text-ink-muted hover:bg-surface-100"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </header>

      <!-- Page -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-6xl mx-auto px-6 py-8">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
const auth = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)

const isActive = (path) => route.path.startsWith(path)

const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: {
      render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.75' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' })
      ])
    }
  },
  {
    path: '/events',
    label: 'Events',
    icon: {
      render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.75' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5' })
      ])
    }
  },
]
</script>
